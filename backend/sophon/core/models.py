from __future__ import annotations
import typing
import abc
from django.db import models
from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from sophon.core.enums import SophonGroupAccess
from colorfield.fields import ColorField


class SophonModel(models.Model):
    """
    The **abstract** base class for any database model used by Sophon.

    .. warning:: Since its metaclass is :class:`django.db.ModelBase`, the :class:`abc.ABCMeta` metaclass can't be applied, so method implementation cannot be
                 checked at runtime.

    It implements utilities for serialization and authorization.
    """

    class Meta:
        abstract = True

    @classmethod
    @abc.abstractmethod
    def get_public_fields(cls) -> set[str]:
        """
        :return: A :class:`set` of field names that will **always** be serialized, even if the user has no access to the object.

        .. warning:: Be careful with the fields you add in this set, as it may cause accidental data leaks!
        """

        raise NotImplementedError()

    @classmethod
    def get_public_serializer(cls) -> typing.Type[ModelSerializer]:
        """
        :return: A :class:`.serializers.ModelSerializer` containing this object's public fields in _read-only_ mode.
        """

        class PublicSerializer(ModelSerializer):
            class Meta:
                model = cls
                fields = tuple(cls.get_public_fields())
                read_only_fields = fields

        return PublicSerializer

    @classmethod
    @abc.abstractmethod
    def get_private_fields(cls) -> set[str]:
        """
        :return: A :class:`set` of field names that will be serialized only to users with **View** permission on the object.
        """

        raise NotImplementedError()

    @classmethod
    def get_all_fields(cls) -> set[str]:
        """
        :return: The :meth:`set.union` of :meth:`.get_public_fields` and :meth:`.get_private_field` :class:`set`\\ s.
        """

        return set.union(
            cls.get_public_fields(),
            cls.get_private_fields(),
        )

    @abc.abstractmethod
    def can_view(self, user: User) -> bool:
        """
        :param user: The user to check the **View** permission of.
        :return: :data:`True` if the user can view the object's private fields, :data:`False` otherwise.
        """

        raise NotImplementedError()

    @classmethod
    def get_view_serializer(cls) -> typing.Type[ModelSerializer]:
        """
        :return: A :class:`.serializers.ModelSerializer` containing this object's public and private fields in _read-only_ mode.
        """

        class ViewSerializer(ModelSerializer):
            class Meta:
                model = cls
                fields = list(cls.get_all_fields())
                read_only_fields = fields

        return ViewSerializer

    @classmethod
    @abc.abstractmethod
    def get_editable_fields(cls) -> set[str]:
        """
        :return: A :class:`set` of field names that users with the **Edit** or **Admin** permission will be able to edit.
        """

        raise NotImplementedError()

    @classmethod
    def get_non_editable_fields(cls) -> set[str]:
        """
        :return: The fields that will be _read-only_ for an user with the **Edit** or **Admin** permission.
        """

        return set.difference(
            cls.get_all_fields(),
            cls.get_editable_fields(),
        )

    @abc.abstractmethod
    def can_edit(self, user: User) -> bool:
        """
        :param user: The user to check the **Edit** permission of.
        :return: :data:`True` if the user can edit the object's editable fields, :data:`False` otherwise.
        """

        raise NotImplementedError()

    @classmethod
    def get_edit_serializer(cls) -> typing.Type[ModelSerializer]:
        """
        :return: A :class:`.serializers.ModelSerializer` containing this object's public and private fields, where the fields returned by
                 :meth:`.get_non_editable_fields` are _read-only_.
        """

        class EditSerializer(ModelSerializer):
            class Meta:
                model = cls
                fields = list(cls.get_all_fields())
                read_only_fields = list(cls.get_non_editable_fields())

        return EditSerializer

    @classmethod
    @abc.abstractmethod
    def get_administrable_fields(cls) -> set[str]:
        """
        :return: A :class:`set` of field names that users with the **Admin** permission will be able to edit.
        """

        raise NotImplementedError()

    @classmethod
    def get_non_administrable_fields(cls) -> set[str]:
        """
        :return: The fields that will be _read-only_ for an user with the **Admin** permission.
        """

        return set.difference(
            cls.get_all_fields(),
            cls.get_administrable_fields(),
        )

    @abc.abstractmethod
    def can_admin(self, user: User) -> bool:
        """
        :param user: The user to check the **Admin** permission of.
        :return: :data:`True` if the user can view the object's administrable fields, :data:`False` otherwise.
        """

        raise NotImplementedError()

    @classmethod
    def get_admin_serializer(cls) -> typing.Type[ModelSerializer]:
        """
        :return: A :class:`.serializers.ModelSerializer` containing this object's public and private fields, where the fields returned by
                 :meth:`.get_non_administrable` are _read-only_.
        """

        class AdminSerializer(ModelSerializer):
            class Meta:
                model = cls
                fields = list(cls.get_all_fields())
                read_only_fields = list(cls.get_non_administrable_fields())

        return AdminSerializer


