import abc

from django.db.models import Q

from sophon.core.models import ResearchGroup
from sophon.core.views import SophonGroupViewSet
from . import models


class ResearchProjectViewSet(SophonGroupViewSet, metaclass=abc.ABCMeta):
    def get_group_from_serializer(self, serializer) -> ResearchGroup:
        return serializer.validated_data["group"]


class ResearchProjectsByGroupViewSet(ResearchProjectViewSet):
    def get_queryset(self):
        if self.request.user.is_anonymous:
            return models.ResearchProject.objects.filter(
                Q(group__slug=self.kwargs["group_slug"]) &
                Q(visibility="PUBLIC")
            )
        else:
            return models.ResearchProject.objects.filter(
                Q(group__slug=self.kwargs["group_slug"]) & (
                        Q(visibility="PUBLIC") |
                        Q(visibility="INTERNAL") |
                        Q(visibility="PRIVATE", group__members__in=[self.request.user]) |
                        Q(visibility="PRIVATE", group__owner=self.request.user)
                )
            )


class ResearchProjectsBySlugViewSet(ResearchProjectViewSet):
    def get_queryset(self):
        if self.request.user.is_anonymous:
            return models.ResearchProject.objects.filter(
                Q(visibility="PUBLIC")
            )
        else:
            return models.ResearchProject.objects.filter(
                Q(visibility="PUBLIC") |
                Q(visibility="INTERNAL") |
                Q(visibility="PRIVATE", group__members__in=[self.request.user]) |
                Q(visibility="PRIVATE", group__owner=self.request.user)
            )
