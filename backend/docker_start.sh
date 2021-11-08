#!/bin/bash

poetry run python -O ./manage.py migrate --no-input
poetry run python -O ./manage.py collectstatic --no-input
poetry run python -O ./manage.py initsuperuser
poetry run python -O -m gunicorn sophon.wsgi:application --workers=4 --bind=0.0.0.0:8000
