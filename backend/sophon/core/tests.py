import abc
import contextlib
import typing as t

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.response import Response
from rest_framework.test import APITestCase

from . import models


class BetterAPITestCase(APITestCase):
    """
    An extension for :class:`APITestCase` which includes some utility methods to make tests clearer.
    """

    @contextlib.contextmanager
    def as_user(self, username: str, password: str) -> t.ContextManager[None]:
        """
        **Context manager** which runs tests as a specific user.

        :param username: The username of the user to login as.
        :param password: The password of the user to login as.
        """
        yield self.client.login(username, password)
        self.client.logout()


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
    def get_url(cls, action: str, *args, **kwargs) -> str:
        """
        Find the URL of a specific action by using :func:`django.urls.reverse`.

        :param action: The action to perform on the ViewSet, such as `"list"` or `"destroy"`.
        :param args: Positional arguments passed to :func:`django.urls.reverse` for getting the URL.
        :param kwargs: Keyword arguments passed to :func:`django.urls.reverse` for getting the URL.
        :return: The URL corresponding to the action with all parameters filled in.
        """
        basename = cls.get_basename()
        return reverse(f"{basename}-{action}", args=args, kwargs=kwargs)

    def list(self) -> Response:
        """
        Perform the ``list`` action on the ViewSet.

        :return: The server response.
        """
        url = self.get_url("list")
        return self.client.get(url, {}, format="json")

    # I hate how unittest doesn't follow PEP8 when naming methods
    def assertActionList(self, code: int = 200) -> t.Any:
        """
        Perform the ``list`` action, and assert that it will return a specific status code.

        :param code: The expected status code.
        :return: The data the server responded with, or :data:`None` if the data evaluates to :data:`False`.
        """
        response = self.list()
        self.assertEqual(response.status_code, code, msg=f"`list` did not return {code}")
        return response.data or None

    def retrieve(self, pk) -> Response:
        """
        Perform the ``retrieve`` action on the ViewSet.

        :param pk: The primary key of the resource to retrieve.
        :return: The server response.
        """
        url = self.get_url("detail", pk=pk)
        return self.client.get(url, {}, format="json")

    def assertActionRetrieve(self, pk, code: int = 200) -> t.Any:
        """
        Perform the ``retrieve`` action, and assert that it will return a specific status code.

        :param pk: The primary key of the resource to retrieve.
        :param code: The expected status code.
        :return: The data the server responded with, or :data:`None` if the data evaluates to :data:`False`.
        """
        response = self.retrieve(pk=pk)
        self.assertEqual(response.status_code, code, msg=f"`retrieve` did not return {code}")
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

    def assertActionCreate(self, data, code: int = 201) -> t.Any:
        """
        Perform the ``create`` action, and assert that it will return a specific status code.

        :param data: The data to create the resource with.
        :param code: The expected status code.
        :return: The data the server responded with, or :data:`None` if the data evaluates to :data:`False`.
        """
        response = self.create(data=data)
        self.assertEqual(response.status_code, code, msg=f"`create` did not return {code}")
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

    def assertActionUpdate(self, pk, data, code: int = 200) -> t.Any:
        """
        Perform the ``update`` action, and assert that it will return a specific status code.

        :param pk: The primary key of the resource to update.
        :param data: The data to update the resource with.
        :param code: The expected status code.
        :return: The data the server responded with, or :data:`None` if the data evaluates to :data:`False`.
        """
        response = self.update(pk=pk, data=data)
        self.assertEqual(response.status_code, code, msg=f"`update` did not return {code}")
        return response.data

    def destroy(self, pk) -> Response:
        """
        Perform the ``destroy`` action on the ViewSet.

        :param pk: The primary key of the resource to destroy.
        :return: The server response.
        """
        url = self.get_url("detail", pk=pk)
        return self.client.delete(url, {}, format="json")

    def assertActionDestroy(self, pk, code: int = 200) -> t.Any:
        """
        Perform the ``destroy`` action, and assert that it will return a specific status code.

        :param pk: The primary key of the resource to destroy.
        :param code: The expected status code.
        :return: The data the server responded with, or :data:`None` if the data evaluates to :data:`False`.
        """
        response = self.destroy(pk=pk)
        self.assertEqual(response.status_code, code, msg=f"`destroy` did not return {code}")
        return response.data


