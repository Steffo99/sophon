from __future__ import annotations

import logging
import os
import typing as t

import docker.errors
import docker.models.containers
import docker.models.images
import docker.models.networks
import docker.models.volumes
from django.contrib.auth.models import User
from django.db import models

from sophon.core.models import SophonGroupModel, ResearchGroup
from sophon.notebooks.apache import db as apache_db
from sophon.notebooks.apache import get_ephemeral_port, base_domain, http_protocol
from sophon.notebooks.docker import client as docker_client
from sophon.notebooks.docker import sleep_until_container_has_started
from sophon.notebooks.jupyter import generate_secure_token
from sophon.projects.models import ResearchProject

module_name = __name__


class Notebook(SophonGroupModel):
    """
    A :class:`.Notebook` is a database representation of a Docker container running a JupyterLab instance.
    """

    class_log = logging.getLogger(f"{module_name}.{__name__}")

    @property
    def log(self) -> logging.Logger:
        """
        :return: A logger specific to the Notebook, allowing filtering for specific Notebooks.
        """
        return logging.getLogger(f"{module_name}.{self.__class__.__name__}.{self.slug}")

    slug = models.SlugField(
        "Slug",
        help_text="Unique alphanumeric string which identifies the project. Changing this once the container has been created <strong>will break Docker</strong>!",
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

    # TODO: Find a way to prevent Internet access without using the --internal flag, as it doesn't allow to expose ports
    internet_access = models.BooleanField(
        "Allow internet access",
        help_text="If true, the notebook will be able to access the Internet as the host machine. Can only be set by a superuser via the admin interface. "
                  "<em>Does not currently do anything.</em>",
        default=True,
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
            "internet_access",
            "jupyter_token",
            "is_running",
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
    def network_name(self) -> str:
        """
        :return: The name given to the network associated with this :class:`Notebook`.
        """
        return f"{os.environ.get('SOPHON_NETWORK_PREFIX', 'sophon-network')}-{self.slug}"

    @property
    def external_domain(self) -> str:
        """
        :return: The domain name where this :class:`Notebook` will be accessible on the Internet after its container is started.
        """
        return f"{self.slug}.{base_domain}"

    @property
    def lab_url(self) -> t.Optional[str]:
        """
        :return: The URL where the JupyterLab instance can be accessed.

        .. warning:: Anyone with this URL will have edit access to the Jupyter instance!
        """
        if not self.is_running:
            return None
        return f"{http_protocol}://{self.external_domain}/lab?token={self.jupyter_token}"

    @property
    def legacy_notebook_url(self) -> t.Optional[str]:
        """
        :return: The URL where the legacy Jupyter Notebook instance can be accessed.

        .. warning:: Anyone with this URL will have edit access to the Jupyter instance!
        """
        if not self.is_running:
            return None
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
        self.log.info(f"Created {volume!r}")
        return volume

    def get_network(self) -> t.Optional[docker.models.networks.Network]:
        """
        Get the :class:`~docker.models.networks.Network` associated with this :class:`Notebook`.

        :return: The retrieved :class:`~docker.models.networks.Network`, or :data:`None` if the network does not exist.
        :raises docker.errors.APIError: If something goes wrong in the network retrieval.
        """

        self.log.debug(f"Getting network {self.network_name!r}...")
        try:
            return docker_client.networks.get(self.network_name)
        except docker.errors.NotFound:
            return None

    def make_network(self) -> docker.models.networks.Network:
        """
        Get the :class:`~docker.models.networks.Network` associated with this :class:`Notebook`, or **create it** if it doesn't exist.

        :return: The resulting :class:`~docker.models.networks.Network`.
        :raises docker.errors.APIError: If something goes wrong in the network retrieval or creation.
        """

        self.log.debug(f"Making network {self.network_name!r}...")

        if network := self.get_network():
            self.log.debug(f"Network {self.network_name!r} exists: {network!r}")
            return network

        self.log.debug(f"Network does not exist, creating it now...")
        network = docker_client.networks.create(
            name=self.network_name,
            internal=not self.internet_access,
        )
        self.log.info(f"Created {network!r}")
        return network

    def disable_proxying(self) -> None:
        """
        Disable the proxying of this :class:`Notebook` by removing its URLs from the :data:`apache_db` and its port from :attr:`.port`.
        """

        self.log.debug("Unassigning port...")
        self.port = None

        self.log.debug("Removing entry from the apache_db...")
        try:
            del apache_db[self.external_domain]
        except KeyError:
            pass

        self.log.debug("Clearing port from the SQL database...")
        self.save()

    def enable_proxying(self) -> None:
        """
        Enable the proxying of this :class:`Notebook` by adding its URLs to the :data:`apache_db` and its port to :attr:`.port`.
        """

        self.log.debug("Getting free port...")
        self.port: int = get_ephemeral_port()

        self.log.debug("Adding entry to the apache_db...")
        apache_db[self.external_domain] = f"{self.internal_domain}"

        self.log.debug("Saving port to the SQL database...")
        self.save()

    def get_container(self) -> t.Optional[docker.models.containers.Container]:
        """
        Get the :class:`~docker.models.containers.Container` associated with this :class:`Notebook`.

        :return: The retrieved :class:`~docker.models.containers.Container`, or :data:`None` if no container is associated with this :class:`Notebook` or the associated container does not exist anymore.
        :raises docker.errors.NotFound: If no container was found with the id :attr:`.container_id`.
        """

        if self.container_id is None:
            return None
        return docker_client.containers.get(self.container_id)

    def sync_container(self) -> t.Optional[docker.models.containers.Container]:
        """
        Tries to get the :class:`~docker.models.containers.Container` associated with this :class:`Notebook` directly from Docker using its expected name:
        - if it returns a **running :class:`~docker.models.containers.Container`**, it sets the :attr:`.container_id` field and returns it;
        - if it returns a **exited :class:`~docker.models.containers.Container`**, it removes it and returns :data:`None`;
        - if it returns :data:`None`, it returns :data:`None`;
        - if it raises :exc:`docker.errors.NotFound`, it clears the :attr:`.container_id` field and returns :data:`None`.

        :return: Either a :class:`docker.models.containers.Container` or :data:`None`.
        """
        try:
            container = docker_client.containers.get(self.container_name)

        except docker.errors.NotFound:
            try:
                return self.remove_container()
            except self.ContainerError:
                return

        if container is None:
            return None

        if container.status == "exited":
            try:
                return self.remove_container()
            except self.ContainerError:
                return

        self.container_id = container.id
        # self.port = container.ports
        return container

    class ContainerError(Exception):
        """
        An error related to the :class:`~docker.models.containers.Container` associated with this :class:`Notebook`.
        """

    def remove_container(self) -> None:
        """
        Remove the :class:`~docker.models.containers.Container` associated with this :class:`Notebook`.

        :raises .ContainerError: If the :class:`Notebook` has no associated :class:`~docker.models.containers.Container`.
        """

        container = self.get_container()
        if container is None:
            raise self.ContainerError("Notebook has no associated Container")

        self.log.debug("Disabling proxying...")
        self.disable_proxying()

        self.log.debug("Stopping container...")
        container.stop()

        self.log.debug("Removing container...")
        container.remove()
        self.container_id = None

        self.log.debug("Clearing container_id in the SQL database...")
        self.save()

    @classmethod
    def pull_images(cls):
        """
        Ask the Docker daemon to pull the images defined in :attr:`.IMAGE_CHOICES`, so that there is no download delay when starting a container for a
        non-pulled image.
        """
        cls.class_log.debug("Pulling images in the available choices...")
        for image, _ in cls.IMAGE_CHOICES:
            cls.class_log.info(f"Pulling {image!r}...")
            docker_client.images.pull(image)

    def create_container(self) -> docker.models.containers.Container:
        """
        Create a :class:`~docker.models.containers.Container` and associate it with this :class:`Notebook`.

        :return: The created :class:`~docker.models.containers.Container`.
        :raises .ContainerError: If the :class:`Notebook` has already an associated :class:`~docker.models.containers.Container`.
        """
        if self.get_container():
            raise self.ContainerError("Notebook has already an associated Container")

        self.log.debug("Ensuring the container's volume exists...")
        volume = self.make_volume()

        self.log.debug("Ensuring the container's network exists...")
        network = self.make_network()

        self.log.debug("Enabling proxying...")
        self.enable_proxying()

        self.log.debug("Checking if the image is available...")
        try:
            docker_client.images.get(self.container_image)
        except docker.errors.ImageNotFound:
            self.log.warning("Image has not been pulled, creating the container will take a long time!")

        self.log.debug("Creating container...")
        container: docker.models.containers.Container = docker_client.containers.run(
            detach=True,
            image=self.container_image,
            name=self.container_name,
            ports={
                "8888/tcp": (f"127.0.0.1", f"{self.port}/tcp")
            },
            environment={
                "JUPYTER_ENABLE_LAB": "yes",
                "RESTARTABLE": "yes",
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

        self.container_id = container.id
        return container

    def stop_container(self) -> None:
        """
        Like :meth:`.remove_container`, but will sync the notebook state with Apache and the Docker daemon and won't raise an error if the
        :class:`~docker.models.containers.Container` already exists, instead not doing anything.
        """

        self.sync_container()
        try:
            self.remove_container()
        except self.ContainerError:
            pass

    def start_container(self) -> docker.models.containers.Container:
        """
        Like :meth:`.create_container`, but will sync the notebook state with Apache and the Docker daemon and won't raise an error if the
        :class:`~docker.models.containers.Container` already exists, instead returning the already existing object.
        """

        self.sync_container()
        try:
            return self.create_container()
        except self.ContainerError:
            return self.get_container()

    def sleep_until_container_has_started(self) -> None:
        """
        Calls :func:`sleep_until_container_has_started` on the associated container.

        :raises .ContainerError: If the :class:`Notebook` has no associated :class:`~docker.models.containers.Container`.
        """

        container = self.get_container()

        self.log.debug("Sleeping until the Container is healthy...")
        sleep_until_container_has_started(container)

    def start(self) -> None:
        """
        Create and start everything required for the :class:`Notebook` to work, blocking until it's all ready.
        """

        self.log.info("Starting Notebook...")
        self.start_container()
        self.sleep_until_container_has_started()

    def stop(self) -> None:
        """
        Stop and destroy everything used by the :class:`Notebook`, blocking until it's all torn down.
        """

        self.log.info("Stopping Notebook...")
        self.stop_container()

    @property
    def is_running(self) -> bool:
        """
        :return: :data:`True` if the :class:`Notebook` is :meth:`.start`\\ ed and ready, :data:`False` otherwise.
        """
        try:
            container = self.get_container()

        except docker.errors.NotFound:
            return False

        if container is None:
            return False

        if container.status == "exited":
            return False

        return True

    def sync_running(self) -> bool:
        """
        :return: :data:`True` if the :class:`Notebook` is :meth:`.start`\\ ed and ready, :data:`False` otherwise.

        .. warning:: As a side effect, this function calls :meth:`.sync_container`, updating the object's state. Therefore, it should not be used in attributes
                     reachable by GET requests.
        """

        container = self.sync_container()
        return container is not None

    def __str__(self):
        return self.name
