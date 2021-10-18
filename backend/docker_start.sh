#!/bin/bash

poetry run python ./manage.py migrate --no-input
poetry run python ./manage.py collectstatic --no-input
poetry run python ./manage.py initsuperuser
poetry run gunicorn sophon.asgi:application -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
