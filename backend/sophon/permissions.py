import typing
import logging
import enum
import abc

from django.db.models import Model as DjangoModel
from django.db.models import QuerySet
from rest_framework.viewsets import ModelViewSet as DjangoViewSet
from rest_framework.serializers import ModelSerializer as DjangoSerializer
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status as Status

log = logging.getLogger(__name__)

if typing.TYPE_CHECKING:
    from sophon.core.models import ResearchGroup


class SophonUserType(enum.IntEnum):
    NONE = 0
    REGISTERED = 10
    MEMBER = 50
    OWNER = 100
    SUPERUSER = 200


# Can't add abc.ABC here
class SophonGroupModel(DjangoModel):
    class Meta:
        abstract = True

    @abc.abstractmethod
    def get_group(self) -> "ResearchGroup":
        raise NotImplementedError()

    @classmethod
    @abc.abstractmethod
    def get_public_fields(cls) -> set[str]:
        raise NotImplementedError()

    @classmethod
    @abc.abstractmethod
    def get_view_fields(cls) -> set[str]:
        raise NotImplementedError()

    @classmethod
    def get_all_fields(cls) -> set[str]:
        return set.union(
            cls.get_public_fields(),
            cls.get_view_fields(),
        )

    @classmethod
    @abc.abstractmethod
    def get_edit_fields(cls) -> set[str]:
        raise NotImplementedError()

    @classmethod
    def get_non_editable_fields(cls) -> set[str]:
        return set.difference(
            cls.get_all_fields(),
            cls.get_edit_fields(),
        )

    @classmethod
    @abc.abstractmethod
    def get_admin_fields(cls) -> set[str]:
        raise NotImplementedError()

    @classmethod
    def get_non_admin_fields(cls) -> set[str]:
        return set.difference(
            cls.get_non_editable_fields(),
            cls.get_admin_fields(),
        )

    @classmethod
    def get_access_to_view(cls) -> SophonUserType:
        return SophonUserType.NONE

    @classmethod
    def get_access_to_edit(cls) -> SophonUserType:
        return SophonUserType.MEMBER

    @classmethod
    def get_access_to_admin(cls) -> SophonUserType:
        return SophonUserType.OWNER

    def can_view(self, user) -> bool:
        current = self.get_group().get_access_level(user)
        required = self.get_access_to_view()
        return current >= required

    def can_edit(self, user) -> bool:
        current = self.get_group().get_access_level(user)
        required = self.get_access_to_edit()
        return current >= required

    def can_admin(self, user) -> bool:
        current = self.get_group().get_access_level(user)
        required = self.get_access_to_admin()
        return current >= required

    @classmethod
    def get_public_serializer(cls) -> typing.Type[DjangoSerializer]:
        class PublicSerializer(DjangoSerializer):
            class Meta:
                model = cls
                fields = list(cls.get_public_fields())
                read_only_fields = fields

        return PublicSerializer

    @classmethod
    def get_view_serializer(cls) -> typing.Type[DjangoSerializer]:
        class ViewSerializer(DjangoSerializer):
            class Meta:
                model = cls
                fields = list(cls.get_all_fields())
                read_only_fields = fields

        return ViewSerializer

    @classmethod
    def get_edit_serializer(cls) -> typing.Type[DjangoSerializer]:
        class EditSerializer(DjangoSerializer):
            class Meta:
                model = cls
                fields = list(cls.get_all_fields())
                read_only_fields = list(cls.get_non_editable_fields())

        return EditSerializer

    @classmethod
    def get_admin_serializer(cls) -> typing.Type[DjangoSerializer]:
        class AdminSerializer(DjangoSerializer):
            class Meta:
                model = cls
                fields = list(cls.get_all_fields())
                read_only_fields = list(cls.get_non_admin_fields())

        return AdminSerializer

    def get_user_serializer(self, user) -> typing.Type[DjangoSerializer]:
        if self.can_admin(user):
            return self.get_admin_serializer()
        elif self.can_edit(user):
            return self.get_edit_serializer()
        elif self.can_view(user):
            return self.get_view_serializer()
        else:
            return self.get_public_serializer()


class SophonGroupViewset(abc.ABC, DjangoViewSet):
    @classmethod
    @abc.abstractmethod
    def get_model(cls) -> typing.Type[SophonGroupModel]:
        raise NotImplementedError()

    @abc.abstractmethod
    def get_list_queryset(self) -> QuerySet:
        raise NotImplementedError()

    @abc.abstractmethod
    def get_full_queryset(self) -> QuerySet:
        raise NotImplementedError()

    def get_queryset(self) -> QuerySet:
        if self.action == "list":
            return self.get_list_queryset()
        else:
            return self.get_full_queryset()

    @classmethod
    def get_base_name(cls) -> str:
        model = cls.get_model()
        return model._meta.object_name.lower()

    def get_serializer_class(self):
        model = self.get_model()

        if self.action == "list":
            return model.get_public_serializer()
        elif self.action == "create":
            return model.get_admin_serializer()
        else:
            obj: SophonGroupModel = self.get_object()
            return obj.get_user_serializer(self.request.user)

    def destroy(self, request: Request, *args, **kwargs):
        obj: SophonGroupModel = self.get_object()

        if not obj.can_admin(request.user):
            return Response(status=Status.HTTP_403_FORBIDDEN)

        self.perform_destroy(obj)
        return Response(status=Status.HTTP_204_NO_CONTENT)
