import abc
import contextlib
import typing as t

import django.urls.exceptions
import pkg_resources
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.response import Response
from rest_framework.test import APITestCase
from rest_framework.utils.serializer_helpers import ReturnDict

from . import errors
from . import models


class BetterAPITestCase(APITestCase):
    """
    An extension for :class:`APITestCase` which includes some utility methods to make tests clearer.
    """

    @contextlib.contextmanager
    def as_user(self, username: str, password: str = None) -> t.ContextManager[None]:
        """
        **Context manager** which runs tests as a specific user.

        :param username: The username of the user to login as.
        :param password: The password of the user to login as. If not specified, the username is used as password.
        """
        yield self.client.login(username=username, password=password or username)
        self.client.logout()

    def assertData(self, data: ReturnDict, expected: dict):
        """
        Assert that the returned data includes the key-value pairs of the second.

        :param data: The "larger" dictionary.
        :param expected: The "smaller" dictionary.

        .. seealso:: https://stackoverflow.com/a/59777678/4334568, https://www.python.org/dev/peps/pep-0584/
        """
        # Convert the ReturnDict to a regular dict, otherwise DRF will include some garbage
        data = dict(data)
        self.assertEqual(data, data | expected)


class ReadSophonTestCase(BetterAPITestCase, metaclass=abc.ABCMeta):
    """
    Abstract :class:`.BetterAPITestCase` for testing :class:`~sophon.core.views.ReadSophonViewSet`\\ s.
    """

    @classmethod
    @abc.abstractmethod
    def get_basename(cls) -> str:
        """
        :return: The `basename` of the ViewSet to test, as defined in the `urls` module of the app.
        """
        raise NotImplementedError()

    @classmethod
    def get_url(cls, kind: str, *args, **kwargs) -> str:
        """
        Find the URL of a specific action by using :func:`django.urls.reverse`.

        :param kind: The kind of view of the ViewSet to access: either ``"list"`` or ``"detail"``.
        :param args: Positional arguments passed to :func:`django.urls.reverse` for getting the URL.
        :param kwargs: Keyword arguments passed to :func:`django.urls.reverse` for getting the URL.
        :return: The URL corresponding to the action with all parameters filled in.
        """
        basename = cls.get_basename()
        try:
            return reverse(f"{basename}-{kind}", args=args, kwargs=kwargs)
        except django.urls.exceptions.NoReverseMatch:
            raise errors.HTTPException(404)

    def list(self) -> Response:
        """
        Perform the ``list`` action on the ViewSet.

        :return: The server response.
        """
        url = self.get_url("list")
        return self.client.get(url, {}, format="json")

    # I hate how unittest doesn't follow PEP8 when naming methods
    def assertActionList(self, code: int = 200) -> t.Optional[ReturnDict]:
        """
        Perform the ``list`` action, and assert that it will return a specific status code.

        :param code: The expected status code.
        :return: The data the server responded with, or :data:`None` if a HTTPException is raised.
        """
        try:
            response = self.list()
        except errors.HTTPException as exc:
            self.assertEqual(exc.status, code, msg=f"`list` did not return {code}: {exc!r}")
            return None
        except ValueError as exc:
            self.assertEqual(400, code, msg=f"`list` did not return {code}: {exc!r}")
            return None
        else:
            self.assertEqual(response.status_code, code, msg=f"`list` did not return {code}: {response.data!r}")
            return response.data or None

    def retrieve(self, pk) -> Response:
        """
        Perform the ``retrieve`` action on the ViewSet.

        :param pk: The primary key of the resource to retrieve.
        :return: The server response.
        """
        url = self.get_url("detail", pk=pk)
        return self.client.get(url, {}, format="json")

    def assertActionRetrieve(self, pk, code: int = 200) -> t.Optional[ReturnDict]:
        """
        Perform the ``retrieve`` action, and assert that it will return a specific status code.

        :param pk: The primary key of the resource to retrieve.
        :param code: The expected status code.
        :return: The data the server responded with, or :data:`None` if a HTTPException is raised.
        """
        try:
            response = self.retrieve(pk=pk)
        except errors.HTTPException as exc:
            self.assertEqual(exc.status, code, msg=f"`retrieve` did not return {code}: {exc!r}")
            return None
        except ValueError as exc:
            self.assertEqual(400, code, msg=f"`retrieve` did not return {code}: {exc!r}")
            return None
        else:
            self.assertEqual(response.status_code, code, msg=f"`retrieve` did not return {code}: {response.data!r}")
            return response.data

    def custom_list(self, method: str, action: str, data: dict = None) -> Response:
        """
        Perform a list action on the ViewSet.

        :param method: The method to use in the request.
        :param action: The name of the action to perform.
        :param data: The data to send with the request.
        :return: The server response.
        """
        url = self.get_url(action)
        return self.client.generic(method, url, data or {})

    def assertActionCustomList(self, method: str, action: str, data: dict = None, code: int = 200) -> t.Optional[ReturnDict]:
        """
        Perform a list action on the ViewSet, and assert that it will return a specific status code.

        :param method: The method to use in the request.
        :param action: The name of the action to perform.
        :param data: The data to send with the request.
        :param code: The expected status code.
        :return: The data the server responded with, or :data:`None` if a HTTPException is raised.
        """
        try:
            response = self.custom_list(method, action, data)
        except errors.HTTPException as exc:
            self.assertEqual(exc.status, code, msg=f"`{action}` did not return {code}: {exc!r}")
            return None
        except ValueError as exc:
            self.assertEqual(400, code, msg=f"`{action}` did not return {code}: {exc!r}")
            return None
        else:
            self.assertEqual(response.status_code, code, msg=f"`{action}` did not return {code}: {response.data!r}")
            return response.data

    def custom_detail(self, method: str, action: str, pk, data: dict = None) -> Response:
        """
        Perform a detail action on the ViewSet.

        :param method: The method to use in the request.
        :param action: The name of the action to perform.
        :param pk: The primary key of the resource to operate on.
        :param data: The data to send with the request.
        :return: The server response.
        """
        url = self.get_url(action, pk=pk)
        return self.client.generic(method, url, data or {})

    def assertActionCustomDetail(self, method: str, action: str, pk, data: dict = None, code: int = 200) -> t.Optional[ReturnDict]:
        """
        Perform a detail action on the ViewSet, and assert that it will return a specific status code.

        :param method: The method to use in the request.
        :param action: The name of the action to perform.
        :param pk: The primary key of the resource to operate on.
        :param data: The data to send with the request.
        :param code: The expected status code.
        :return: The data the server responded with, or :data:`None` if a HTTPException is raised.
        """
        try:
            response = self.custom_detail(method, action, pk, data)
        except errors.HTTPException as exc:
            self.assertEqual(exc.status, code, msg=f"`{action}` did not return {code}: {exc!r}")
            return None
        except ValueError as exc:
            self.assertEqual(400, code, msg=f"`{action}` did not return {code}: {exc!r}")
            return None
        else:
            self.assertEqual(response.status_code, code, msg=f"`{action}` did not return {code}: {response.data!r}")
            return response.data


