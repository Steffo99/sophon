import enum
import logging

import docker.errors
import docker.models.containers
import lazy_object_proxy
from django.conf import settings

log = logging.getLogger(__name__)


def get_docker_client() -> docker.DockerClient:
    log.info("Connecting to Docker daemon...")
    try:
        result = docker.from_env(environment=settings.__dict__)
    except docker.errors.DockerException as e:
        log.fatal("Could not connect to the Docker daemon!")
    else:
        log.info("Connection to Docker daemon successful!")
        return result


client: docker.DockerClient = lazy_object_proxy.Proxy(get_docker_client)


class HealthState(enum.IntEnum):
    """
    The health states a container can be in.
    """
    UNDEFINED = -2
    STARTING = -1
    HEALTHY = 0
    UNHEALTHY = 1


def get_health(container: docker.models.containers.Container) -> HealthState:
    """
    Get the :class:`HealthState` of a container.

    :param container: The container to get the health of.

    .. seealso:: https://stackoverflow.com/a/64971593/4334568
    """

    log.debug(f"Getting health of {container!r}...")
    results = client.api.inspect_container(container.name)

    if "Health" in results["State"]:
        health = results["State"]["Health"]["Status"]
        state = HealthState[health.upper()]
    else:
        state = HealthState.UNDEFINED

    log.debug(f"{container!r} is: {state!r}")
    return state


def get_proxy_container() -> docker.models.containers.Container:
    """
    :return: The container of the proxy, having the name specified in `settings.PROXY_CONTAINER_NAME`.
    """
    return client.containers.get(settings.PROXY_CONTAINER_NAME)
