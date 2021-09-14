import enum
import logging
import time

import docker.errors
import docker.models.containers

log = logging.getLogger(__name__)

log.info("Connecting to Docker daemon...")
try:
    client: docker.DockerClient = docker.from_env()
except docker.errors.DockerException as e:
    log.fatal("Could not connect to the Docker daemon!")
    raise
else:
    log.info("Connection to Docker daemon successful!")


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


def sleep_until_container_has_started(container: docker.models.containers.Container) -> HealthState:
    """
    Sleep until the specified container is not anymore in the ``starting`` state.

    :param container: The container to check the health of.

    .. seealso:: https://stackoverflow.com/a/64971593/4334568
    """

    log.debug(f"Blocking until {container!r} has started...")

    while (health := get_health(container)) == HealthState.STARTING:
        # FIXME: I hope Django isn't single-threaded.
        time.sleep(0.5)

    if health == HealthState.HEALTHY:
        log.debug(f"{container!r} has started successfully!")
    elif health == HealthState.UNDEFINED:
        log.warning(f"{container!r} does not define an healthcheck.")
    else:
        log.warning(f"{container!r} failed during startup.")

    return health
