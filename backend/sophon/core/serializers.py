from rest_framework.serializers import Serializer


class NoneSerializer(Serializer):
    def update(self, instance, validated_data):
        return None

    def create(self, validated_data):
        return None
