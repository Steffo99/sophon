"""
The :mod:`sophon.notebooks` module provides the JupyterLab connection and functionality.

It depends on the following :mod:`django` apps:

- `sophon.core`
- `sophon.projects`

It can be configured with the following :data:`os.environ` keys:

- ``SOPHON_CONTAINER_PREFIX``: The prefix added to the names of notebooks' containers will have.
- ``SOPHON_VOLUME_PREFIX``: The prefix added to the names of notebooks' volumes will have.
- ``SOPHON_NETWORK_PREFIX``: The prefix added to the names of notebooks' volumes will have.
"""
