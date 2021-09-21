from django.urls import path, include
import rest_framework.routers

from . import views


group_router = rest_framework.routers.DefaultRouter()
group_router.register("", views.ResearchProjectsByGroupViewSet, basename="research-project-by-group")

slug_router = rest_framework.routers.DefaultRouter()
slug_router.register("", views.ResearchProjectsBySlugViewSet, basename="research-project-by-slug")


urlpatterns = [
    path("by-group/<slug:group_slug>/", include(group_router.urls)),
    path("by-slug/", include(slug_router.urls)),
]