class WriteSophonTestCase(ReadSophonTestCase, metaclass=abc.ABCMeta):
    """
    Abstract :class:`.ReadSophonTestCase` for testing :class:`~sophon.core.views.WriteSophonViewSet`\\ s.
    """

    def create(self, data) -> Response:
        """
        Perform the ``create`` action on the ViewSet.

        :param data: The data to create the resource with.
        :return: The server response.
        """
        url = self.get_url("list")
        return self.client.post(url, data, format="json")

    def assertActionCreate(self, data, code: int = 201) -> t.Optional[ReturnDict]:
        """
        Perform the ``create`` action, and assert that it will return a specific status code.

        :param data: The data to create the resource with.
        :param code: The expected status code.
        :return: The data the server responded with, or :data:`None` if a HTTPException is raised.
        """
        try:
            response = self.create(data=data)
        except errors.HTTPException as exc:
            self.assertEqual(exc.status, code, msg=f"`create` did not return {code}: {exc!r}")
            return None
        except ValueError as exc:
            self.assertEqual(400, code, msg=f"`create` did not return {code}: {exc!r}")
            return None
        else:
            self.assertEqual(response.status_code, code, msg=f"`create` did not return {code}: {response.data!r}")
            return response.data

    def update(self, pk, data) -> Response:
        """
        Perform the ``update`` action on the ViewSet.

        :param pk: The primary key of the resource to update.
        :param data: The data to update the resource with.
        :return: The server response.
        """
        url = self.get_url("detail", pk=pk)
        return self.client.put(url, data, format="json")

    def assertActionUpdate(self, pk, data, code: int = 200) -> t.Optional[ReturnDict]:
        """
        Perform the ``update`` action, and assert that it will return a specific status code.

        :param pk: The primary key of the resource to update.
        :param data: The data to update the resource with.
        :param code: The expected status code.
        :return: The data the server responded with, or :data:`None` if a HTTPException is raised.
        """
        try:
            response = self.update(pk=pk, data=data)
        except errors.HTTPException as exc:
            self.assertEqual(exc.status, code, msg=f"`update` did not return {code}: {exc!r}")
            return None
        except ValueError as exc:
            self.assertEqual(400, code, msg=f"`update` did not return {code}: {exc!r}")
            return None
        else:
            self.assertEqual(response.status_code, code, msg=f"`update` did not return {code}: {response.data!r}")
            return response.data

    def destroy(self, pk) -> Response:
        """
        Perform the ``destroy`` action on the ViewSet.

        :param pk: The primary key of the resource to destroy.
        :return: The server response.
        """
        url = self.get_url("detail", pk=pk)
        return self.client.delete(url, {}, format="json")

    def assertActionDestroy(self, pk, code: int = 200) -> t.Optional[ReturnDict]:
        """
        Perform the ``destroy`` action, and assert that it will return a specific status code.

        :param pk: The primary key of the resource to destroy.
        :param code: The expected status code.
        :return: The data the server responded with, or :data:`None` if a HTTPException is raised.
        """
        try:
            response = self.destroy(pk=pk)
        except errors.HTTPException as exc:
            self.assertEqual(exc.status, code, msg=f"`destroy` did not return {code}: {exc!r}")
            return None
        except ValueError as exc:
            self.assertEqual(400, code, msg=f"`destroy` did not return {code}: {exc!r}")
            return None
        else:
            self.assertEqual(response.status_code, code, msg=f"`destroy` did not return {code}: {response.data!r}")
            return response.data


