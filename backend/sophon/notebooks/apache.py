import dbm.gnu
import logging
import os
import pathlib
import socket
import typing as t

import lazy_object_proxy
from django.conf import settings

log = logging.getLogger(__name__)


class ApacheDB:
    def __init__(self, path: t.Union[str, pathlib.Path]):
        self.path: pathlib.Path
        if isinstance(path, str):
            self.path = pathlib.Path(path)
        else:
            self.path = path
        log.debug(f"Initializing directories...")
        os.makedirs(self.path.parent, exist_ok=True)
        log.debug(f"Initializing database...")
        with dbm.open(str(self.path), "c"):
            pass
        log.debug("Done!")

    @staticmethod
    def convert_to_bytes(item: t.Union[str, bytes]) -> bytes:
        if isinstance(item, str):
            log.debug(f"Encoding {item!r} as ASCII...")
            item = item.encode("ascii")
        return item

    def __getitem__(self, key: t.Union[str, bytes]) -> bytes:
        key = self.convert_to_bytes(key)
        log.debug(f"{self.path}: Getting {key!r}...")
        with dbm.open(str(self.path), "r") as adb:
            return adb[key]

    def __setitem__(self, key: bytes, value: bytes) -> None:
        key = self.convert_to_bytes(key)
        value = self.convert_to_bytes(value)
        log.debug(f"{self.path}: Setting {key!r} → {value!r}...")
        with dbm.open(str(self.path), "w") as adb:
            adb[key] = value

    def __delitem__(self, key):
        key = self.convert_to_bytes(key)
        log.debug(f"{self.path}: Deleting {key!r}...")
        with dbm.open(str(self.path), "w") as adb:
            del adb[key]


db = lazy_object_proxy.Proxy(lambda: ApacheDB(settings.PROXY_FILE))


def get_ephemeral_port() -> int:
    """
    Request a free TCP port from the operating system by opening and immediately closing a TCP socket.

    :return: A free port number.

    .. warning:: Prone to race conditions, be sure to bind something to the obtained port as soon as it is retrieved!

    .. seealso:: https://stackoverflow.com/a/36331860/4334568
    """

    sock: socket.socket = socket.socket()
    sock.bind(("localhost", 0))

    port: int
    _, port = sock.getsockname()

    return port
