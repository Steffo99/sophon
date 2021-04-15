from rest_framework import viewsets, decorators, response, permissions, mixins, generics
from . import models, serializers, permissions as custom_permissions
from datetime import datetime
from logging import getLogger

log = getLogger(__name__)


class ProjectViewSet(viewsets.GenericViewSet):
    queryset = models.Project.objects.all()

    def get_serializer_class(self):
        if self.action == ""


class ProjectListView(generics.ListAPIView):
    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectListSerializer
    permission_classes = []


class ProjectCreateView(generics.CreateAPIView):
    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectOwnerSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProjectRetrieveView(generics.RetrieveAPIView):
    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectCollaboratorSerializer
    permission_classes = [custom_permissions.CanViewProject]


class ProjectUpdateCollaboratorView(generics.UpdateAPIView):
    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectCollaboratorSerializer
    permission_classes = [custom_permissions.CanEditProject]


class ProjectUpdateOwnerView(generics.DestroyAPIView):
    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectOwnerSerializer
    permission_classes = [custom_permissions.CanAdministrateProject]


class ProjectDestroyView(generics.DestroyAPIView):
    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectCollaboratorSerializer
    permission_classes = [custom_permissions.CanAdministrateProject]


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

        log.debug(f"Requesting dataflows of {db_datasource!r}...")
        flows, structs = db_datasource.request_flows()

        log.info(f"Syncing DataFlows of {db_datasource!r}...")
        for description, sdmx_id in zip(flows, flows.index):

            log.debug(f"Searching in the database for: {db_datasource!r} | {sdmx_id!r}")
            try:
                db_flow = models.DataFlow.objects.get(datasource_id=db_datasource, sdmx_id=sdmx_id)
            except models.DataFlow.DoesNotExist:
                db_flow = models.DataFlow(
                    datasource_id=db_datasource,
                    sdmx_id=sdmx_id,
                    last_update=datetime.now(),
                    description=description,
                )
                log.info(f"Created new DataFlow: {db_flow!r}")
            else:
                db_flow.last_update = datetime.now()
                db_flow.description = description
                log.debug(f"Updated DataFlow: {db_flow!r}")

            db_flow.save()

        return response.Response({
            "updated": len(flows)
        })
