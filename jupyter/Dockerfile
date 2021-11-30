# Modified jupyter/scipy-notebook for better integration with Sophon

FROM jupyter/scipy-notebook AS base
# Set the maintainer label
LABEL maintainer="Stefano Pigozzi <me@steffo.eu>"


FROM base AS env
# Set useful envvars for Sophon notebooks
ENV JUPYTER_ENABLE_LAB=yes
ENV RESTARTABLE=yes
ENV GRANT_SUDO=yes

# Enable real time collaboration
CMD ["start-notebook.sh", "--collaborative"]


FROM env AS extensions
# As the default user...
USER ${NB_UID}
WORKDIR "${HOME}"
# Install the JupyterLab Sophon theme
RUN jupyter labextension install "jupyterlab_theme_sophon"
# Enable the JupyterLab Sophon theme
RUN jupyter labextension enable "jupyterlab_theme_sophon"
# Set the JupyterLab Sophon theme as default
RUN mkdir -p '.jupyter/lab/user-settings/@jupyterlab/apputils-extension/'
RUN echo '{"theme": "JupyterLab Sophon"}' > ".jupyter/lab/user-settings/@jupyterlab/apputils-extension/themes.jupyterlab-settings"


FROM extensions AS healthcheck
# As root...
USER root
# Install curl
RUN apt-get update
RUN apt-get install -y curl
# Use curl to check the health status
HEALTHCHECK --start-period=5s --timeout=5s --interval=10s CMD ["curl", "--output", "/dev/null", "http://localhost:8888"]

# We probably should go back to the default user
USER ${NB_UID}