from django.urls import path, include
import rest_framework.routers

from . import views


router = rest_framework.routers.DefaultRouter()
router.register("groups", views.ResearchGroupViewSet, basename="research-group")
router.register("users", views.UserViewSet, basename="user")


urlpatterns = [
    path("", include(router.urls)),
    path("version", views.VersionView.as_view())
]
