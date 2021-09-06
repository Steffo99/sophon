"""
The :mod:`sophon.notebooks` module provides the JupyterLab connection and functionality.

It depends on the following :mod:`django` apps:

- `sophon.core`
- `sophon.projects`

It can be configured with the following :data:`os.environ` keys:

- ``DOCKER_HOST``: The URL to the Docker host.
- ``DOCKER_TLS_VERIFY``: Verify the host against a CA certificate.
- ``DOCKER_CERT_PATH``: A path to a directory containing TLS certificates to use when connecting to the Docker host.
- ``APACHE_PROXY_EXPRESS_DBM``: The filename of the ``proxy_express`` DBM file to write to.
- ``APACHE_PROXY_BASE_DOMAIN``: The base domain for virtualhost reverse proxying.
- ``APACHE_PROXY_HTTP_PROTOCOL``: The http_protocol that Apache uses to make the containers available to the public.
- ``APACHE_PROXY_WS_PROTOCOL``: The http_protocol that Apache uses to make the Jupyter websocket available to the public.
- ``SOPHON_CONTAINER_PREFIX``: The prefix added to the names of notebooks' containers will have.
- ``SOPHON_VOLUME_PREFIX``: The prefix added to the names of notebooks' volumes will have.
"""