# AllowAny is re-exported
# noinspection PyUnresolvedReferences
from rest_framework.permissions import BasePermission, AllowAny


class Admin(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.can_admin(request.user)


class Edit(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.can_edit(request.user)
