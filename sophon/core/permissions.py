import logging
from rest_framework import permissions

log = logging.getLogger(__name__)


class CanViewObject(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.can_be_viewed_by(request.user)


class CanEditObject(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.can_be_edited_by(request.user)


class CanAdministrateObject(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.can_be_administrated_by(request.user)
