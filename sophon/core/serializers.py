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
