from django.contrib import admin, messages

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


@admin.register(models.ResearchTag)
class ResearchTagAdmin(CoreAdmin):
    list_display = (
        "group",
        "slug",
        "name",
        "color",
    )

    ordering = (
        "slug",
    )


@admin.register(models.ResearchProject)
class ResearchProjectAdmin(CoreAdmin):
    list_display = (
        "group",
        "slug",
        "name",
        "visibility",
    )

    ordering = (
        "slug",
    )
