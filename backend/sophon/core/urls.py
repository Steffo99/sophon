import typing

from django.urls import path, include
import rest_framework.routers

from . import views


router = rest_framework.routers.DefaultRouter()
router.register("groups", views.ResearchGroupViewSet, basename="research-group")
router.register("projects", views.ResearchProjectViewSet, basename="research-project")


urlpatterns = [
    path("", include(router.urls)),
]
