from django.contrib.auth.models import User
from rest_framework.serializers import Serializer, ModelSerializer


class NoneSerializer(Serializer):
    def update(self, instance, validated_data):
        return None

    def create(self, validated_data):
        return None


class UserSerializer(ModelSerializer):
    class Meta:
        model = User

        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
        )

        read_only_fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
        )


def dynamic_serializer(_model, _fields, _read_only_fields):
    """
    :param _model: The model the serializer is for.
    :param _fields: The fields to pass to the meta of the serializer class.
    :param _read_only_fields: The read_only_fields to pass to the meta of the serializer class.
    :return: a serializer class with the specified parameters.
    """

    class DynamicSerializer(ModelSerializer):
        class Meta:
            model = _model
            fields = _fields
            read_only_fields = _read_only_fields

    return DynamicSerializer
