import secrets


def generate_secure_token() -> str:
    """
    :return: A random secure string to be used as :attr:`.container_token`.
    """
    return secrets.token_urlsafe()