class UsersByIdTestCase(ReadSophonTestCase):
    """
    Tests for :class:`sophon.core.views.UsersByIdViewSet`.

    Since the viewset by itself is trivial, these tests are to verify that DRF is working as expected.
    """

    @classmethod
    def get_basename(cls) -> str:
        return "user-by-id"

    first_user: User = None
    second_user: User = None
    third_user: User = None

    @classmethod
    def setUpTestData(cls):
        cls.first_user = User.objects.create_user(username="first", password="One")
        cls.second_user = User.objects.create_user(username="second", password="Two")
        cls.third_user = User.objects.create_user(username="third", password="Three")

    def test_list_200(self):
        data = self.assertActionList(200)
        self.assertEqual(3, data["count"], msg="`list` did not return 3 users")
        self.assertEqual(3, len(data["results"]), msg="`list` results did not match count")
        self.assertData(data["results"][0], {"username": "first"})
        self.assertData(data["results"][1], {"username": "second"})
        self.assertData(data["results"][2], {"username": "third"})

    def test_retrieve_200(self):
        data = self.assertActionRetrieve(self.first_user.id)
        self.assertData(data, {"username": "first"})
        data = self.assertActionRetrieve(self.second_user.id)
        self.assertData(data, {"username": "second"})
        data = self.assertActionRetrieve(self.third_user.id)
        self.assertData(data, {"username": "third"})

    def test_retrieve_404(self):
        self.assertActionRetrieve(100, code=404)
        self.assertActionRetrieve(-1, code=404)
        self.assertActionRetrieve(999999, code=404)


