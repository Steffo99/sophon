from django.db.models import Q

from sophon.core.models import ResearchGroup
from sophon.core.views import SophonGroupViewSet
from sophon.notebooks.models import Notebook


class NotebooksByProjectViewSet(SophonGroupViewSet):
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

    def get_group_from_serializer(self, serializer) -> ResearchGroup:
        return serializer.validated_data["group"]


class NotebooksBySlugViewSet(SophonGroupViewSet):
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

    def get_group_from_serializer(self, serializer) -> ResearchGroup:
        return serializer.validated_data["group"]
