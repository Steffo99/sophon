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
        "slug",
        "name",
    )


@admin.register(models.DataSource)
class DataSourceAdmin(CoreAdmin):
    """
    :class:`.CoreAdmin` class for :class:`.models.DataSource` .
    """

    list_display = (
        "id",
        "name",
        "data_content_type",
        "last_sync",
    )

    fieldsets = (
        (
            None, {
                "fields": (
                    "id",
                    "name",
                    "description",
                )
            }
        ),
        (
            "URLs", {
                "fields": (
                    "url",
                    "documentation",
                )
            }
        ),
        (
            "API configuration", {
                "fields": (
                    "data_content_type",
                    "headers",
                    "resources",
                )
            }
        ),
        (
            "Features supported", {
                "fields": (
                    "supports_agencyscheme",
                    "supports_categoryscheme",
                    "supports_codelist",
                    "supports_conceptscheme",
                    "supports_data",
                    "supports_dataflow",
                    "supports_datastructure",
                    "supports_provisionagreement",
                    "supports_preview",
                    "supports_structurespecific_data",
                )
            }
        ),
        (
            "Syncronization", {
                "fields": (
                    "last_sync",
                )
            }
        )
    )


@admin.register(models.DataFlow)
class DataFlowAdmin(CoreAdmin):
    """
    :class:`.CoreAdmin` class for :class:`.models.DataFlow` .
    """

    list_display = (
        "datasource",
        "id",
    )
