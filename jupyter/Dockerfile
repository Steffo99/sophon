# Modified jupyter/scipy-notebook for better integration with Sophon

# Override the default "jovyan" user
ARG NB_USER="sophon"

# Set the base image of the notebook
FROM jupyter/scipy-notebook

# Image labels
LABEL maintainer="Stefano Pigozzi <me@steffo.eu>"

# As the default user...
USER ${NB_UID}
WORKDIR "${HOME}"

# Install the JupyterLab Sophon theme
RUN jupyter labextension install "jupyterlab_theme_sophon"
# Enable the JupyterLab Sophon theme
RUN jupyter labextension enable "jupyter_theme_sophon"
# Set the JupyterLab Sophon theme as default
RUN mkdir -p '.jupyter/lab/user-settings/@jupyterlab/apputils-extension/'
RUN echo '{"theme": "JupyterLab Sophon"}' > ".jupyter/lab/user-settings/@jupyterlab/apputils-extension/themes.jupyterlab-settings"

# Set useful envvars for Sophon notebooks
ENV JUPYTER_ENABLE_LAB=yes
ENV RESTARTABLE=yes
ENV GRANT_SUDO=yes
