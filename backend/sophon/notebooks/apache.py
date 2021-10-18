import dbm.gnu
import logging
import os
import socket
import typing as t

log = logging.getLogger(__name__)
db_name = os.environ.get("APACHE_PROXY_EXPRESS_DBM", "/run/sophon/proxy/proxy.dbm")
base_domain = os.environ["APACHE_PROXY_BASE_DOMAIN"]
http_protocol = os.environ.get("APACHE_PROXY_HTTP_PROTOCOL", "https")


class ApacheDB:
    def __init__(self, filename: str):
        self.filename: str = filename
        log.debug(f"{self.filename}: Initializing...")
        with dbm.open(self.filename, "c"):
            pass

    @staticmethod
    def convert_to_bytes(item: t.Union[str, bytes]) -> bytes:
        if isinstance(item, str):
            log.debug(f"Encoding {item!r} as ASCII...")
            item = item.encode("ascii")
        return item

    def __getitem__(self, key: t.Union[str, bytes]) -> bytes:
        key = self.convert_to_bytes(key)
        log.debug(f"{self.filename}: Getting {key!r}...")
        with dbm.open(self.filename, "r") as adb:
            return adb[key]

    def __setitem__(self, key: bytes, value: bytes) -> None:
        key = self.convert_to_bytes(key)
        value = self.convert_to_bytes(value)
        log.debug(f"{self.filename}: Setting {key!r} → {value!r}...")
        with dbm.open(self.filename, "w") as adb:
            adb[key] = value

    def __delitem__(self, key):
        key = self.convert_to_bytes(key)
        log.debug(f"{self.filename}: Deleting {key!r}...")
        with dbm.open(self.filename, "w") as adb:
            del adb[key]


log.info(f"Creating proxy_express database: {db_name}")
db = ApacheDB(db_name)
log.info(f"Created proxy_express database!")


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
