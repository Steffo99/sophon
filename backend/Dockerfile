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
# I have no idea why this is needed
ENV DJANGO_SETTINGS_MODULE="sophon.settings"

# Start the uvicorn server
ENTRYPOINT ["poetry", "run", "gunicorn", "sophon.asgi:application", "-k", "uvicorn.workers.UvicornWorker"]
