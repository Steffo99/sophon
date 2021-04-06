# `sophon`

Django project for dataset collection

## Installation

The installation method depends on either #1 or #2.

For now, there is no way to install `sophon`.

## Configuration

The following environment variables should be set:

- `DJANGO_SECRET_KEY`: secret string used in the generation of session cookies
- `DJANGO_DEBUG`: if set, enables Django debug mode
- `DJANGO_DATABASE_HOST`: the hostname of the PostgreSQL database to use
- `DJANGO_DATABASE_NAME`: the name of the PostgreSQL database to use
- `DJANGO_DATABASE_USER`: the username of the PostgreSQL user to login as
- `DJANGO_DATABASE_PASSWORD`: the password of the PostgreSQL user to login as
- `DJANGO_LANGUAGE_CODE`: the language to use in the dynamic pages
- `DJANGO_TIME_ZONE`: the timezone to use in the display of datetimes

## Development

To run the project in development mode, run:

```bash
./manage.py runserver 127.0.0.1:30033
```

## Deployment

This project is not currently ready for production usage.