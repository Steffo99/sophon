from django.contrib import admin
from sophon.core.admin import SophonAdmin

from . import models


@admin.register(models.ResearchProject)
class ResearchProjectAdmin(SophonAdmin):
    list_display = (
        "slug",
        "name",
        "group",
        "visibility",
    )

    list_filter = (
        "group",
        "visibility",
    )

    ordering = (
        "slug",
    )
