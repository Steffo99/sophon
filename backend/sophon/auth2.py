# why is this needed?
# django somehow import-cycles itself if i put this in auth1

import rest_framework.authtoken.views
import rest_framework.authtoken.models
import rest_framework.response


class CustomObtainAuthToken(rest_framework.authtoken.views.ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = rest_framework.authtoken.models.Token.objects.get_or_create(user=user)
        return rest_framework.response.Response({
            'token': token.key,
            'user': {
                'id': user.pk,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            },
        })
