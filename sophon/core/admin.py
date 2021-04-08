from django.contrib import admin
from . import models


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    pass


@admin.register(models.DataSource)
class DataSourceAdmin(admin.ModelAdmin):
    pass


@admin.register(models.DataFlow)
class DataFlowAdmin(admin.ModelAdmin):
    pass
