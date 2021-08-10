from django.db.models import Q

from sophon.core.models import ResearchGroup
from sophon.core.views import SophonGroupViewSet

from . import models


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

    def get_group_from_serializer(self, serializer) -> ResearchGroup:
        return serializer.validated_data["group"]
