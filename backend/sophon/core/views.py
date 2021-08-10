import abc
import typing

from django.db.models import QuerySet, Q
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.status import *

from . import models
from . import permissions


class SophonGroupViewSet(ModelViewSet):
    @property
    def permission_classes(self):
        if self.action == "update" or self.action == "partial_update":
            return [permissions.Edit]
        elif self.action == "destroy":
            return [permissions.Admin]
        else:
            return [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == "list":
            return self.get_queryset().model.get_view_serializer()
        elif self.action == "create" or self.action == "metadata":
            return self.get_queryset().model.get_creation_serializer()
        else:
            return self.get_object().get_access_serializer(self.request.user)


class ResearchGroupViewSet(SophonGroupViewSet):
    def get_queryset(self):
        return models.ResearchGroup.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # TODO: How do I add a property to the serializer?
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=HTTP_201_CREATED, headers=headers)


class ResearchProjectViewSet(SophonGroupViewSet):
    def get_queryset(self):
        if self.request.user.is_anonymous:
            return models.ResearchProject.objects.filter(
                Q(visibility="PUBLIC")
            )
        else:
            return models.ResearchProject.objects.filter(
                Q(visibility="PUBLIC") |
                Q(visibility="INTERNAL") |
                Q(visibility="PRIVATE", group__members__in=[self.request.user])
            )
