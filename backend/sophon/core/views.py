from logging import getLogger

from rest_framework import viewsets, decorators, response, permissions

from . import models, serializers, permissions as custom_permissions

log = getLogger(__name__)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = models.Project.objects.all()

    @property
    def permission_classes(self):
        return {
            "list": [],
            "create": [permissions.IsAuthenticated],
            "retrieve": [custom_permissions.CanViewProject],
            "update": [custom_permissions.CanEditProject],
            "partial_update": [custom_permissions.CanEditProject],
            "destroy": [custom_permissions.CanAdministrateProject],
            None: [],
        }[self.action]

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.ProjectPrivateSerializer
        elif self.action == "create":
            return serializers.ProjectAdministrableSerializer
        else:
            project = self.get_object()
            user = self.request.user
            if project.can_be_administrated_by(user):
                return serializers.ProjectAdministrableSerializer
            elif project.can_be_edited_by(user):
                return serializers.ProjectEditableSerializer
            elif project.can_be_viewed_by(user):
                return serializers.ProjectViewableSerializer
            else:
                return serializers.ProjectPrivateSerializer


class DataFlowViewSet(viewsets.ModelViewSet):
    """
    Viewset for :class:`.models.DataFlow` instances.
    """

    queryset = models.DataFlow.objects.all()
    serializer_class = serializers.DataFlowSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]


class DataSourceViewSet(viewsets.ModelViewSet):
    """
    Viewset for :class:`.models.DataSource` instances.
    """

    queryset = models.DataSource.objects.all()
    serializer_class = serializers.DataSourceSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

    @decorators.action(methods=["post"], detail=True)
    def sync(self, request, *args, **kwargs):
        """
        Syncronize the :class:`.models.DataFlow`\\ s with the ones stored in the server of the
        :class:`.models.DataSource`\\ .
        """

        log.debug(f"Getting DataSource from the database...")
        db_datasource: models.DataSource = self.get_object()
        db_datasource.sync_flows()

        return response.Response({
            "success": True,
        })
