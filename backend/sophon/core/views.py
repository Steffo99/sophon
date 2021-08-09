import abc
import typing

from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework.viewsets import ViewSetMixin
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from . import models


class BaseSophonGroupModelViewSet(metaclass=abc.ABCMeta):
    @classmethod
    @abc.abstractmethod
    def get_model(cls) -> typing.Type[models.SophonGroupModel]:
        raise NotImplementedError()

    @classmethod
    def get_basename(cls) -> str:
        model = cls.get_model()
        return model._meta.object_name.lower()


class CreateSophonGroupModelMixin(CreateModelMixin, BaseSophonGroupModelViewSet, metaclass=abc.ABCMeta):
    def create(self, request, *args, **kwargs):
        ...


class ListSophonGroupModelMixin(ListModelMixin, BaseSophonGroupModelViewSet, metaclass=abc.ABCMeta):
    def list(self, request, *args, **kwargs):
        ...


class RetrieveSophonGroupModelMixin(RetrieveModelMixin, BaseSophonGroupModelViewSet, metaclass=abc.ABCMeta):
    def retrieve(self, request, *args, **kwargs):
        ...


class UpdateSophonGroupModelMixin(UpdateModelMixin, BaseSophonGroupModelViewSet, metaclass=abc.ABCMeta):
    def update(self, request, *args, **kwargs):
        ...


class DestroySophonGroupModelMixin(DestroyModelMixin, BaseSophonGroupModelViewSet, metaclass=abc.ABCMeta):
    def destroy(self, request, *args, **kwargs):
        ...


class SophonGroupModelViewSet(
    CreateSophonGroupModelMixin,
    ListSophonGroupModelMixin,
    RetrieveSophonGroupModelMixin,
    UpdateSophonGroupModelMixin,
    DestroySophonGroupModelMixin,
    ViewSetMixin,
    APIView,
    metaclass=abc.ABCMeta
):
    permission_classes = (AllowAny,)


class ResearchProjectViewSet(SophonGroupModelViewSet):
    @classmethod
    def get_model(self) -> typing.Type[models.SophonGroupModel]:
        return models.ResearchProject


class ResearchTagViewSet(SophonGroupModelViewSet):
    @classmethod
    def get_model(cls) -> typing.Type[models.SophonGroupModel]:
        return models.ResearchTag


# class ResearchProjectViewSet(custom_permissions.SophonGroupViewset):
#     @classmethod
#     def get_model(self):
#         return models.ResearchProject
#
#     def get_list_queryset(self):
#         query_sets = [models.ResearchProject.objects.filter(visibility="PUBLIC")]
#
#         if not self.request.user.is_anonymous:
#             query_sets.append(models.ResearchProject.objects.filter(visibility="INTERNAL"))
#             query_sets.append(models.ResearchProject.objects.filter(visibility="PRIVATE").filter(group__members__in=[self.request.user]))  # TODO: Ensure this works
#
#         return QuerySet.union(*query_sets)
#
#     def get_full_queryset(self):
#         return models.ResearchProject.objects.all()
#
#     # def create(self, request, *args, **kwargs):
#     #     ...
#
#
# class ResearchTagViewSet(custom_permissions.SophonGroupViewset):
#     @classmethod
#     def get_model(self):
#         return models.ResearchTag
#
#     def get_list_queryset(self):
#         return models.ResearchTag.objects.all()
#
#     def get_full_queryset(self):
#         return models.ResearchTag.objects.all()
#
#
# class DataFlowViewSet(viewsets.ModelViewSet):
#     """
#     Viewset for :class:`.models.DataFlow` instances.
#     """
#
#     queryset = models.DataFlow.objects.all()
#     serializer_class = serializers.DataFlowSerializer
#     permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]
#
#     @decorators.action(methods=["get"], detail=False)
#     def search(self, request: r.Request, *args, **kwargs):
#         """
#         Use Django and PostgreSQL's full text search capabilities to find DataFlows containing certain words in the
#         description.
#         """
#
#         log.debug("Searching DataFlows...")
#         if not (query := request.query_params.get("q")):
#             return response.Response({
#                 "success": False,
#                 "error": "No query was specified in the `q` query_param."
#             }, 400)
#
#         results = models.DataFlow.objects.filter(description__search=query)
#         page = self.paginate_queryset(results)
#         if page is not None:
#             serializer = self.get_serializer(page, many=True)
#             return self.get_paginated_response(serializer.data)
#
#         serializer = self.get_serializer(results, many=True)
#         return response.Response(serializer.data)
#
#
# class DataSourceViewSet(viewsets.ModelViewSet):
#     """
#     Viewset for :class:`.models.DataSource` instances.
#     """
#
#     queryset = models.DataSource.objects.all()
#     serializer_class = serializers.DataSourceSerializer
#     permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]
#
#     @decorators.action(methods=["post"], detail=True)
#     def sync(self, request: r.Request, *args, **kwargs):
#         """
#         Syncronize the :class:`.models.DataFlow`\\ s with the ones stored in the server of the
#         :class:`.models.DataSource`\\ .
#         """
#
#         log.debug(f"Getting DataSource from the database...")
#         db_datasource: models.DataSource = self.get_object()
#         try:
#             db_datasource.sync_flows()
#         except NotImplementedError:
#             return response.Response({
#                 "success": False,
#                 "error": "Syncing DataFlows is not supported on this DataSource."
#             }, 400)
#         except Exception as exc:
#             return response.Response({
#                 "success": False,
#                 "error": f"{exc}"
#             }, 500)
#
#         return response.Response({
#             "success": True,
#         })