# noinspection PyAbstractClass
class SophonGroupModel(SophonModel):
    """
    The **abstract** base class for database objects belonging to a :class:`.ResearchGroup`.

    .. warning:: Since its metaclass is :class:`django.db.ModelBase`, the :class:`abc.ABCMeta` metaclass can't be applied, so method implementation cannot be
                 checked at runtime.
    """

    class Meta:
        abstract = True

    def get_group(self) -> ResearchGroup:
        """
        :return: The :class:`.ResearchGroup` this objects belongs to.
        """
        raise NotImplementedError()

    @classmethod
    def get_access_to_view(cls) -> SophonGroupAccess:
        """
        :return: The minimum required :class:`.SophonGroupAccess` to **View** this object.
        """
        return SophonGroupAccess.NONE

    @classmethod
    def get_access_to_edit(cls) -> SophonGroupAccess:
        """
        :return: The minimum required :class:`.SophonGroupAccess` to **Edit** this object.
        """
        return SophonGroupAccess.MEMBER

    @classmethod
    def get_access_to_admin(cls) -> SophonGroupAccess:
        """
        :return: The minimum required :class:`.SophonGroupAccess` to **Admin**\\ istrate this object.
        """
        return SophonGroupAccess.OWNER

    def can_view(self, user: User) -> bool:
        current = self.get_group().get_access(user)
        required = self.get_access_to_view()
        return current >= required

    def can_edit(self, user: User) -> bool:
        current = self.get_group().get_access(user)
        required = self.get_access_to_edit()
        return current >= required

    def can_admin(self, user: User) -> bool:
        current = self.get_group().get_access(user)
        required = self.get_access_to_admin()
        return current >= required

    def get_access_serializer(self, user: User) -> typing.Type[ModelSerializer]:
        """
        Select a :class:`.serializers.ModelSerializer` for this object based on the :class:`.User`\\ 's :class:`.SophonGroupAccess` to it.

        :param user: The :class:`.User` to select a serializer for.
        :return: The selected :class:`.serializers.ModelSerializer`.
        """
        if self.can_admin(user):
            return self.get_admin_serializer()
        elif self.can_edit(user):
            return self.get_edit_serializer()
        elif self.can_view(user):
            return self.get_view_serializer()
        else:
            return self.get_public_serializer()


class ResearchGroup(SophonGroupModel):
    """
    A :class:`.ResearchGroup` is a group of users which collectively own :class:`.ResearchProjects`.
    """

    slug = models.SlugField(
        "Slug",
        help_text="Unique alphanumeric string which identifies the group.",
        max_length=64,
        primary_key=True,
    )

    name = models.CharField(
        "Name",
        help_text="The display name of the group.",
        max_length=512,
    )

    description = models.TextField(
        "Description",
        help_text="A brief description of what the group is about, to be displayed in the overview.",
        blank=True,
    )

    owner = models.ForeignKey(
        User,
        help_text="The user who created the group, and therefore can add other users to it.",
        on_delete=models.CASCADE,
    )

    members = models.ManyToManyField(
        User,
        help_text="The users who belong to this group, including the owner.",
        related_name="is_a_member_of",
        blank=True,
    )

    access = models.CharField(
        "Access",
        help_text="A setting specifying how can users join this group.",
        choices=[
            ("MANUAL", "⛔️ Collaborators must be added manually"),
            ("OPEN", "❇️ Users can join the group freely"),
        ],
        default="MANUAL",
        max_length=16,
    )

    def get_group(self) -> ResearchGroup:
        return self

    @classmethod
    def get_public_fields(cls) -> set[str]:
        return {
            "slug",
            "name",
            "description",
            "owner",
            "members",
            "access",
        }

    @classmethod
    def get_private_fields(cls) -> set[str]:
        return set()

    @classmethod
    def get_editable_fields(cls) -> set[str]:
        return {
            "name",
            "description",
        }

    @classmethod
    def get_administrable_fields(cls) -> set[str]:
        return {
            "members",
            "access",
        }

    def get_access(self, user) -> SophonGroupAccess:
        """
        Get the :class:`SophonGroupAccess` that an user has on this group.
        """
        if user.is_superuser:
            return SophonGroupAccess.SUPERUSER
        elif user == self.owner:
            return SophonGroupAccess.OWNER
        elif user in self.members:
            return SophonGroupAccess.MEMBER
        elif not user.is_anonymous():
            return SophonGroupAccess.REGISTERED
        else:
            return SophonGroupAccess.NONE

    def __repr__(self):
        return f"<{self.__class__.__qualname__} {self.slug}>"

    def __str__(self):
        return f"{self.name}"


