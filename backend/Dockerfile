FROM python:3.9.7-bullseye
LABEL maintainer="Stefano Pigozzi <me@steffo.eu>"

# Set the base workdir as seen in https://hub.docker.com/_/python/
WORKDIR /usr/src/app

# Install Poetry
RUN pip install 'poetry==1.1.11'

# Copy the environment requirements into the docker image
COPY pyproject.toml ./pyproject.toml
COPY poetry.lock    ./poetry.lock

# Install the dependencies using Poetry
RUN poetry install --no-root

# Copy the rest of the project into the container
COPY . .

# Install the project using Poetry
RUN poetry install

# Disable buffering as it may cause problems in logs
ENV PYTHONUNBUFFERED=1

# Tell Django where the settings module is
ENV DJANGO_SETTINGS_MODULE="sophon.settings"

# Store the DBM file in a nice place
ENV DJANGO_PROXY_FILE="/run/sophon/proxy/proxy.dbm"

# Set the static files directory
ENV DJANGO_STATIC_ROOT="/run/sophon/static"

# Start the uvicorn server
ENTRYPOINT ["bash", "./docker_start.sh"]
