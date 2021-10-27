import abc
import typing as t

import deprecation
from django.contrib.auth.models import User
from django.db.models import QuerySet
from rest_framework import status as s
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from . import errors
from . import models
from . import permissions
from . import serializers


class ReadSophonViewSet(ReadOnlyModelViewSet, metaclass=abc.ABCMeta):
    """
    An extension to :class:`~rest_framework.viewsets.ReadOnlyModelViewSet` that includes some essential (but missing) methods.
    """

    @abc.abstractmethod
    def get_queryset(self) -> QuerySet:
        """
        :return: The :class:`~django.db.models.QuerySet` to use in the API request.

        .. note:: Ensure the requesting user can view the objects in the queryset!
        """
        raise NotImplementedError()

    # Override the permission_classes property with this hack, as ModelViewSet doesn't have the get_permission_classes method yet
    @property
    def permission_classes(self):
        return self.get_permission_classes()

    # noinspection PyMethodMayBeStatic
    def get_permission_classes(self) -> t.Collection[t.Type[permissions.BasePermission]]:
        return [permissions.AllowAny]

    def get_serializer_class(self) -> t.Type[Serializer]:
        """
        :return: The :class:`~rest_framework.serializers.Serializer` to use in the API request.

        .. note:: You probably won't need to edit this; the serializer is usually automatically selected based on the access that the user performing the request has on the requested resource.

        .. seealso:: :meth:`.models.SophonModel.get_access_serializer` and :meth:`.get_custom_serializer_classes`
        """
        if self.action in ["list"]:
            return self.get_queryset().model.get_view_serializer()
        if self.action in ["create", "metadata"]:
            return self.get_queryset().model.get_creation_serializer()
        elif self.action in ["retrieve", "update", "partial_update", "destroy"]:
            return self.get_object().get_access_serializer(self.request.user)
        else:
            return self.get_custom_serializer_classes()

    # noinspection PyMethodMayBeStatic
    def get_custom_serializer_classes(self) -> t.Type[Serializer]:
        """
        :return: The :class:`~rest_framework.serializers.Serializer` to use in the API request if a custom action is being run.
        """
        return serializers.NoneSerializer


class WriteSophonViewSet(ModelViewSet, ReadSophonViewSet, metaclass=abc.ABCMeta):
    """
    An extension to :class:`ReadSophonViewSet` that adds object-modifying methods.
    """

    # noinspection PyMethodMayBeStatic
    def hook_create(self, serializer) -> dict[str, t.Any]:
        """
        Hook called on ``create`` actions after the serializer is validated but before it is saved.

        :param serializer: The validated serializer containing the data of the object about to be created.
        :raises errors.HTTPException: If the request should be answered with an error.
        :return: A :class:`dict` of fields to be merged to the object saved by the serializer.
        """
        return {}

    @deprecation.deprecated(details="Use `.hook_create()` instead.")
    def perform_create(self, serializer):
        """
        .. warning:: This function does nothing and may not be called on :class:`SophonViewSet`\\ s.

        :raises RuntimeError: Always.
        """
        raise RuntimeError(f"`perform_create` may not be called on `SophonViewSet`s.")

    def create(self, request, *args, **kwargs) -> Response:
        """
        Custom version of :meth:`rest_framework.viewsets.ModelViewSet.create` that allows adding fields to the serializer before it is saved and interrupting the request with an exception.
        """
        serializer: Serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            hook = self.hook_create(serializer)
        except errors.HTTPException as e:
            return e.as_response()

        serializer.save(**hook)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=s.HTTP_201_CREATED, headers=headers)

    # noinspection PyMethodMayBeStatic
    def hook_update(self, serializer) -> dict[str, t.Any]:
        """
        Hook called on ``update`` and ``partial_update`` actions after the serializer is validated but before it is saved.

        :param serializer: The validated serializer containing the data of the object about to be updated.
        :raises HTTPException: If the request should be answered with an error.
        :return: A :class:`dict` of fields to be added / overriden to the object saved by the serializer.
        """
        return {}

    @deprecation.deprecated(details="Use `.hook_update()` instead.")
    def perform_update(self, serializer):
        """
        .. warning:: This function does nothing and may not be called on :class:`SophonViewSet`\\ s.

        :raises RuntimeError: Always.
        """
        raise RuntimeError(f"`perform_update` may not be called on `SophonViewSet`s.")

    def update(self, request, *args, **kwargs):
        """
        Custom version of :meth:`rest_framework.viewsets.ModelViewSet.update` that allows adding fields to the serializer before it is saved and interrupting the request with an exception.
        """

        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        try:
            hook = self.hook_update(serializer)
        except errors.HTTPException as e:
            return e.as_response()

        serializer.save(**hook)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    # noinspection PyMethodMayBeStatic
    def hook_destroy(self) -> None:
        """
        Hook called on ``destroy`` before the object is deleted.

        :raises HTTPException: If the request should be answered with an error.
        """
        pass

    @deprecation.deprecated(details="Use `.hook_destroy()` instead.")
    def perform_destroy(self, serializer):
        """
        .. warning:: This function does nothing and may not be called on :class:`SophonViewSet`\\ s.

        :raises RuntimeError: Always.
        """
        raise RuntimeError(f"`perform_destroy` may not be called on `SophonViewSet`s.")

    def destroy(self, request, *args, **kwargs):
        """
        Custom version of :meth:`rest_framework.viewsets.ModelViewSet.update` that allows interrupting the request with an exception.
        """
        instance = self.get_object()

        try:
            self.hook_destroy()
        except errors.HTTPException as e:
            return e.as_response()

        instance.delete()
        return Response(status=s.HTTP_204_NO_CONTENT)


