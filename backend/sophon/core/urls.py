from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("datasources", views.DataSourceViewSet)
router.register("dataflows", views.DataFlowViewSet)
router.register("projects", views.ResearchProjectViewSet, basename=views.ResearchProjectViewSet.get_base_name())
router.register("tags", views.ResearchTagViewSet, basename=views.ResearchTagViewSet.get_base_name())
router.register("groups", views.ResearchGroupViewSet, basename=views.ResearchGroupViewSet.get_base_name())

urlpatterns = [
    path("", include(router.urls)),
]
