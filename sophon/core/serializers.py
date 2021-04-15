from rest_framework import serializers
from . import models


class DataSourceSerializer(serializers.ModelSerializer):
    """
    Serializer for :class:`.models.DataSource` .
    """

    class Meta:
        model = models.DataSource
        fields = [
            "id",
            "name",
            "description",
            "url",
            "documentation",
            "data_content_type",
            "headers",
            "supports_agencyscheme",
            "supports_categoryscheme",
            "supports_codelist",
            "supports_conceptscheme",
            "supports_data",
            "supports_dataflow",
            "supports_datastructure",
            "supports_provisionagreement",
            "supports_preview",
            "supports_structurespecific_data",
            "builtin",
            "last_sync",
        ]
        read_only_fields = [
            "builtin",
            "last_sync",
        ]


class DataFlowSerializer(serializers.ModelSerializer):
    """
    Serializer for :class:`.models.DataFlow` .
    """

    class Meta:
        model = models.DataFlow
        fields = [
            "surrogate_id",
            "datasource",
            "id",
            "description",
        ]
        read_only_fields = [
            "surrogate_id",
        ]


class ProjectExternalSerializer(serializers.ModelSerializer):
    """
    Serializer for :class:`.models.Project` when accessed from outside.
    """

    class Meta:
        model = models.Project
        fields = [
            "slug",
            "name",
            "visibility",
            "owner",
        ]
        read_only_fields = [
            "slug",
            "name",
            "visibility",
            "owner",
        ]


class ProjectCollaboratorSerializer(serializers.ModelSerializer):
    """
    Serializer for :class:`.models.Project` when accessed as a collaborator.
    """

    class Meta:
        model = models.Project
        fields = [
            "slug",
            "name",
            "description",
            "visibility",
            "owner",
            "collaborators",
            "flows",
        ]
        read_only_fields = [
            "slug",
            "visibility",
            "owner",
            "collaborators",
        ]


class ProjectOwnerSerializer(serializers.ModelSerializer):
    """
    Serializer for :class:`.models.Project` when accessed as the project owner.
    """

    class Meta:
        model = models.Project
        fields = [
            "slug",
            "name",
            "description",
            "visibility",
            "owner",
            "collaborators",
            "flows",
        ]
        read_only_fields = [
            "slug",
        ]