class UsersByIdViewSet(ReadSophonViewSet):
    """
    A read-only ViewSet that displays the users registered to the Sophon instance, accessible by id.
    """

    def get_queryset(self):
        return User.objects.order_by("id").all()

    def get_serializer_class(self):
        return serializers.UserSerializer

    def get_object(self):
        pk = self.kwargs["pk"]
        return User.objects.filter(id=pk).get()


class UsersByUsernameViewSet(ReadSophonViewSet):
    """
    A read-only ViewSet that displays the users registered to the Sophon instance, accessible by username.
    """

    def get_queryset(self):
        return User.objects.order_by("username").all()

    def get_serializer_class(self):
        return serializers.UserSerializer

    def get_object(self):
        pk = self.kwargs["pk"]
        return User.objects.filter(username=pk).get()


class ResearchGroupViewSet(WriteSophonViewSet):
    """
    A ViewSet that allows interactions with the Sophon Research Group.
    """

    def get_queryset(self):
        return models.ResearchGroup.objects.order_by("slug").all()

    def hook_create(self, serializer) -> dict[str, t.Any]:
        # Disallow group creation from anonymous users
        if self.request.user.is_anonymous:
            raise errors.HTTPException(status=401)

        # Add the owner field to the serializer
        return {
            "owner": self.request.user,
        }

    def hook_destroy(self) -> None:
        group: models.ResearchGroup = models.ResearchGroup.objects.get(pk=self.kwargs["pk"])

        # Disallow group destruction if the user doesn't have admin access to the group
        if not group.can_admin(self.request.user):
            raise errors.HTTPException(s.HTTP_403_FORBIDDEN)

    def get_permission_classes(self) -> t.Collection[t.Type[permissions.BasePermission]]:
        if self.action in ["destroy"]:
            return permissions.Admin,
        elif self.action in ["update", "partial_update"]:
            return permissions.Edit,
        else:
            return permissions.AllowAny,

    def get_custom_serializer_classes(self):
        if self.action in ["join", "leave"]:
            return self.get_object().get_access_serializer(self.request.user)
        else:
            return serializers.NoneSerializer

    @action(detail=True, methods=["post"], name="Join group")
    def join(self, request, pk) -> Response:
        group = models.ResearchGroup.objects.get(pk=pk)

        # Raise an error if the user is already in the group
        if self.request.user in group.members.all():
            return Response(status=s.HTTP_409_CONFLICT)

        # Raise an error if the group doesn't allow member joins
        if group.access != "OPEN":
            return Response(status=s.HTTP_403_FORBIDDEN)

        # Add the user to the group
        group.members.add(self.request.user)

        serializer_class = group.get_access_serializer(self.request.user)
        serializer = serializer_class(instance=group)

        return Response(data=serializer.data, status=s.HTTP_200_OK)

    @action(detail=True, methods=["delete"], name="Leave group")
    def leave(self, request, pk):
        group = models.ResearchGroup.objects.get(pk=pk)

        # Raise an error if the user is not in the group
        if self.request.user not in group.members.all():
            return Response(status=s.HTTP_409_CONFLICT)

        # Raise an error if the user is the owner of the group
        if self.request.user == group.owner:
            return Response(status=s.HTTP_403_FORBIDDEN)

        # Add the user to the group
        group.members.remove(self.request.user)

        serializer_class = group.get_access_serializer(self.request.user)
        serializer = serializer_class(instance=group)

        return Response(data=serializer.data, status=s.HTTP_200_OK)


class SophonGroupViewSet(WriteSophonViewSet, metaclass=abc.ABCMeta):
    """
    A :class:`ModelViewSet` for objects belonging to a :class:`~.models.ResearchGroup`.
    """

    @abc.abstractmethod
    def get_group_from_serializer(self, serializer) -> models.ResearchGroup:
        """
        :param serializer: The validated serializer containing the data of the object about to be created.
        :return: The group the data in the serializer refers to.
        """
        raise NotImplementedError()

    def hook_create(self, serializer) -> dict[str, t.Any]:
        # Allow creation of objects only on groups the user has Edit access on
        group = self.get_group_from_serializer(serializer)
        if not group.can_edit(self.request.user):
            raise errors.HTTPException(s.HTTP_403_FORBIDDEN)

        return {}

    def hook_update(self, serializer) -> dict[str, t.Any]:
        # Allow group transfers only to groups the user has Edit access on
        group: models.ResearchGroup = self.get_group_from_serializer(serializer)
        if not group.can_edit(self.request.user):
            raise errors.HTTPException(s.HTTP_403_FORBIDDEN)

        return {}

    def get_permission_classes(self) -> t.Collection[t.Type[permissions.BasePermission]]:
        if self.action in ["destroy", "update", "partial_update"]:
            return permissions.Edit,
        else:
            return permissions.AllowAny,


class SophonInstanceDetailsView(APIView):
    """
    Get the details of this Sophon instance.
    """

    # noinspection PyMethodMayBeStatic,PyUnusedLocal
    def get(self, request, format=None):
        details = models.SophonInstanceDetails.objects.get()
        # noinspection PyPep8Naming
        ViewSerializer = details.get_view_serializer()
        serializer = ViewSerializer(instance=details)
        return Response(serializer.data, status=s.HTTP_200_OK)
