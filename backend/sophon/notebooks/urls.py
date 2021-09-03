from django.urls import path, include
import rest_framework.routers

from . import views


router = rest_framework.routers.DefaultRouter()
router.register("by-slug", views.NotebooksBySlugViewSet, basename="notebook-by-slug")


urlpatterns = [
    # It would be nice for this to be documented...
    path("by-project/<slug:project_slug>/", views.NotebooksByProjectViewSet.as_view({"get": "list"})),
    path("", include(router.urls)),
]
