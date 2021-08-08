import logging
import enum
import abc
from django.db.models import Model as DjangoModel
from rest_framework.viewsets import ModelViewSet as DjangoViewSet
from rest_framework.serializers import ModelSerializer as DjangoSerializer

log = logging.getLogger(__name__)


class AccessLevel(enum.IntEnum):
    NONE = 0
    REGISTERED = 10
    MEMBER = 50
    OWNER = 100
    SUPERUSER = 200


class SophonGroupModel(DjangoModel):
    class Meta:
        abstract = True

    def get_group(self):
        raise NotImplementedError()

    # noinspection PyMethodMayBeStatic
    def get_access_to_view(self):
        return AccessLevel.NONE

    # noinspection PyMethodMayBeStatic
    def get_access_to_edit(self):
        return AccessLevel.MEMBER

    # noinspection PyMethodMayBeStatic
    def get_access_to_admin(self):
        return AccessLevel.OWNER

    def can_view(self, user):
        current = self.get_group().get_access_level(user)
        required = self.get_access_to_view()
        return current >= required

    def can_edit(self, user):
        current = self.get_group().get_access_level(user)
        required = self.get_access_to_edit()
        return current >= required

    def can_admin(self, user):
        current = self.get_group().get_access_level(user)
        required = self.get_access_to_admin()
        return current >= required


class SophonGroupViewset(abc.ABC, DjangoViewSet):
    shown_fields = []
    hidden_fields = []
    admin_fields = []
    immutable_fields = []

    @abc.abstractmethod
    def get_model(viewset):
        raise NotImplementedError()

    @abc.abstractmethod
    def get_viewable_queryset(viewset):
        raise NotImplementedError()

    @abc.abstractmethod
    def get_full_queryset(viewset):
        raise NotImplementedError()

    def get_queryset(viewset):
        if viewset.action == "list":
            return viewset.get_viewable_queryset()
        else:
            return viewset.get_full_queryset()

    def get_serializer_class(viewset):
        if viewset.action == "list":
            return viewset.get_viewable_serializer()
        elif viewset.action == "create":
            return viewset.get_administrable_serializer()
        else:
            obj = viewset.get_object()
            user = viewset.request.user
            if obj.can_admin(user):
                return viewset.get_administrable_serializer()
            elif obj.can_edit(user):
                return viewset.get_editable_serializer()
            elif obj.can_view(user):
                return viewset.get_viewable_serializer()
            else:
                return viewset.get_public_serializer()

    def get_shown_fields(viewset):
        return viewset.shown_fields

    def get_public_serializer(viewset):
        class PublicSerializer(DjangoSerializer):
            class Meta:
                model = viewset.get_model()
                fields = viewset.get_shown_fields()
                read_only_fields = fields

        return PublicSerializer

    def get_all_fields(viewset):
        return [*viewset.shown_fields, *viewset.hidden_fields]

    def get_viewable_serializer(viewset):
        class ViewableSerializer(DjangoSerializer):
            class Meta:
                model = viewset.get_model()
                fields = viewset.get_all_fields()
                read_only_fields = fields

        return ViewableSerializer

    def get_editable_fields(viewset):
        return [field for field in viewset.get_all_fields() if not (field in viewset.admin_fields or field in viewset.immutable_fields)]

    def get_editable_serializer(viewset):
        class EditableSerializer(DjangoSerializer):
            class Meta:
                model = viewset.get_model()
                fields = viewset.get_all_fields()
                read_only_fields = viewset.get_editable_fields()

        return EditableSerializer

    def get_administrable_fields(viewset):
        return [field for field in viewset.get_all_fields() if field not in viewset.immutable_fields]

    def get_administrable_serializer(viewset):
        class AdministrableSerializer(DjangoSerializer):
            class Meta:
                model = viewset.get_model()
                fields = viewset.get_all_fields()
                read_only_fields = viewset.get_administrable_fields()

        return AdministrableSerializer
