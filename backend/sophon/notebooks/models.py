from __future__ import annotations

import os
import typing as t
import secrets
import logging

import docker.models.containers
import docker.models.volumes
import docker.errors
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

from sophon.core.models import SophonGroupModel, ResearchGroup
from sophon.projects.models import ResearchProject
from sophon.notebooks.docker import client as docker_client
from sophon.notebooks.docker import sleep_until_container_has_started
from sophon.notebooks.apache import db as apache_db
from sophon.notebooks.apache import get_ephemeral_port, base_domain, http_protocol
from sophon.notebooks.jupyter import generate_secure_token


class Notebook(SophonGroupModel):
    """
    A :class:`.Notebook` is a database representation of a Docker container running a JupyterLab instance.
    """

    @property
    def log(self) -> logging.Logger:
        """
        :return: A logger specific to the Notebook, allowing filtering for specific Notebooks.
        """
        return logging.getLogger(f"{__name__}.{self.__class__.__name__}.{self.slug}")

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

    jupyter_token = models.CharField(
        "Jupyter Access Token",
        help_text="The token to allow access to the JupyterLab editor.",
        default=generate_secure_token,
        max_length=64,
    )
    container_id = models.CharField(
        "Docker container ID",
        help_text="The id of the Docker container running this notebook. If null, the notebook does not have an associated container.",
        blank=True, null=True,
        max_length=256,
    )

    port = models.IntegerField(
        "Local port number",
        help_text="The port number of the local machine at which the container is available. Can be null if the notebook is not running.",
        blank=True, null=True,
        validators=[
            MinValueValidator(49152),
            MaxValueValidator(65535),
        ]
    )

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
            "lab_url",
            "legacy_notebook_url",
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

    @property
    def container_name(self) -> str:
        """
        :return: The name given to the container associated with this :class:`Notebook`.
        """
        return f"{os.environ.get('SOPHON_CONTAINER_PREFIX', 'sophon-container')}-{self.slug}"

    @property
    def volume_name(self) -> str:
        """
        :return: The name given to the volume associated with this :class:`Notebook`.
        """
        return f"{os.environ.get('SOPHON_VOLUME_PREFIX', 'sophon-volume')}-{self.slug}"

    @property
    def external_domain(self) -> str:
        """
        :return: The domain name where this :class:`Notebook` will be accessible on the Internet after its container is started.
        """
        return f"{self.slug}.{base_domain}"

    @property
    def lab_url(self) -> str:
        """
        :return: The URL where the JupyterLab instance can be accessed.

        .. warning:: Anyone with this URL will have edit access to the Jupyter instance!
        """
        return f"{http_protocol}://{self.external_domain}/lab?token={self.jupyter_token}"

    @property
    def legacy_notebook_url(self) -> str:
        """
        :return: The URL where the legacy Jupyter Notebook instance can be accessed.

        .. warning:: Anyone with this URL will have edit access to the Jupyter instance!
        """
        return f"{http_protocol}://{self.external_domain}/tree?token={self.jupyter_token}"

    @property
    def internal_domain(self) -> t.Optional[str]:
        """
        :return: The domain name where this :class:`Notebook` is accessible on the local machine, or :data:`None` if no port has been assigned to this
                 container yet.
        """
        if self.port is None:
            return None
        return f"localhost:{self.port}"

    def regenerate_secure_token(self):
        """
        Replace the current :attr:`.container_token` with a different one.

        .. warning:: Only effective after a container restart!
        """

        self.container_token = generate_secure_token()
        self.save()

    def get_volume(self) -> t.Optional[docker.models.volumes.Volume]:
        """
        Get the :class:`~docker.models.volumes.Volume` associated with this :class:`Notebook`.

        :return: The retrieved :class:`~docker.models.volumes.Volume`, or :data:`None` if the volume does not exist.
        :raises docker.errors.APIError: If something goes wrong in the volume retrieval.
        """

        self.log.debug(f"Getting volume {self.volume_name!r}...")
        try:
            return docker_client.volumes.get(self.volume_name)
        except docker.errors.NotFound:
            return None

    def make_volume(self) -> docker.models.volumes.Volume:
        """
        Get the :class:`~docker.models.volumes.Volume` associated with this :class:`Notebook`, or **create it** if it doesn't exist.

        :return: The resulting :class:`~docker.models.volumes.Volume`.
        :raises docker.errors.APIError: If something goes wrong in the volume retrieval or creation.
        """

        self.log.debug(f"Making volume {self.volume_name!r}...")

        if volume := self.get_volume():
            self.log.debug(f"Volume {self.volume_name!r} exists: {volume!r}")
            return volume

        self.log.debug(f"Volume does not exist, creating it now...")
        volume = docker_client.volumes.create(
            name=self.volume_name,
        )
        self.log.debug(f"Got {volume!r}")
        return volume

    def get_container(self) -> t.Optional[docker.models.containers.Container]:
        """
        **Get** the :class:`~docker.models.containers.Container` associated with this :class:`Notebook`.

        :return: The retrieved :class:`~docker.models.containers.Container`, or :data:`None` if no container is associated with this :class:`Notebook` or the associated container does not exist anymore.
        """

        if self.container_id is None:
            return None
        try:
            return docker_client.containers.get(self.container_id)
        except docker.errors.NotFound:
            return None

    def make_container(self) -> docker.models.containers.Container:
        """
        **Get** the :class:`~docker.models.containers.Container` associated with this :class:`Notebook`, or **create and start it** if it doesn't exist.

        :return: The resulting :class:`~docker.models.containers.Container`.
        """
        if container := self.get_container():
            return container

        self.log.debug("Ensuring the container's volume exists...")
        volume = self.make_volume()

        self.log.debug("Getting free port...")
        self.port: int = get_ephemeral_port()

        self.log.debug("Creating container...")
        # FIXME: try this with a non-downloaded container
        container: docker.models.containers.Container = docker_client.containers.run(
            detach=True,
            image=self.container_image,
            name=self.container_name,
            ports={
                "8888/tcp": f"{self.port}/tcp"
            },
            environment={
                "JUPYTER_ENABLE_LAB": "yes",
                "RESTARTABLE": "yes",
                # It isn't
                # "GRANT_SUDO": "yes",
                "JUPYTER_TOKEN": self.jupyter_token,
            },
            volumes={
                volume.name: {
                    "bind": "/home/jovyan",
                    "mode": "rw",
                }
            },
        )
        self.container_id = container.id

        self.log.debug("Waiting for container to start...")
        sleep_until_container_has_started(container)

        self.log.debug("Enabling proxying...")
        # noinspection HttpUrlsUsage
        apache_db[self.external_domain] = f"{self.internal_domain}"

        self.log.debug("Saving changes to the SQL database...")
        self.save()

    def unmake_container(self) -> None:
        """
        **Stop and delete** the container associated with this :class:`Notebook`, if it exists.
        """
        container = self.get_container()
        if container is None:
            self.log.debug("Container does not exist, returning...")
            return

        self.log.debug("Disabling proxying...")
        del apache_db[self.external_domain]

        self.log.debug("Unassigning port...")
        self.port = None

        self.log.debug("Stopping container...")
        container.stop()

        self.log.debug("Removing container...")
        container.remove()

        self.log.debug("Saving changes to the SQL database...")
        self.container_id = None
        self.save()

    def __str__(self):
        return self.name
