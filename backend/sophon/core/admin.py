from django.contrib import admin

from . import models


class SophonAdmin(admin.ModelAdmin):
    """
    Base :class:`django.contrib.admin.ModelAdmin` class from which all other admin classes inherit.
    """


@admin.register(models.ResearchGroup)
class ResearchGroupAdmin(SophonAdmin):
    list_display = (
        "slug",
        "name",
        "access",
    )

    ordering = (
        "slug",
    )
