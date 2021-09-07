import abc
import typing as t
from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status

from sophon.core.models import ResearchGroup
from sophon.core.views import SophonGroupViewSet
from sophon.projects.models import ResearchProject
from sophon.notebooks.models import Notebook


class NotebooksViewSet(SophonGroupViewSet, metaclass=abc.ABCMeta):
    def get_group_from_serializer(self, serializer) -> ResearchGroup:
        return serializer.validated_data["project"].group

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
                    Q(project__visibility="PRIVATE", project__group__members__in=[self.request.user])
                )
            )

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
                Q(project__visibility="PRIVATE", project__group__members__in=[self.request.user])
            )