class UsersByUsernameTestCase(ReadSophonTestCase):
    """
    Tests for :class:`sophon.core.views.UsersByUsernameViewSet`.

    Basically the same as the UsersByIdTestCase, except that it checks for alphabetical ordering.
    """

    @classmethod
    def get_basename(cls) -> str:
        return "user-by-username"

    first_user: User = None
    second_user: User = None
    third_user: User = None

    @classmethod
    def setUpTestData(cls):
        cls.first_user = User.objects.create_user(username="zzzzzz", password="zzzzzz")
        cls.second_user = User.objects.create_user(username="wwwwww", password="wwwwww")
        cls.third_user = User.objects.create_user(username="aaaaaa", password="aaaaaa")

    def test_list_200(self):
        data = self.assertActionList(200)
        self.assertEqual(3, data["count"], msg="`list` did not return 3 users")
        self.assertEqual(3, len(data["results"]), msg="`list` results did not match count")
        self.assertData(data["results"][0], {"username": "aaaaaa"})
        self.assertData(data["results"][1], {"username": "wwwwww"})
        self.assertData(data["results"][2], {"username": "zzzzzz"})

    def test_retrieve_200(self):
        data = self.assertActionRetrieve(self.first_user.username)
        self.assertData(data, {"username": "zzzzzz"})
        data = self.assertActionRetrieve(self.second_user.username)
        self.assertData(data, {"username": "wwwwww"})
        data = self.assertActionRetrieve(self.third_user.username)
        self.assertData(data, {"username": "aaaaaa"})

    def test_retrieve_404(self):
        self.assertActionRetrieve("sas", code=404)
        self.assertActionRetrieve("sos", code=404)
        self.assertActionRetrieve("sus", code=404)


