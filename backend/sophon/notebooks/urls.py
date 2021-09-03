from django.urls import path, include
import rest_framework.routers

from . import views


project_router = rest_framework.routers.DefaultRouter()
project_router.register("", views.NotebooksByProjectViewSet, basename="notebook-by-project")


slug_router = rest_framework.routers.DefaultRouter()
slug_router.register("", views.NotebooksBySlugViewSet, basename="notebook-by-slug")


urlpatterns = [
    # It would be nice for this to be documented...
    path("by-project/<slug:project_slug>/", include(project_router.urls)),
    path("by-slug/", include(slug_router.urls)),
]
