import rest_framework.routers
from django.urls import path, include

from . import views

router = rest_framework.routers.DefaultRouter()
router.register("groups", views.ResearchGroupViewSet, basename="research-group")
router.register("users/by-id", views.UsersByIdViewSet, basename="user-by-id")
router.register("users/by-username", views.UsersByUsernameViewSet, basename="user-by-username")

urlpatterns = [
    path("", include(router.urls)),
    path("instance/", views.SophonInstanceDetailsView.as_view()),
]
