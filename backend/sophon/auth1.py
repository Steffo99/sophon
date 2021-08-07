import rest_framework.authentication


class BearerTokenAuthentication(rest_framework.authentication.TokenAuthentication):
    """
    A standard implementation of the Token Authentication.
    """

    keyword = "Bearer"
