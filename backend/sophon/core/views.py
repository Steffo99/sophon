import abc
import typing as t

import deprecation
from django.contrib.auth.models import User
from rest_framework import status as s
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from . import models
from . import permissions
from . import serializers


class HTTPException(Exception):
    """
    An exception that can be raised in :class:`.SophonViewSet` hooks to respond to a request with an HTTP error.
    """
    def __init__(self, status: int):
        self.status = status

    def as_response(self) -> Response:
        return Response(status=self.status)


class ReadSophonViewSet(ReadOnlyModelViewSet, metaclass=abc.ABCMeta):
    """
    An extension to :class:`~rest_framework.viewsets.ReadOnlyModelViewSet` including some essential (but missing) methods.
    """

    # A QuerySet should be specified, probably
    @abc.abstractmethod
    def get_queryset(self):
        raise NotImplementedError()

    # Override the permission_classes property with this hack, as ModelViewSet doesn't have the get_permission_classes method yet
    @property
    def permission_classes(self):
        return self.get_permission_classes()

    # noinspection PyMethodMayBeStatic
    def get_permission_classes(self) -> t.Collection[t.Type[permissions.BasePermission]]:
        """
        The "method" version of the :attr:`~rest_framework.viewsets.ModelViewSet.permission_classes` property.

        :return: A collection of permission classes.
        """
        return permissions.AllowAny,

    def get_serializer_class(self):
        if self.action in ["list"]:
            return self.get_queryset().model.get_view_serializer()
        if self.action in ["create", "metadata"]:
            return self.get_queryset().model.get_creation_serializer()
        elif self.action in ["retrieve", "update", "partial_update", "destroy"]:
            return self.get_object().get_access_serializer(self.request.user)
        else:
            return self.get_custom_serializer_classes()

    # noinspection PyMethodMayBeStatic
    def get_custom_serializer_classes(self):
        """
        .. todo:: Define this.
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
        :raises HTTPException: If the request should be answered with an error.
        :return: A :class:`dict` of fields to be added / overriden to the object saved by the serializer.
        """
        return {}

    @deprecation.deprecated(details="Use `.hook_create()` instead.")
    def perform_create(self, serializer):
        """
        .. warning:: This function does nothing and may not be called on :class:`SophonViewSet`\\ s.
        """
        raise RuntimeError(f"`perform_create` may not be called on `SophonViewSet`s.")

    def create(self, request, *args, **kwargs):
        serializer: Serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            hook = self.hook_create(serializer)
        except HTTPException as e:
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
        """
        raise RuntimeError(f"`perform_update` may not be called on `SophonViewSet`s.")

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        try:
            hook = self.hook_update(serializer)
        except HTTPException as e:
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
        """
        raise RuntimeError(f"`perform_destroy` may not be called on `SophonViewSet`s.")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        try:
            self.hook_destroy()
        except HTTPException as e:
            return e.as_response()

        instance.delete()
        return Response(status=s.HTTP_204_NO_CONTENT)


class UserViewSet(ReadSophonViewSet):
    """
    A viewset to list registered users.
    """
    def get_queryset(self):
        return User.objects.all()

    def get_serializer_class(self):
        return serializers.UserSerializer

    # Small hack to make users listable by username
    # Might break if someone's username is all-numbers, but I'm not sure Django allows that
    def get_object(self):
        pk = self.kwargs["pk"]
        try:
            pk = int(pk)
        except ValueError:
            return User.objects.filter(username=pk).get()
        else:
            return User.objects.filter(id=pk).get()


class ResearchGroupViewSet(WriteSophonViewSet):
    """
    The viewset for :class:`~.models.ResearchGroup`\\ s.
    """

    def get_queryset(self):
        # All research groups are public, so it's fine to do this
        return models.ResearchGroup.objects.all()

    def hook_create(self, serializer) -> dict[str, t.Any]:
        # Add the owner field to the serializer
        return {
            "owner": self.request.user,
        }

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

        # noinspection PyPep8Naming
        Serializer = group.get_access_serializer(self.request.user)
        serializer = Serializer(instance=group)

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

        # noinspection PyPep8Naming
        Serializer = group.get_access_serializer(self.request.user)
        serializer = Serializer(instance=group)

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
            raise HTTPException(s.HTTP_403_FORBIDDEN)

        return {}

    def hook_update(self, serializer) -> dict[str, t.Any]:
        # Allow group transfers only to groups the user has Edit access on
        group: models.ResearchGroup = self.get_group_from_serializer(serializer)
        if not group.can_edit(self.request.user):
            raise HTTPException(s.HTTP_403_FORBIDDEN)

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
