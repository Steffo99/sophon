import django.contrib.admin
import django.contrib.auth.models

from . import models

django.contrib.admin.site.unregister(django.contrib.auth.models.Group)


class SophonAdmin(django.contrib.admin.ModelAdmin):
    """
    Base :class:`django.contrib.admin.ModelAdmin` class from which all other admin classes inherit.
    """


@django.contrib.admin.register(models.SophonInstanceDetails)
class SophonInstanceDetails(SophonAdmin):
    list_display = (
        "name",
        "id",
        "theme",
    )

    def get_actions(self, request):
        # Disable all actions
        return {}

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@django.contrib.admin.register(models.ResearchGroup)
class ResearchGroupAdmin(SophonAdmin):
    list_display = (
        "slug",
        "name",
        "access",
    )

    list_filter = (
        "access",
    )

    ordering = (
        "slug",
    )
