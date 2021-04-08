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


class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for :class:`.models.Project` .
    """

    class Meta:
        model = models.Project
        fields = [
            "slug",
            "name",
            "description",
            "flows",
        ]
