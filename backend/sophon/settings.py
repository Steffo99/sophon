"""
Django settings for sophon project.

Generated by 'django-admin startproject' using Django 3.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

import logging
import logging.config
import os
import pathlib
import platform
import secrets

import coloredlogs
import rest_framework.authentication

# <editor-fold desc="[Logging]">

# This must be the first thing set, or logging won't work properly.

log = logging.getLogger(__name__)

LOGGING = {
    "version": 1,
    "formatters": {
        "detail": {
            "()": coloredlogs.ColoredFormatter,
            "format": "{asctime:>19} | {name:<24} | {levelname:>8} | {message}",
            "style": "{",
        }
    },
    "handlers": {
        "console": {
            # Log to console
            "class": "logging.StreamHandler",
            "level": os.environ.get("LOGGING_LEVEL", "INFO"),
            "stream": "ext://sys.stdout",
            "formatter": "detail",
        },
    },
    "loggers": {
        "sophon": {
            "level": "DEBUG",
        },
        "django": {
            "level": "INFO",
        },
        "rest_framework": {
            "level": "INFO",
        },
    },
    "root": {
        "handlers": ["console"],
    }
}
logging.config.dictConfig(LOGGING)

# </editor-fold>

# <editor-fold desc="[Dynamic settings]">

# Set the cookie secret key
try:
    SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
except KeyError:
    log.warning("DJANGO_SECRET_KEY wasn't changed from the default value, cookies will be invalidated at every launch")
    SECRET_KEY = secrets.token_urlsafe(24)
log.debug(f"SECRET_KEY = {'*' * len(SECRET_KEY)}")

# Set debug mode
DEBUG = __debug__
if DEBUG:
    log.warning("DEBUG mode is on, run the Python interpreter with the -O option to disable.")
log.debug(f"{DEBUG = }")

# Set the hosts from which the admin page can be accessed, separated by pipes
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "").split("|")
if len(ALLOWED_HOSTS) == 0:
    log.warning(f"No DJANGO_ALLOWED_HOSTS are set, the admin page may not be accessible.")
log.debug(f"{ALLOWED_HOSTS = }")

# Set the origins from which the API can be called, separated by pipes
CORS_ALLOWED_ORIGINS = os.environ.get("DJANGO_ALLOWED_ORIGINS", "").split("|")
if len(CORS_ALLOWED_ORIGINS) == 0:
    log.warning(f"No DJANGO_ALLOWED_ORIGINS are set, the API may not be usable.")
log.debug(f"{CORS_ALLOWED_ORIGINS = }")

# Set the database engine to use with Sophon
try:
    DATABASE_ENGINE = os.environ["DJANGO_DATABASE_ENGINE"]
except KeyError:
    log.warning("DJANGO_DATABASE_ENGINE was not set, defaulting to PostgreSQL")
    DATABASE_ENGINE = "django.db.backends.postgresql"
log.debug(f"{DATABASE_ENGINE = }")

# Set the dbms to use with Sophon
try:
    DATABASE_HOST = os.environ["DJANGO_DATABASE_HOST"]
except KeyError:
    log.warning("DJANGO_DATABASE_HOST was not set, defaulting to the local PostgreSQL UNIX socket")
    DATABASE_HOST = ""
log.debug(f"{DATABASE_HOST = }")

# Set the database name to use with Sophon
try:
    DATABASE_NAME = os.environ["DJANGO_DATABASE_NAME"]
except KeyError:
    log.warning("DJANGO_DATABASE_NAME was not set, defaulting to `sophon`")
    DATABASE_NAME = "sophon"
log.debug(f"{DATABASE_NAME = }")

# Set the database user to login to the database as
try:
    DATABASE_USER = os.environ["DJANGO_DATABASE_USER"]
except KeyError:
    log.warning("DJANGO_DATABASE_USER was not set, defaulting to `sophon`")
    DATABASE_USER = "sophon"
log.debug(f"{DATABASE_USER = }")

# Set the database password to login to the database with
try:
    DATABASE_PASSWORD = os.environ["DJANGO_DATABASE_PASSWORD"]
except KeyError:
    log.warning("DJANGO_DATABASE_PASSWORD was not set, defaulting to none")
    DATABASE_PASSWORD = ""
log.debug(f"DATABASE_PASSWORD = {'*' * len(DATABASE_PASSWORD)}")

# Set the authentication backend to use to authenticate users
try:
    AUTHENTICATION_BACKEND = os.environ["DJANGO_AUTHENTICATION_BACKEND"]
except KeyError:
    log.warning("DJANGO_AUTHENTICATION_BACKEND was not set, defaulting to the standard Django model authentication")
    AUTHENTICATION_BACKEND = "django.contrib.auth.backends.ModelBackend"
log.debug(f"{AUTHENTICATION_BACKEND = }")

# Set the language to use in the admin page
try:
    LANGUAGE_CODE = os.environ["DJANGO_LANGUAGE_CODE"]
except KeyError:
    log.warning("DJANGO_LANGUAGE_CODE was not set, defaulting to American English")
    LANGUAGE_CODE = "en-us"
log.debug(f"{LANGUAGE_CODE = }")

# Set the time zone to use
try:
    TIME_ZONE = os.environ["DJANGO_TIME_ZONE"]
except KeyError:
    log.warning("DJANGO_TIME_ZONE was not set, defaulting to UTC")
    TIME_ZONE = "UTC"
log.debug(f"{TIME_ZONE = }")

# Set the directory to create static files at
try:
    STATIC_ROOT = os.environ["DJANGO_STATIC_ROOT"]
except KeyError:
    if platform.system() == "Windows":
        log.warning("DJANGO_STATIC_ROOT was not set, defaulting to `.\\static`")
        # I have no idea of why IDEA is trying to resolve this
        # noinspection PyUnresolvedReferences
        STATIC_ROOT = ".\\static"
    else:
        log.warning("DJANGO_STATIC_ROOT was not set, defaulting to `/run/sophon/static/`")
        # I have no idea of why IDEA is trying to resolve this
        # noinspection PyUnresolvedReferences
        STATIC_ROOT = "/run/sophon/static"
log.debug(f"{STATIC_ROOT = }")

# Set the URL where static files are served at
try:
    STATIC_URL = os.environ["DJANGO_STATIC_URL"]
except KeyError:
    log.warning("DJANGO_STATIC_URL was not set, defaulting to `/static/`")
    STATIC_URL = "/static/"
log.debug(f"{STATIC_URL = }")

# Set the directory where the apache proxy file will be created
try:
    PROXY_FILE = os.environ["DJANGO_PROXY_FILE"]
except KeyError:
    log.warning("DJANGO_PROXY_FILE was not set, defaulting to `./proxy.dbm`")
    PROXY_FILE = "./proxy.dbm"
log.debug(f"{PROXY_FILE = }")

# Set the protocol that the proxy will use
try:
    PROXY_PROTOCOL = os.environ["DJANGO_PROXY_PROTOCOL"]
except KeyError:
    log.warning("DJANGO_PROXY_PROTOCOL was not set, defaulting to HTTPS")
    PROXY_PROTOCOL = "https"
if PROXY_PROTOCOL not in ["http", "https"]:
    log.warning("Unrecognized DJANGO_PROXY_PROTOCOL, acceptable values are `http` and `https`.")
log.debug(f"{PROXY_PROTOCOL = }")

# Set the base domain that the proxy will use
try:
    PROXY_BASE_DOMAIN = os.environ["DJANGO_PROXY_BASE_DOMAIN"]
except KeyError:
    log.warning("DJANGO_PROXY_BASE_DOMAIN was not set, defaulting to `dev.sophon.steffo.eu`")
    PROXY_BASE_DOMAIN = "dev.sophon.steffo.eu"
log.debug(f"{PROXY_BASE_DOMAIN = }")

try:
    DOCKER_HOST = os.environ["DJANGO_DOCKER_HOST"]
except KeyError:
    log.warning("DJANGO_DOCKER_HOST was not set, defaulting to none (may cause problems)")
    DOCKER_HOST = None
log.debug(f"{DOCKER_HOST = }")

try:
    DOCKER_TLS_VERIFY = os.environ["DJANGO_DOCKER_TLS_VERIFY"]
except KeyError:
    log.warning("DOCKER_TLS_VERIFY was not set, defaulting to none (may cause problems)")
    DOCKER_TLS_VERIFY = None
log.debug(f"{DOCKER_TLS_VERIFY = }")

try:
    DOCKER_CERT_PATH = os.environ["DJANGO_DOCKER_CERT_PATH"]
except KeyError:
    log.warning("DOCKER_CERT_PATH was not set, defaulting to none (may cause problems)")
    DOCKER_CERT_PATH = None
log.debug(f"{DOCKER_CERT_PATH = }")

# </editor-fold>

# <editor-fold desc="[Static settings]">

# Set the base project directory
BASE_DIR = pathlib.Path(__file__).resolve().parent.parent

# Define the installed django apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.postgres',
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'sophon.core',
    'sophon.projects',  # Can be removed safely!
    'sophon.notebooks',  # Can be removed safely!
]

# Define the installed middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Define the root urlconf of the project
ROOT_URLCONF = 'sophon.urls'

# Define the installed template engines
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Define the path to the project wsgi application
WSGI_APPLICATION = 'sophon.wsgi.application'

# Configure the database
#
# Remember to run the following commands on a new installation:
# sudo -iu postgres
# createuser sophon
# createdb --owner=sophon sophon
#
# If you need to run tests, also ensure `sophon` is a superuser, or it won't be able to create and drop the testing database!
DATABASES = {
    'default': {
        'ENGINE': DATABASE_ENGINE,
        'HOST': DATABASE_HOST,  # Connect via UNIX socket (does not work on Windows)
        'NAME': DATABASE_NAME,
        'USER': DATABASE_USER,  # Connect using its own user, isolating sophon from the rest of the server
        'PASSWORD': DATABASE_PASSWORD,
    }
}

# Define the Django model password validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Define the Django authentication backends
AUTHENTICATION_BACKENDS = [
    AUTHENTICATION_BACKEND,
]

# Enable translation
USE_I18N = True

# Enable formatting
USE_L10N = True

# Enable timezones
USE_TZ = True

# Configure Django Rest Framework for the Sophon API
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        # Allow requests from all kinds of users
        'rest_framework.permissions.AllowAny'
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # Allow basic authentication
        'rest_framework.authentication.BasicAuthentication',
        # Allow session authentication
        'rest_framework.authentication.SessionAuthentication',
        # Allow bearer authentication
        'sophon.auth1.BearerTokenAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    # Paginate in groups of 100 resources
    'PAGE_SIZE': 100,
}

# Specify the URLs where the CORS middleware should be applied to
CORS_URLS_REGEX = r"^/api/"

# </editor-fold>