class ResearchGroupTests(WriteSophonTestCase):
    """
    :class:`APITestCase` for the :class:`ResearchGroupViewSet`.
    """

    @classmethod
    def get_basename(cls) -> str:
        return "research-group"

    test_user: User = None
    other_user: User = None

    @classmethod
    def setUpTestData(cls):
        cls.test_user = User.objects.create_user(username="TEST", password="TheGreatDjangoTest")
        cls.other_user = User.objects.create_user(username="TAST", password="TheGreatDjangoTast")

        models.ResearchGroup.objects.create(
            slug="alpha",
            name="Alpha",
            description="First test group.",
            owner=cls.test_user,
            access="MANUAL",
        )

        models.ResearchGroup.objects.create(
            slug="beta",
            name="Beta",
            description="Second test group.",
            owner=cls.test_user,
            access="OPEN",
        )

    def test_list(self):
        r = self.list_unwrap()

        count = r["count"]
        self.assertEqual(count, 2)

        list_page = r["results"]

        self.assertIn("slug", list_page[0])
        self.assertIn("name", list_page[0])
        self.assertIn("description", list_page[0])
        self.assertIn("owner", list_page[0])
        self.assertIn("members", list_page[0])
        self.assertIn("access", list_page[0])

    def test_retrieve_valid(self):
        retrieved = self.retrieve_unwrap("alpha")

        self.assertIn("slug", retrieved)
        self.assertIn("name", retrieved)
        self.assertIn("description", retrieved)
        self.assertIn("owner", retrieved)
        self.assertIn("members", retrieved)
        self.assertIn("access", retrieved)

        self.assertEqual(retrieved["slug"], "alpha")
        self.assertEqual(retrieved["name"], "Alpha")
        self.assertEqual(retrieved["description"], "First test group.")
        self.assertEqual(retrieved["owner"], self.test_user.id)
        self.assertEqual(retrieved["members"], [])
        self.assertEqual(retrieved["access"], "MANUAL")

    def test_retrieve_not_existing(self):
        self.retrieve_fail("banana", 404)

    def test_create_valid(self):
        self.client.login(username="TEST", password="TheGreatDjangoTest")

        created = self.create_unwrap({
            "slug": "omega",
            "name": "Omega",
            "description": "Last test group.",
            "members": [],
            "access": "OPEN",
        })
        self.assertIn("slug", created)
        self.assertIn("name", created)
        self.assertIn("description", created)
        self.assertIn("owner", created)
        self.assertIn("members", created)
        self.assertIn("access", created)

        retrieved = self.retrieve_unwrap("omega")

        self.assertIn("slug", retrieved)
        self.assertIn("name", retrieved)
        self.assertIn("description", retrieved)
        self.assertIn("owner", retrieved)
        self.assertIn("members", retrieved)
        self.assertIn("access", retrieved)

        self.assertEqual(retrieved["slug"], "omega")
        self.assertEqual(retrieved["name"], "Omega")
        self.assertEqual(retrieved["description"], "Last test group.")
        self.assertEqual(retrieved["owner"], self.test_user.id)
        self.assertEqual(retrieved["members"], [])
        self.assertEqual(retrieved["access"], "OPEN")

    def test_create_not_logged_in(self):
        self.create_fail({
            "slug": "fail",
            "name": "Failure",
            "description": "This creation should fail.",
            "members": [],
            "access": "OPEN",
        }, 401)

    def test_create_invalid_schema(self):
        self.client.login(username="TEST", password="TheGreatDjangoTest")

        self.create_fail({
            "potato": "sweet",
            "access": "OPEN",
        }, 400)

    def test_update_valid(self):
        self.client.login(username="TEST", password="TheGreatDjangoTest")

        self.create_unwrap({
            "slug": "gamma",
            "name": "Gamma",
            "description": "A test group to update.",
            "members": [],
            "access": "OPEN",
        })

        retrieved = self.retrieve_unwrap("gamma")

        self.assertEqual(retrieved["slug"], "gamma")
        self.assertEqual(retrieved["name"], "Gamma")
        self.assertEqual(retrieved["description"], "A test group to update.")
        self.assertEqual(retrieved["owner"], self.test_user.id)
        self.assertEqual(retrieved["members"], [])
        self.assertEqual(retrieved["access"], "OPEN")

        updated = self.update_unwrap("gamma", {
            "slug": "gamma",
            "name": "Gamma",
            "description": "An updated test group.",
            "members": [],
            "access": "MANUAL",
        })

        self.assertIn("slug", updated)
        self.assertIn("name", updated)
        self.assertIn("description", updated)
        self.assertIn("owner", updated)
        self.assertIn("members", updated)
        self.assertIn("access", updated)

        self.assertEqual(updated["slug"], "gamma")
        self.assertEqual(updated["name"], "Gamma")
        self.assertEqual(updated["description"], "An updated test group.")
        self.assertEqual(updated["owner"], self.test_user.id)
        self.assertEqual(updated["members"], [])
        self.assertEqual(updated["access"], "MANUAL")

        retrieved2 = self.retrieve_unwrap("gamma")

        self.assertEqual(retrieved2["slug"], "gamma")
        self.assertEqual(retrieved2["name"], "Gamma")
        self.assertEqual(retrieved2["description"], "An updated test group.")
        self.assertEqual(retrieved2["owner"], self.test_user.id)
        self.assertEqual(retrieved2["members"], [])
        self.assertEqual(retrieved2["access"], "MANUAL")

    def test_update_not_logged_in(self):
        self.update_fail("alpha", {
            "slug": "alpha",
            "name": "AAAAA",
            "description": "An hacker has updated the Alpha group without permissions!",
            "members": [],
            "access": "MANUAL",
        }, 401)

    def test_update_unauthorized(self):
        self.client.login(username="TAST", password="TheGreatDjangoTast")

        self.update_fail("alpha", {
            "slug": "alpha",
            "name": "AAAAA",
            "description": "An hacker has updated the Alpha group without permissions!",
            "members": [],
            "access": "MANUAL",
        }, 403)

    def test_update_invalid_schema(self):
        self.client.login(username="TEST", password="TheGreatDjangoTest")

        self.update_fail("alpha", {
            "hahaha": "soccer",
        }, 400)

    def test_destroy_valid(self):
        self.client.login(username="TEST", password="TheGreatDjangoTest")

        self.create_unwrap({
            "slug": "boom",
            "name": "Boom!!!",
            "description": "A group that should explode.",
            "members": [],
            "access": "OPEN",
        })

        self.destroy_unwrap("boom")
        self.retrieve_fail("boom", 404)

    def test_destroy_not_logged_in(self):
        self.client.login(username="TEST", password="TheGreatDjangoTest")

        self.create_unwrap({
            "slug": "boom",
            "name": "Boom!!!",
            "description": "A group that should explode.",
            "members": [],
            "access": "OPEN",
        })

        self.client.logout()

        self.destroy_fail("boom", 401)
        self.retrieve_unwrap("boom")

    def test_destroy_unauthorized(self):
        self.client.login(username="TEST", password="TheGreatDjangoTest")

        self.create_unwrap({
            "slug": "doom",
            "name": "Doom!!!",
            "description": "A group about a game.",
            "members": [],
            "access": "OPEN",
        })

        self.client.logout()
        self.client.login(username="TAST", password="TheGreatDjangoTast")

        self.destroy_fail("doom", 403)
        self.retrieve_unwrap("doom")
