from rest_framework import serializers
from . import models


class DataSourceSerializer(serializers.ModelSerializer):
    """
    Serializer for :class:`.models.DataSource` .
    """

    class Meta:
        model = models.DataSource
        fields = [
            "pandasdmx_id",
            "builtin",
            "settings",
        ]


class DataFlowSerializer(serializers.ModelSerializer):
    """
    Serializer for :class:`.models.DataFlow` .
    """

    class Meta:
        model = models.DataFlow
        fields = [
            "id",
            "datasource_id",
            "sdmx_id",
            "last_update",
            "description",
        ]


class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for :class:`.models.Project` .
    """

    class Meta:
        model = models.Project
        fields = [
            "id",
            "name",
            "description",
            "sources",
        ]
