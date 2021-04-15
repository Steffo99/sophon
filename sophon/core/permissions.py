import logging
from rest_framework import permissions

log = logging.getLogger(__name__)


class ProjectPermissions(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if view.action == "retrieve":
            return obj.can_be_viewed_by(request.user)
        elif view.action == "update":
            return obj.can_be_edited_by(request.user)
        elif view.action == "partial_update":
            return obj.can_be_edited_by(request.user)
        elif view.action == "destroy":
            return obj.can_be_administrated_by(request.user)
        log.warning(f"Rejecting permissions for unknown action: {view.action}")
        return False
