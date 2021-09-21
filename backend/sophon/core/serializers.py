from django.contrib.auth.models import User
from rest_framework.serializers import Serializer, ModelSerializer, CharField


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
