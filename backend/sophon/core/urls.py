import typing

from django.urls import path, include
import rest_framework.routers

from . import views


class SophonRouter(rest_framework.routers.DefaultRouter):
    def register_group_viewset(self, prefix, viewset: typing.Type[views.BaseSophonGroupModelViewSet]):
        self.register(prefix, viewset, basename=viewset.get_basename())


router = SophonRouter()
router.register_group_viewset("projects", views.ResearchProjectViewSet)
router.register_group_viewset("tags", views.ResearchTagViewSet)


urlpatterns = [
    path("", include(router.urls)),
]
