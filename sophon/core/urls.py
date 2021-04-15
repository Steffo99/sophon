from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register("datasources", views.DataSourceViewSet)
router.register("dataflows", views.DataFlowViewSet)


urlpatterns = [
    path("projects/", views.ProjectListView),
    path("projects/", views.ProjectCreateView),
    path("projects/", views.ProjectRetrieveView),
    path("projects/", views.ProjectUpdateCollaboratorView),
    path("projects/", views.ProjectUpdateOwnerView),
    path("projects/", views.ProjectDestroyView),
    path("", include(router.urls)),
]
