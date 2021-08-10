"""
This module contains some extensions to the :mod:`rest_framework.permissions` framework.
"""

from rest_framework.permissions import BasePermission, AllowAny


class Edit(BasePermission):
    """
    Authorize only users who :meth:`~sophon.core.models.SophonGroupModel.can_edit` the requested object.
    """

    def has_object_permission(self, request, view, obj):
        return obj.can_edit(request.user)


class Admin(BasePermission):
    """
    Authorize only users who :meth:`~sophon.core.models.SophonGroupModel.can_admin` the requested object.
    """

    def has_object_permission(self, request, view, obj):
        return obj.can_admin(request.user)


# Specify __all__ so that this can be imported as *
__all__ = (
    "BasePermission",
    "AllowAny",
    "Edit",
    "Admin",
)
