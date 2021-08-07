import logging

from rest_framework import permissions

log = logging.getLogger(__name__)


class CanAdministrate(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.can_be_administrated_by(request.user)


class CanEdit(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.can_be_edited_by(request.user)


class CanView(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.can_be_viewed_by(request.user)
