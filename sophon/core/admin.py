from django.contrib import admin
from . import models


class CoreAdmin(admin.ModelAdmin):
    """
    :class:`django.contrib.admin.ModelAdmin` class from which all other admin classes inherit.
    """


@admin.register(models.Project)
class ProjectAdmin(CoreAdmin):
    pass


@admin.register(models.DataSource)
class DataSourceAdmin(CoreAdmin):
    pass


@admin.register(models.DataFlow)
class DataFlowAdmin(CoreAdmin):
    pass
