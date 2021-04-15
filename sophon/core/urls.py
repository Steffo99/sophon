from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register("projects_external", views.ProjectExternalViewSet)
router.register("projects_contributor", views.ProjectContributorViewSet)
router.register("projects_owner", views.ProjectOwnerViewSet)
router.register("datasources", views.DataSourceViewSet)
router.register("dataflows", views.DataFlowViewSet)


urlpatterns = [
    path("", include(router.urls))
]
