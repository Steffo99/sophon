import logging
import dbm
import os
import socket

log = logging.getLogger(__name__)
db_name = os.environ.get("APACHE_PROXY_EXPRESS_DBM", "proxy_express.dbm")

# FIXME: this crashes: bug in Python stdlib?
# log.info(f"Creating proxy_express database: {db_name}")
# db = dbm.open(db_name, "n")
# log.info(f"Created proxy_express database!")


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
