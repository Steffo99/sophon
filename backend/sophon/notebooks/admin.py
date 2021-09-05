from django.contrib import admin
from sophon.core.admin import SophonAdmin

from . import models


@admin.register(models.Notebook)
class NotebookAdmin(SophonAdmin):
    list_display = (
        "slug",
        "name",
        "project",
        "locked_by",
        "container_image",
        "container_id",
        "port",
    )

    list_filter = (
        "container_image",
    )

    ordering = (
        "slug",
    )

    fieldsets = (
        (
            None, {
                "fields": (
                    "slug",
                    "name",
                    "project",
                    "locked_by",
                ),
            },
        ),
        (
            "Docker", {
                "fields": (
                    "container_image",
                    "container_id",
                ),
            },
        ),
        (
            "Proxy", {
                "fields": (
                    "port",
                ),
            },
        ),
        (
            "Jupyter", {
                "fields": (
                    "jupyter_token",
                ),
            },
        ),
    )
