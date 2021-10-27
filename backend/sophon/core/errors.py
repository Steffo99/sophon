from rest_framework.response import Response


class HTTPException(Exception):
    """
    An exception that can be raised in :class:`.SophonViewSet` hooks to respond to a request with an HTTP error.
    """

    def __init__(self, status: int):
        self.status = status

    def as_response(self) -> Response:
        return Response(status=self.status)
