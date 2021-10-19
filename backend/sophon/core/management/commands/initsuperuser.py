import logging
from os import environ

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

log = logging.getLogger(__name__)


# Based on https://stackoverflow.com/a/39745576/4334568
class Command(BaseCommand):
    help = "Creates the superuser non-interactively if it doesn't exist"

    def handle(self, *args, **options):
        User = get_user_model()
        log.debug("Checking if an user already exists...")
        if not User.objects.exists():
            log.info("Creating superuser...")
            User.objects.create_superuser(
                username=environ["DJANGO_SU_USERNAME"],
                email=environ["DJANGO_SU_EMAIL"],
                password=environ["DJANGO_SU_PASSWORD"],
            )
        else:
            log.info("An user already exists, not creating superuser.")
