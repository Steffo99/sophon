"""
This module contains the base classes for models in all :mod:`sophon`, and additionally it contains some fundamental models required to have Sophon work
properly.
"""

from __future__ import annotations

import abc
import typing

import pkg_resources
from django.contrib.auth.models import User
from django.db import models
from rest_framework.serializers import ModelSerializer

from sophon.core.enums import SophonGroupAccess


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
    def get_fields(cls) -> set[str]:
        """
        :return: The :class:`set` of field names (as :class:`str`) that will be serialized in the ``list`` and ``retrieve`` actions.
        """

        raise NotImplementedError()

    @classmethod
    def get_view_serializer(cls) -> typing.Type[ModelSerializer]:
        """
        :return: The :class:`.serializers.ModelSerializer` containing this object's fields in _read-only_ mode.
        """

        class ViewSerializer(ModelSerializer):
            class Meta:
                model = cls
                fields = list(cls.get_fields())
                read_only_fields = fields

        return ViewSerializer

    @classmethod
    @abc.abstractmethod
    def get_editable_fields(cls) -> set[str]:
        """
        :return: The :class:`set` of field names (as :class:`str`) that users with the **Edit** or **Admin** permission should be able to edit.
        """

        raise NotImplementedError()

    @classmethod
    def get_non_editable_fields(cls) -> set[str]:
        """
        :return: The :class:`set` of field names (as :class:`str`) that will be _read-only_ for an user with the **Edit** or **Admin** permission.
        """

        return set.difference(
            cls.get_fields(),
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
        :return: The :class:`.serializers.ModelSerializer` which allows the user to edit the fields specified in :meth:`.get_editable_fields`.
        """

        class EditSerializer(ModelSerializer):
            class Meta:
                model = cls
                fields = list(cls.get_fields())
                read_only_fields = list(cls.get_non_editable_fields())

        return EditSerializer

    @classmethod
    @abc.abstractmethod
    def get_administrable_fields(cls) -> set[str]:
        """
        :return: The :class:`set` of field names (as :class:`str`) that users with the **Admin** permission should be able to edit.
        """

        raise NotImplementedError()

    @classmethod
    def get_non_administrable_fields(cls) -> set[str]:
        """
        :return: The :class:`set` of field names (as :class:`str`) that will be _read-only_ for an user with the **Admin** permission.
        """

        return set.difference(
            cls.get_fields(),
            cls.get_administrable_fields().union(cls.get_editable_fields()),
        )

    @abc.abstractmethod
    def can_admin(self, user: User) -> bool:
        """
        :param user: The user to check the **Admin** permission of.
        :return: :data:`True` if the user can edit the object's administrable fields, :data:`False` otherwise.
        """

        raise NotImplementedError()

    @classmethod
    def get_admin_serializer(cls) -> typing.Type[ModelSerializer]:
        """
        :return: A :class:`.serializers.ModelSerializer` which allows the user to edit the fields specified in :meth:`.get_editable_fields` and
                 :meth:`.get_administrable_fields`.
        """

        class AdminSerializer(ModelSerializer):
            class Meta:
                model = cls
                fields = list(cls.get_fields())
                read_only_fields = list(cls.get_non_administrable_fields())

        return AdminSerializer

    @classmethod
    @abc.abstractmethod
    def get_creation_fields(cls) -> set[str]:
        """
        :return: The :class:`set` of field names (as :class:`str`) that users should be able to specify when creating a new object of this class.
        """
        raise NotImplementedError()

    @classmethod
    def get_creation_serializer(cls) -> typing.Type[ModelSerializer]:
        """
        :return: A :class:`.serializers.ModelSerializer` which allows the user to define the fields specified in :meth:`.get_creation_fields`.
        """

        class CreateSerializer(ModelSerializer):
            class Meta:
                model = cls
                fields = list(cls.get_fields().union(cls.get_creation_fields()))
                read_only_fields = list(cls.get_fields().difference(cls.get_creation_fields()))

        return CreateSerializer


class SophonInstanceDetails(SophonModel):
    """
    Details about the Sophon instance itself.

    Only one object of this type should exist in a database.
    """

    class Meta:
        verbose_name = "Sophon instance details"
        verbose_name_plural = "Sophon instance details"

    id = models.IntegerField(
        "Instance details ID",
        primary_key=True,
        choices=(
            (1, "This"),
        ),
        default=1,
    )

    name = models.CharField(
        "Instance name",
        help_text="The name of this Sophon instance.",
        default="Sophon",
        max_length=128,
    )

    description = models.TextField(
        "Description",
        help_text="A description of this Sophon instance, to be displayed on its home page.",
        blank=True, null=True,
    )

    theme = models.CharField(
        "Theme",
        help_text="The bluelib theme of the Sophon instance.",
        choices=(
            ("sophon", "The Sophonity"),
            ("paper", "Sheet of Paper"),
            ("royalblue", "Royal Blue"),
            ("hacker", "Hacker Terminal"),
            ("amber", "Gestione Amber"),
        ),
        default="sophon",
        max_length=32,
    )

    @property
    def version(self) -> str:
        return pkg_resources.get_distribution("sophon").version

    @classmethod
    def get_fields(cls) -> set[str]:
        return {
            "name",
            "description",
            "theme",
            "version",
        }

    @classmethod
    def get_editable_fields(cls) -> set[str]:
        return {
            "name",
            "description",
            "theme",
        }

    def can_edit(self, user: User) -> bool:
        return user.is_superuser

    @classmethod
    def get_administrable_fields(cls) -> set[str]:
        return set()

    def can_admin(self, user: User) -> bool:
        return user.is_superuser

    @classmethod
    def get_creation_fields(cls) -> set[str]:
        return {
            "name",
            "description",
            "theme",
        }

    def __repr__(self):
        return self.name


# noinspection PyAbstractClass
class SophonGroupModel(SophonModel):
    """
    The **abstract** base class for database objects belonging to a :class:`.ResearchGroup`.

    .. warning:: Since its metaclass is :class:`django.db.ModelBase`, the :class:`abc.ABCMeta` metaclass can't be applied, so method implementation cannot be
                 checked at runtime.
    """

    class Meta:
        abstract = True

    @abc.abstractmethod
    def get_group(self) -> ResearchGroup:
        """
        :return: The :class:`.ResearchGroup` this objects belongs to.
        """
        raise NotImplementedError()

    @classmethod
    def get_access_to_edit(cls) -> SophonGroupAccess:
        """
        :return: The minimum required :class:`.SophonGroupAccess` to **Edit** this object.
        """
        return SophonGroupAccess.MEMBER

    def can_edit(self, user: User) -> bool:
        current = self.get_group().get_access(user)
        required = self.get_access_to_edit()
        return current >= required

    @classmethod
    def get_access_to_admin(cls) -> SophonGroupAccess:
        """
        :return: The minimum required :class:`.SophonGroupAccess` to **Admin**\\ istrate this object.
        """
        return SophonGroupAccess.OWNER

    def can_admin(self, user: User) -> bool:
        current = self.get_group().get_access(user)
        required = self.get_access_to_admin()
        return current >= required

    def get_access_serializer(self, user: User) -> typing.Type[ModelSerializer]:
        """
        Select a :class:`.serializers.ModelSerializer` for this object based on the :class:`.User`\\ 's :class:`.SophonGroupAccess` on it.

        :param user: The :class:`.User` to select a serializer for.
        :return: The selected :class:`.serializers.ModelSerializer`.
        """
        if self.can_admin(user):
            return self.get_admin_serializer()
        elif self.can_edit(user):
            return self.get_edit_serializer()
        else:
            return self.get_view_serializer()


class ResearchGroup(SophonGroupModel):
    """
    A :class:`.ResearchGroup` is a group of users which collectively own :class:`.ResearchProjects`.
    """

    slug = models.SlugField(
        "Slug",
        help_text="Unique alphanumeric string which identifies the group in the Sophon instance.",
        max_length=64,
        primary_key=True,
    )

    name = models.CharField(
        "Name",
        help_text="The displayed name of the group.",
        max_length=512,
    )

    description = models.TextField(
        "Description",
        help_text="A brief description of what the group is about.",
        blank=True, null=True,
    )

    members = models.ManyToManyField(
        User,
        help_text="The users who belong to this group.",
        related_name="is_a_member_of",
        blank=True,
    )

    owner = models.ForeignKey(
        User,
        help_text="The user who created the group, who is automatically a member.",
        on_delete=models.CASCADE,
    )

    access = models.CharField(
        "Access",
        help_text="A setting specifying how users can join the group.",
        choices=[
            ("MANUAL", "⛔️ Collaborators must be added manually"),
            # ("REQUEST", "✉️ Users can request an invite from the group owner"),
            ("OPEN", "❇️ Users can join the group freely"),
        ],
        default="MANUAL",
        max_length=16,
    )

    def get_group(self) -> ResearchGroup:
        return self

    @classmethod
    def get_fields(cls) -> set[str]:
        return {
            "slug",
            "name",
            "description",
            "owner",
            "members",
            "access",
        }

    @classmethod
    def get_editable_fields(cls) -> set[str]:
        return set()

    @classmethod
    def get_administrable_fields(cls) -> set[str]:
        return {
            "name",
            "description",
            "members",
            "access",
        }

    @classmethod
    def get_creation_fields(cls) -> set[str]:
        return {
            "slug",
            "name",
            "description",
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
        elif user in self.members.all():
            return SophonGroupAccess.MEMBER
        elif not user.is_anonymous:
            return SophonGroupAccess.REGISTERED
        else:
            return SophonGroupAccess.NONE

    def __str__(self):
        return f"{self.name}"