class ResearchGroupTestCase(WriteSophonTestCase):
    """
    Tests for :class:`sophon.core.views.UsersByUsernameViewSet`.

    These tests verify that :class:`sophon.core.views.SophonGroupViewSet` is working as intended.
    """

    @classmethod
    def get_basename(cls) -> str:
        return "research-group"

    owner_user: User = None
    member_user: User = None
    outside_user: User = None

    @classmethod
    def setUpTestData(cls):
        cls.owner_user = User.objects.create_user(username="owner", password="owner")
        cls.member_user = User.objects.create_user(username="member", password="member")
        cls.outside_user = User.objects.create_user(username="outside", password="outside")

        alpha = models.ResearchGroup.objects.create(
            slug="alpha",
            name="Alpha",
            description="First test group.",
            owner=cls.owner_user,
            access="MANUAL",
        )
        alpha.members.set([cls.member_user])

        beta = models.ResearchGroup.objects.create(
            slug="beta",
            name="Beta",
            description="Second test group.",
            owner=cls.owner_user,
            access="OPEN",
        )
        beta.members.set([])

    def test_list_200(self):
        data = self.assertActionList()
        self.assertEqual(2, data["count"])
        self.assertEqual(2, len(data["results"]))
        self.assertData(data["results"][0], {
            "slug": "alpha",
            "name": "Alpha",
            "description": "First test group.",
            "owner": self.owner_user.id,
            "members": [self.member_user.id],
            "access": "MANUAL",
        })
        self.assertData(data["results"][1], {
            "slug": "beta",
            "name": "Beta",
            "description": "Second test group.",
            "owner": self.owner_user.id,
            "members": [],
            "access": "OPEN",
        })

    def test_retrieve_200(self):
        data = self.assertActionRetrieve("alpha")
        self.assertData(data, {
            "slug": "alpha",
            "name": "Alpha",
            "description": "First test group.",
            "owner": self.owner_user.id,
            "members": [self.member_user.id],
            "access": "MANUAL",
        })

        data = self.assertActionRetrieve("beta")
        self.assertData(data, {
            "slug": "beta",
            "name": "Beta",
            "description": "Second test group.",
            "owner": self.owner_user.id,
            "members": [],
            "access": "OPEN",
        })

    def test_retrieve_404(self):
        self.assertActionRetrieve("banana", 404)
        self.assertActionRetrieve("tomato", 404)
        self.assertActionRetrieve("potato", 404)
        # Since these are path parameters, they are interpreted as strings
        self.assertActionRetrieve(1, 404)
        self.assertActionRetrieve(-1, 404)
        self.assertActionRetrieve(1.0, 404)

    def test_create_201(self):
        with self.as_user(self.owner_user.username):
            # Ensure the group doesn't already exist
            self.assertActionRetrieve("gamma", 404)
            # Create the group
            created = self.assertActionCreate({
                "slug": "gamma",
                "name": "Gamma",
                "description": "Third test group.",
                "members": [self.member_user.id],
                "access": "OPEN",
            }, 201)
            self.assertData(created, {
                "slug": "gamma",
                "name": "Gamma",
                "description": "Third test group.",
                "owner": self.owner_user.id,
                "members": [self.member_user.id],
                "access": "OPEN",
            })
            # Ensure the group now exists
            retrieved = self.assertActionRetrieve("gamma")
            self.assertData(retrieved, {
                "slug": "gamma",
                "name": "Gamma",
                "description": "Third test group.",
                "owner": self.owner_user.id,
                "members": [self.member_user.id],
                "access": "OPEN",
            })

    def test_create_400(self):
        self.assertActionCreate({}, 400)
        self.assertActionCreate({
            "slug": 1,
            "name": 213478,
            "description": 384592,
            "members": {
                "why not": "a dict"
            },
            "access": "yes",
        }, 400)

    def test_create_401(self):
        self.assertActionCreate({
            "slug": "delta",
            "name": "Delta",
            "description": "Fourth test group.",
            "members": [self.member_user.id],
            "access": "OPEN",
        }, 401)

    def test_update_200(self):
        with self.as_user(self.owner_user.username):
            updated = self.assertActionUpdate("beta", {
                "slug": "beta",
                "name": "Beta",
                "description": "Second test group.",
                "owner": self.owner_user.id,
                "members": [self.member_user.id],  # <-
                "access": "OPEN",
            })
            self.assertData(updated, {
                "slug": "beta",
                "name": "Beta",
                "description": "Second test group.",
                "owner": self.owner_user.id,
                "members": [self.member_user.id],
                "access": "OPEN",
            })

    def test_update_400(self):
        with self.as_user(self.owner_user.username):
            self.assertActionUpdate("beta", {
                "members": {
                    "nobody expects": "the dict inquisition",
                }
            }, 400)

    # Using AllowAny, update always succeeds, even if permissions are missing, but won't apply any changes due to the access serializer
    def test_update_unauthenticated(self):
        self.assertActionUpdate("beta", {
            "members": [self.outside_user.id],
        })

        retrieved = self.assertActionRetrieve("beta")
        self.assertData(retrieved, {
            "slug": "beta",
            "name": "Beta",
            "description": "Second test group.",
            "owner": self.owner_user.id,
            "members": [],
            "access": "OPEN",
        })

    # Using AllowAny, update always succeeds, even if permissions are missing, but won't apply any changes due to the access serializer
    def test_update_forbidden(self):
        with self.as_user(self.outside_user.username):
            self.assertActionUpdate("beta", {
                "name": "Bbbbbbbbb",
            })

            retrieved = self.assertActionRetrieve("beta")
            self.assertData(retrieved, {
                "slug": "beta",
                "name": "Beta",
                "description": "Second test group.",
                "owner": self.owner_user.id,
                "members": [],
                "access": "OPEN",
            })

    def test_destroy_204(self):
        with self.as_user(self.owner_user.username):
            self.assertActionDestroy("beta", 204)
            self.assertActionRetrieve("beta", 404)

    def test_destroy_401(self):
        self.assertActionDestroy("alpha", 401)

    def test_destroy_403(self):
        with self.as_user(self.outside_user.username):
            self.assertActionDestroy("alpha", 403)

    def test_join_200(self):
        with self.as_user(self.member_user.username):
            data = self.assertActionCustomDetail("POST", "join", "beta")
            self.assertData(data, {
                "members": [self.member_user.id]
            })

    def test_join_401(self):
        self.assertActionCustomDetail("POST", "join", "beta", code=401)

    def test_join_403(self):
        with self.as_user(self.outside_user.username):
            self.assertActionCustomDetail("POST", "join", "alpha", code=403)

    def test_join_404(self):
        with self.as_user(self.member_user.username):
            self.assertActionCustomDetail("POST", "join", "zxy", code=404)

    def test_leave_200(self):
        with self.as_user(self.member_user.username):
            data = self.assertActionCustomDetail("DELETE", "leave", "alpha")
            self.assertData(data, {
                "members": [],
            })

    def test_leave_401(self):
        self.assertActionCustomDetail("DELETE", "leave", "alpha", code=401)

    def test_leave_403(self):
        with self.as_user(self.owner_user.username):
            self.assertActionCustomDetail("DELETE", "leave", "alpha", code=403)

    def test_leave_404(self):
        with self.as_user(self.member_user.username):
            self.assertActionCustomDetail("DELETE", "leave", "zxy", code=404)


class SophonInstanceDetailsTestCase(BetterAPITestCase):
    def test_details_200(self):
        response = self.client.get("/api/core/instance/")
        self.assertEqual(response.status_code, 200)
        self.assertData(response.data, {
            "name": "Sophon",
            "description": None,
            "theme": "sophon",
            "version": pkg_resources.get_distribution("sophon").version,
        })
