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
            "sdmx_id",
            "description",
        ]
        read_only_fields = [
            "surrogate_id",
        ]


class ResearchGroupPublicSerializer(serializers.ModelSerializer):
    """
    Serializer for users who are not administrators of a :class:`.models.ResearchGroup`.
    """

    class Meta:
        model = models.ResearchGroup
        fields = (
            "slug",
            "name",
            "description",
            "owner",
            "members",
            "access",
        )
        read_only_fields = (
            "slug",
            "name",
            "description",
            "owner",
            "members",
            "access",
        )


class ResearchGroupAdminSerializer(serializers.ModelSerializer):
    """
    Serializer for users who are administrators of a :class:`.models.ResearchGroup`.
    """

    class Meta:
        model = models.ResearchGroup
        fields = (
            "slug",
            "name",
            "description",
            "owner",
            "members",
            "access",
        )
        read_only_fields = (
            "slug",
            "owner",
        )


class ResearchProjectPublicSerializer(serializers.ModelSerializer):
    """
    Serializer for users who are not collaborators of a :class:`~.models.ResearchProject` and do not have permissions to view it.
    """
    
    class Meta:
        model = models.ResearchProject
        fields = (
            "slug",
            "visibility",
            "group",
        )
        read_only_fields = (
            "slug",
            "visibility",
            "group",
        )


class ResearchTagPublicSerializer(serializers.ModelSerializer):
    """
    Serializer for users who are not owners of a :class:`.models.ResearchTag`.
    """

    # TODO: Add a list of projects with the tag

    class Meta:
        model = models.ResearchTag
        fields = (
            "slug",
            "name",
            "description",
            "color",
            "owner",
        )
        read_only_fields = (
            "slug",
            "name",
            "description",
            "color",
            "owner",
        )


class ResearchTagAdminSerializer(serializers.ModelSerializer):
    """
    Serializer for users who are owners of a :class:`.models.ResearchTag`.
    """

    # TODO: Add a list of projects with the tag

    class Meta:
        model = models.ResearchTag
        fields = (
            "slug",
            "name",
            "description",
            "color",
            "owner",
        )
        read_only_fields = (
            "slug",
            "owner",
        )


class ResearchProjectViewerSerializer(serializers.ModelSerializer):
    """
    Serializer for users who are not collaborators of a :class:`~.models.ResearchProject`, but have permissions to view it.
    """
    
    class Meta:
        model = models.ResearchProject
        fields = (
            "slug",
            "name",
            "description",
            "visibility",
            "group",
            "flows",
        )
        read_only_fields = (
            "slug",
            "name",
            "description",
            "visibility",
            "group",
            "flows",
        )


class ResearchProjectCollaboratorSerializer(serializers.ModelSerializer):
    """
    Serializer for users who are collaborators of a :class:`~.models.ResearchProject`, but not administrators.
    """
    
    class Meta:
        model = models.ResearchProject
        fields = (
            "slug",
            "name",
            "description",
            "visibility",
            "group",
            "flows",
        )
        read_only_fields = (
            "slug",
            "visibility",
            "group",
        )


class ResearchProjectAdminSerializer(serializers.ModelSerializer):
    """
    Serializer for users who are administrators of a :class:`~.models.ResearchProject`.
    """

    class Meta:
        model = models.ResearchProject
        fields = (
            "slug",
            "name",
            "description",
            "visibility",
            "group",
            "flows",
        )
        read_only_fields = (
            "slug",
        )
