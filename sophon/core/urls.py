from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register("projects", views.ProjectViewSet)
router.register("datasources", views.DataSourceViewSet)


urlpatterns = [
    path("", include(router.urls))
]