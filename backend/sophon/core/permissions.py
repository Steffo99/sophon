import logging

from rest_framework import permissions

log = logging.getLogger(__name__)


class CanAdministrateProject(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        project = obj.get_project()
        return project.can_be_administrated_by(request.user)


class CanEditProject(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        project = obj.get_project()
        return project.can_be_edited_by(request.user)


class CanViewProject(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        project = obj.get_project()
        return project.can_be_viewed_by(request.user)
