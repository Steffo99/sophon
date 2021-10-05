import rest_framework.routers
from django.urls import path, include

from . import views

router = rest_framework.routers.DefaultRouter()
router.register("groups", views.ResearchGroupViewSet, basename="research-group")
router.register("users", views.UserViewSet, basename="user")


urlpatterns = [
    path("", include(router.urls)),
    path("instance/", views.SophonInstanceDetailsView.as_view()),
]
