from __future__ import annotations
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from sophon.core.models import SophonGroupModel, ResearchGroup
from sophon.projects.models import ResearchProject
from sophon.notebooks.docker import docker_client
from coolname import generate_slug
from logging import getLogger
from docker.models.containers import Container

log = getLogger(__name__)


class Notebook(SophonGroupModel):
    """
    A :class:`.Notebook` is a database representation of a Docker container running a JupyterLab instance.
    """

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

    container_image = models.CharField(
        "Container image",
        help_text="The Docker image to run for this notebook.",
        choices=(
            ("jupyter/base-notebook", "Base"),
            ("jupyter/minimal-notebook", "Python"),
            ("jupyter/scipy-notebook", "Python (Scientific)"),
            ("jupyter/tensorflow-notebook", "Python (Tensorflow)"),
            ("jupyter/r-notebook", "Python + R"),
            ("jupyter/pyspark-notebook", "Python (Scientific) + Apache Spark"),
            ("jupyter/all-spark-notebook", "Python (Scientific) + Scala + R + Apache Spark"),
        ),
        max_length=256,
    )

    container_id = models.CharField(
        "Container ID",
        help_text="The id of the Docker container running this notebook. If null, the notebook is not running.",
        blank=True, null=True,
        max_length=256,
    )

    volume_id = models.CharField(
        "Volume ID",
        help_text="The id of the Docker volume containing the data of this notebook. If null, the notebook doesn't currently have a volume, and will be created"
                  " the next time the container is started.",
        blank=True, null=True,
        max_length=256,
    )

    port = models.IntegerField(
        "Local port number",
        help_text="The port number of the local machine at which the container is available. If null, the notebook is not running.",
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
        }

    @classmethod
    def get_creation_fields(cls) -> set[str]:
        return {
            "slug",
            "project",
            "name",
            "container_image",
        }

    def is_container_running(self) -> bool:
        """
        :return: :data:`True` if the container of this Notebook is running, :data:`False` otherwise.
        """
        return bool(self.container_id)

    class ContainerError(Exception):
        """
        An error related to the container associated with a notebook.
        """

        def __init__(self, notebook: Notebook):
            self.notebook: Notebook = notebook

    def _make_container_error(self) -> ContainerError:
        """
        :return: A :exc:`ContainerError` instance with this :class:`Notebook` as parameter.
        """
        return self.ContainerError(notebook=self)

    class ContainerAlreadyRunningError(ContainerError):
        """
        Starting the container was not possible as it was already running.
        """

    def _make_container_already_running_error(self) -> ContainerAlreadyRunningError:
        """
        :return: A :exc:`ContainerAlreadyRunningError` instance with this :class:`Notebook` as parameter.
        """
        return self.ContainerAlreadyRunningError(notebook=self)

    def start_container(self) -> Container:
        """
        Start the container associated to this notebook.

        :raises ContainerAlreadyRunningError: If a container is already running.
        """
        if self.is_container_running():
            raise self._make_container_already_running_error()

        name = f"sophon-{generate_slug(2)}"

        log.info(f"Starting container {name} with image {self.container_image}")
        # FIXME: this is REALLY slow if the container isn't downloaded
        container: Container = docker_client.containers.run(self.container_image, detach=True, name=name, ports={"8888/tcp": "30034"})

        self.container_id = name
        self.port = 30034
        self.save()

        return container

    class ContainerNotRunningError(ContainerError):
        """
        Performing the requested action on the container was not possible as it was not running.
        """

    def _make_container_not_running_error(self) -> ContainerNotRunningError:
        """
        :return: A :exc:`ContainerNotRunningError` instance with this :class:`Notebook` as parameter.
        """
        return self.ContainerNotRunningError(notebook=self)

    def get_container(self) -> Container:
        """
        :return: The :class:`Container` associated with this :class:`Notebook`.
        :raises ContainerNotRunningError: If no associated container is running.
        """
        if not self.is_container_running():
            raise self._make_container_not_running_error()
        return docker_client.containers.get(self.container_id)

    def stop_container(self) -> None:
        """
        Stop the container associated with this :class:`Notebook`.
        """
        container = self.get_container()
        log.info(f"Stopping container {self.container_id} ({self.container_image})")
        container.stop()
        self.container_id = None
        self.save()

    def __str__(self):
        return self.name
