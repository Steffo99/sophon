import abc
import typing as t

from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from sophon.core.models import ResearchGroup
from sophon.core.serializers import dynamic_serializer, NoneSerializer
from sophon.core.views import SophonGroupViewSet
from sophon.notebooks.models import Notebook
from sophon.projects.models import ResearchProject


class NotebooksViewSet(SophonGroupViewSet, metaclass=abc.ABCMeta):
    def get_group_from_serializer(self, serializer) -> ResearchGroup:
        return serializer.validated_data["project"].group

    def get_custom_serializer_classes(self):
        if self.action in ["sync", "start", "lock", "unlock", "stop"]:
            return self.get_object().get_access_serializer(self.request.user)
        else:
            return NoneSerializer

    @action(["PATCH"], detail=True)
    def sync(self, request: Request, **kwargs):
        """
        Update the `Notebook`'s state.
        """
        notebook: Notebook = self.get_object()
        notebook.sync_container()
        Serializer = notebook.get_access_serializer(request.user)
        serializer = Serializer(notebook)
        return Response(serializer.data, status.HTTP_200_OK)

    @action(["PATCH"], detail=True)
    def start(self, request: Request, **kwargs):
        """
        Start the `Notebook`.
        """
        notebook: Notebook = self.get_object()
        notebook.start()
        Serializer = notebook.get_access_serializer(request.user)
        serializer = Serializer(notebook)
        return Response(serializer.data, status.HTTP_200_OK)

    @action(["PATCH"], detail=True)
    def lock(self, request: Request, **kwargs):
        """
        Lock the `Notebook`.

        Note that this does nothing on the backend; it's only meant to be an indication for the frontend.
        """
        notebook: Notebook = self.get_object()
        if notebook.locked_by is None:
            notebook.locked_by = self.request.user
        notebook.save()
        Serializer = notebook.get_access_serializer(request.user)
        serializer = Serializer(notebook)
        return Response(serializer.data, status.HTTP_200_OK)

    @action(["PATCH"], detail=True)
    def unlock(self, request: Request, **kwargs):
        """
        Unlock the `Notebook`.

        Note that this does nothing on the backend; it's only meant to be an indication for the frontend.
        """
        notebook: Notebook = self.get_object()
        notebook.locked_by = None
        notebook.save()
        Serializer = notebook.get_access_serializer(request.user)
        serializer = Serializer(notebook)
        return Response(serializer.data, status.HTTP_200_OK)

    @action(["PATCH"], detail=True)
    def stop(self, request: Request, **kwargs):
        """
        Stop the `Notebook`.
        """
        notebook: Notebook = self.get_object()
        notebook.stop()
        Serializer = notebook.get_access_serializer(request.user)
        serializer = Serializer(notebook)
        return Response(serializer.data, status.HTTP_200_OK)


class NotebooksByProjectViewSet(NotebooksViewSet):
    """
    Access `Notebook`s filtered by `ResearchProject`.
    """

    def get_queryset(self):
        if self.request.user.is_anonymous:
            return Notebook.objects.filter(
                Q(project__slug=self.kwargs["project_slug"]) &
                Q(project__visibility="PUBLIC")
            )
        else:
            return Notebook.objects.filter(
                Q(project__slug=self.kwargs["project_slug"]) & (
                        Q(project__visibility="PUBLIC") |
                        Q(project__visibility="INTERNAL") |
                        Q(project__visibility="PRIVATE", project__group__members__in=[self.request.user]) |
                        Q(project__visibility="PRIVATE", project__group__owner=self.request.user)
                )
            )

    def get_serializer_class(self):
        # Get the base serializer
        base = super().get_serializer_class()

        # Get the specific project we are retrieving the notebooks of
        project: ResearchProject = ResearchProject.objects.filter(pk=self.kwargs["project_slug"]).first()
        # Check if we have edit access on the project
        if project.can_edit(self.request.user):
            # Add the member fields to the base serializer

            # noinspection PyUnresolvedReferences
            fields = tuple(set(base.Meta.fields).union(Notebook.get_member_fields()))
            # noinspection PyUnresolvedReferences
            read_only_fields = tuple(set(base.Meta.read_only_fields).union(Notebook.get_member_fields()))

            return dynamic_serializer(_model=Notebook, _fields=fields, _read_only_fields=read_only_fields)
        else:
            return base

    def hook_create(self, serializer) -> dict[str, t.Any]:
        result = super().hook_create(serializer)
        project = ResearchProject.objects.filter(pk=self.kwargs["project_slug"]).get()
        return {
            **result,
            "project": project,
        }


class NotebooksBySlugViewSet(NotebooksViewSet):
    """
    Access `Notebook`s directly by their `slug`s.
    """

    def get_queryset(self):
        if self.request.user.is_anonymous:
            return Notebook.objects.filter(
                Q(project__visibility="PUBLIC")
            )
        else:
            return Notebook.objects.filter(
                Q(project__visibility="PUBLIC") |
                Q(project__visibility="INTERNAL") |
                Q(project__visibility="PRIVATE", project__group__members__in=[self.request.user]) |
                Q(project__visibility="PRIVATE", project__group__owner=self.request.user)
            )
