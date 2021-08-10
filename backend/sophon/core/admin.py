from django.contrib import admin

from . import models


class CoreAdmin(admin.ModelAdmin):
    """
    :class:`django.contrib.admin.ModelAdmin` class from which all other admin classes inherit.
    """


@admin.register(models.ResearchGroup)
class ResearchGroupAdmin(CoreAdmin):
    list_display = (
        "slug",
        "name",
        "access",
    )

    ordering = (
        "slug",
    )
