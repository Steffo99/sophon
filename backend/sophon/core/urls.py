from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("datasources", views.DataSourceViewSet)
router.register("dataflows", views.DataFlowViewSet)
router.register("projects", views.ResearchProjectViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
