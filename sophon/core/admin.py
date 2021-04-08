from django.contrib import admin
from . import models


class CoreAdmin(admin.ModelAdmin):
    """
    :class:`django.contrib.admin.ModelAdmin` class from which all other admin classes inherit.
    """


@admin.register(models.Project)
class ProjectAdmin(CoreAdmin):
    """
    :class:`.CoreAdmin` class for :class:`.models.Project` .
    """

    list_display = (
        "name",
        "description",
    )


@admin.register(models.DataSource)
class DataSourceAdmin(CoreAdmin):
    """
    :class:`.CoreAdmin` class for :class:`.models.DataSource` .
    """

    list_display = (
        "pandasdmx_id",
        "builtin",
    )


@admin.register(models.DataFlow)
class DataFlowAdmin(CoreAdmin):
    """
    :class:`.CoreAdmin` class for :class:`.models.DataFlow` .
    """

    list_display = (
        "sdmx_id",
        "datasource_id",
        "description",
    )
