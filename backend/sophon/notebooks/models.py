from __future__ import annotations

import os
import typing as t
import secrets
import logging
import functools

import docker.models.containers
import docker.models.volumes
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

from sophon.core.models import SophonGroupModel, ResearchGroup
from sophon.projects.models import ResearchProject
from sophon.notebooks.docker import client as docker_client
from sophon.notebooks.docker import sleep_until_container_has_started
# from sophon.notebooks.apache import db as apache_db
from sophon.notebooks.apache import get_ephemeral_port


# FIXME: This just generated two copies of the same token. What's going on?
def generate_secure_token() -> str:
    """
    :return: A random secure string to be used as :attr:`.container_token`.
    """
    return secrets.token_urlsafe()


class Notebook(SophonGroupModel):
    """
    A :class:`.Notebook` is a database representation of a Docker container running a JupyterLab instance.
    """

    # <editor-fold desc="<Base fields>">
    slug = models.SlugField(
        "Slug",
        help_text="Unique alphanumeric string which identifies the project.",
        max_length=64,
        primary_key=True,
    )

    project = models.ForeignKey(
        ResearchProject,
        help_text="The project this notebook belongs to.",
        on_delete=models.CASCADE,
    )

    name = models.CharField(
        "Name",
        help_text="The display name of the notebook.",
        max_length=512,
    )

    locked_by = models.ForeignKey(
        User,
        help_text="The user who locked this notebook. If null, the notebook is unlocked.",
        on_delete=models.SET_NULL,
        blank=True, null=True,
    )
    # </editor-fold>

    # <editor-fold desc="<Logger>">
    @property
    def log(self) -> logging.Logger:
        return logging.getLogger(f"{__name__}.{self.slug}")
    # </editor-fold>

    # <editor-fold desc="<Container image field>">

    # Remember to make a migration when changing this!
    IMAGE_CHOICES = (
        ("jupyter/base-notebook", "Base"),
        ("jupyter/minimal-notebook", "Python"),
        ("jupyter/scipy-notebook", "Python (Scientific)"),
        ("jupyter/tensorflow-notebook", "Python (Tensorflow)"),
        ("jupyter/r-notebook", "Python + R"),
        ("jupyter/pyspark-notebook", "Python (Scientific) + Apache Spark"),
        ("jupyter/all-spark-notebook", "Python (Scientific) + Scala + R + Apache Spark"),
    )

    container_image = models.CharField(
        "Docker image",
        help_text="The Docker image to run for this notebook.",
        choices=IMAGE_CHOICES,
        max_length=256,
    )
    # </editor-fold>

    # <editor-fold desc="<Jupyter token field>">
    def regenerate_secure_token(self):
        """
        Replace the current :attr:`.container_token` with a different one.
        """

        self.container_token = generate_secure_token()
        self.save()

    jupyter_token = models.CharField(
        "Jupyter Access Token",
        help_text="The token to allow access to the JupyterLab editor.",
        blank=True, default=generate_secure_token,
        max_length=64,
    )
    # </editor-fold>

    # <editor-fold desc="<Docker fields>">
    container_id = models.CharField(
        "Docker container ID",
        help_text="The id of the Docker container running this notebook. If null, the notebook does not have an associated container.",
        blank=True, null=True,
        max_length=256,
    )

    @property
    def container_name(self):
        return f"{os.environ.get('SOPHON_CONTAINER_PREFIX', 'sophon-container')}-{self.slug}"

    @property
    def volume_name(self):
        return f"{os.environ.get('SOPHON_VOLUME_PREFIX', 'sophon-volume')}-{self.slug}"

    port = models.IntegerField(
        "Local port number",
        help_text="The port number of the local machine at which the container is available. Can be null if the notebook is not running.",
        blank=True, null=True,
        validators=[
            MinValueValidator(49152),
            MaxValueValidator(65535),
        ]
    )

    # </editor-fold>

    # <editor-fold desc="<SophonGroupModel methods>">
    def get_group(self) -> ResearchGroup:
        return self.project.group

    @classmethod
    def get_fields(cls) -> set[str]:
        return {
            "slug",
            "project",
            "name",
            "locked_by",
            "container_image",
            "jupyter_token",
        }

    @classmethod
    def get_editable_fields(cls) -> set[str]:
        return {
            "name",
            "locked_by",
        }

    @classmethod
    def get_administrable_fields(cls) -> set[str]:
        return {
            "project",
            "container_image",
            "jupyter_token",
        }

    @classmethod
    def get_creation_fields(cls) -> set[str]:
        return {
            "slug",
            "project",
            "name",
            "container_image",
            "jupyter_token",
        }
    # </editor-fold>

    # <editor-fold desc="<ContainerError classes>">
    class ContainerError(Exception):
        """
        An error related to the container associated with a notebook.
        """

        def __init__(self, notebook: Notebook):
            self.notebook: Notebook = notebook

    class ContainerNotAssociatedError(ContainerError):
        """
        No container is associated with this notebook.
        """

    class ContainerAlreadyAssociatedError(ContainerError):
        """
        A container is already associated with this notebook.
        """

    class ContainerNotRunningError(ContainerError):
        """
        Performing the requested action on the container was not possible as it was not running.
        """

    class ContainerAlreadyRunningError(ContainerError):
        """
        Starting the container was not possible as it was already running.
        """
    # </editor-fold>

    # <editor-fold desc="<Associated and running requirement methods>">
    def is_container_associated(self) -> bool:
        """
        :return: :data:`True` if this :class:`Notebook` has an associated container, :data:`False` otherwise.
        """
        return self.container_id is not None

    def get_container(self) -> t.Optional[docker.models.containers.Container]:
        """
        :return: The :class:`Container` associated with this :class:`Notebook`, or :data:`None` if no container is associated.
        """
        if not self.is_container_associated():
            return None
        return docker_client.containers.get(self.container_id)

    def is_container_running(self) -> bool:
        """
        :return: :data:`True` if the container associated with this :class:`Notebook` is running, :data:`False` otherwise, including if no container is associated.
        """
        container = self.get_container()
        if container is None:
            return False
        return container.status == "running"

    # </editor-fold>

    # <editor-fold desc="<Container methods>">
    def create_container(self) -> docker.models.containers.Container:
        """
        Create a new container and associate it with this :class:`Notebook`.

        :return: The created container.
        """

        if self.is_container_associated():
            raise self.ContainerAlreadyAssociatedError(self)

        self.log.debug("Creating volume...")
        volume: docker.models.volumes.Volume = docker_client.volumes.create(
            name=self.volume_name,
        )

        self.log.debug("Getting free port...")
        self.port: int = get_ephemeral_port()

        self.log.debug("Creating container...")
        # FIXME: try this with a non-downloaded container
        container: docker.models.containers.Container = docker_client.containers.create(
            image=self.container_image,
            name=self.container_name,
            ports={
                "8888/tcp": f"{self.port}/tcp"
            },
            environment={
                "JUPYTER_ENABLE_LAB": "yes",
                "RESTARTABLE": "yes",
                # FIXME: should be safe, but it might be a good idea to check
                "GRANT_SUDO": "yes",
                "JUPYTER_TOKEN": self.jupyter_token,
            },
            volumes={
                volume.name: {
                    "bind": "/home/jovyan",
                    "mode": "rw",
                }
            },
        )

        self.log.debug("Saving container id...")
        self.container_id = container.id
        self.save()

        return container

    def start_container(self) -> None:
        """
        Start the container associated with this :class:`Notebook`, if it exists, otherwise create a new one.
        """
        if self.is_container_running():
            self.ContainerAlreadyRunningError(self)

        if not self.is_container_associated():
            container = self.create_container()
        else:
            container = self.get_container()

        self.log.debug("Starting container...")
        container.start()

        self.log.debug("Waiting for container to start...")
        sleep_until_container_has_started(container)

        return container

    def stop_container(self) -> None:
        """
        Stop the container associated with this :class:`Notebook`.
        """
        if not self.is_container_running():
            self.ContainerNotRunningError(self)

        container = self.get_container()

        self.log.debug("Stopping container...")
        container.stop()

        self.log.debug("Unsetting port number...")
        self.port = None
        self.save()

    # </editor-fold>

    def __str__(self):
        return self.name
