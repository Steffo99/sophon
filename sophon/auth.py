# https://auth0.com/docs/quickstart/backend/django/01-authorization

import json
import jwt
import jwt.algorithms
import requests
import django.contrib.auth
import functools
from rest_framework import response, status
from . import settings


def jwt_map_sub_to_username(payload):
    username = payload.get("sub")
    django.contrib.auth.authenticate(remote_user=username)
    return username


def jwt_decode_token(token):
    header = jwt.get_unverified_header(token)
    issuer = settings.JWT_AUTH['JWT_ISSUER']
    audience = settings.JWT_AUTH['JWT_AUDIENCE']
    jwks = requests.get(f"{issuer}.well-known/jwks.json").json()
    public_key = None
    for jwk in jwks['keys']:
        if jwk['kid'] == header['kid']:
            public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))

    if public_key is None:
        raise Exception('Public key not found.')

    return jwt.decode(token, public_key, audience=audience, issuer=issuer, algorithms=['RS256'])


def jwt_get_header(request):
    auth = request.META.get("HTTP_AUTHORIZATION", None)
    ttype, token = auth.split()
    if ttype != "Bearer":
        raise TypeError(f"Unknown token type {ttype}")
    return token


def requires_scopes(required_scopes: set[str]):
    def decorator(f):
        @functools.wraps(f)
        def decorated(request, *args, **kwargs):
            try:
                token = jwt_get_header(request)
            except TypeError:
                return response.Response({"error": "Unknown token type"}, status=status.HTTP_403_FORBIDDEN)

            decoded = jwt.decode(token, verify=False)

            if not (available_scopes := set(decoded.get("scope", "").split())):
                return response.Response({"error": "No scopes provided"}, status=status.HTTP_403_FORBIDDEN)

            if required_scopes - available_scopes:
                return response.Response({"error": "Missing scopes"}, status=status.HTTP_403_FORBIDDEN)

            return f(request, *args, **kwargs)
        return decorated
    return decorator
