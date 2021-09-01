from django.urls import path, include
import rest_framework.routers

from . import views


router = rest_framework.routers.DefaultRouter()


urlpatterns = [
    path("", include(router.urls)),
]