class ResearchTag(SophonGroupModel):
    """
    A :class:`.ResearchTag` is a keyword that :class:`.ResearchProject`\\ s can be associated with.
    """

    class Meta:
        unique_together = (
            (
                "group",
                "slug",
            ),
        )

    id = models.AutoField(
        "ID",
        primary_key=True,
    )

    group = models.ForeignKey(
        ResearchGroup,
        help_text="The group this tag belongs to.",
        on_delete=models.CASCADE,
    )

    slug = models.SlugField(
        "Slug",
        help_text="Unique alphanumeric string which identifies the tag in the group.",
        max_length=64,
    )

    name = models.CharField(
        "Name",
        help_text="The name of the tag.",
        max_length=512,
    )

    description = models.TextField(
        "Description",
        help_text="Additional information about the tag.",
    )

    color = ColorField(
        "Color",
        help_text="The color that the tag should have when displayed.",
        default="#FF7F00",
    )

    def get_group(self) -> ResearchGroup:
        return self.group

    @classmethod
    def get_public_fields(cls) -> set[str]:
        return {
            "slug",
            "name",
            "description",
            "color",
            "group",
        }

    @classmethod
    def get_private_fields(cls) -> set[str]:
        return set()

    @classmethod
    def get_editable_fields(cls) -> set[str]:
        return {
            "name",
            "description",
            "color",
        }

    @classmethod
    def get_administrable_fields(cls) -> set[str]:
        return {
            "group",
        }

    def __repr__(self):
        return f"<{self.__class__.__qualname__} {self.slug}>"

    def __str__(self):
        return f"[{self.name}]"


class ResearchProject(SophonGroupModel):
    """
    A :class:`.ResearchProject` is a work which may use zero or more :class:`.DataSource`\\ s to prove or disprove an
    hypothesis.
    """

    class Meta:
        unique_together = (
            (
                "group",
                "slug",
            ),
        )

    id = models.AutoField(
        "ID",
        primary_key=True,
    )

    group = models.ForeignKey(
        ResearchGroup,
        help_text="The group this project belongs to.",
        on_delete=models.CASCADE,
    )

    slug = models.SlugField(
        "Slug",
        help_text="Unique alphanumeric string which identifies the project in the group.",
        max_length=64,
    )

    name = models.CharField(
        "Name",
        help_text="The display name of the project.",
        max_length=512,
    )

    description = models.TextField(
        "Description",
        help_text="A brief description of the project, to be displayed in the overview.",
        blank=True,
    )

    visibility = models.CharField(
        "Visibility",
        help_text="A setting specifying who can view the project contents.",
        choices=[
            ("PUBLIC", "🌍 Public"),
            ("INTERNAL", "🏭 Internal"),
            ("PRIVATE", "🔒 Private"),
        ],
        default="INTERNAL",
        max_length=16,
    )

    tags = models.ManyToManyField(
        ResearchTag,
        help_text="The tags this project has been tagged with.",
        related_name="tagged",
        blank=True,
    )

    def get_group(self) -> ResearchGroup:
        return self.group

    @classmethod
    def get_public_fields(cls) -> set[str]:
        return {
            "slug",
            "visibility",
            "group",
        }

    @classmethod
    def get_private_fields(cls) -> set[str]:
        return {
            "name",
            "description",
            "tags",
        }

    @classmethod
    def get_editable_fields(cls) -> set[str]:
        return {
            "name",
            "description",
            "tags",
        }

    @classmethod
    def get_administrable_fields(cls) -> set[str]:
        return {
            "visibility"
            "group",
        }

    def __repr__(self):
        return f"<{self.__class__.__qualname__} {self.id}: {self.group.slug}/{self.slug}>"

    def __str__(self):
        return f"{self.slug}"
