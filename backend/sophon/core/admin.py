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


@admin.action(description="Sync DataFlows")
def sync_flows_admin(modeladmin, request, queryset):
    for datasource in queryset:
        datasource: models.DataSource
        try:
            datasource.sync_flows()
        except NotImplementedError:
            modeladmin.message_user(
                request,
                f"Skipped {datasource}: Syncing DataFlows is not supported on this DataSource.",
                level=messages.ERROR
            )
        except Exception as exc:
            modeladmin.message_user(
                request,
                f"Skipped {datasource}: {exc}",
                level=messages.ERROR
            )
        else:
            modeladmin.log_change(request, datasource, "Sync DataFlows")


@admin.register(models.DataSource)
class DataSourceAdmin(CoreAdmin):
    list_display = (
        "id",
        "name",
        "data_content_type",
        "last_sync",
    )

    ordering = (
        "last_sync",
    )

    actions = (
        sync_flows_admin,
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
    list_display = (
        "datasource",
        "sdmx_id",
        "description",
    )

    ordering = (
        "datasource",
        "sdmx_id",
    )
