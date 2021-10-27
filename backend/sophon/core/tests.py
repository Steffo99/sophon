import abc
import collections

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.response import Response
from rest_framework.test import APITestCase

from . import models


class SophonModelTestCase(APITestCase, metaclass=abc.ABCMeta):
    @classmethod
    @abc.abstractmethod
    def get_basename(cls) -> str:
        raise NotImplementedError()

    @classmethod
    def get_url(cls, kind: str, *args, **kwargs) -> str:
        basename = cls.get_basename()
        return reverse(f"{basename}-{kind}", args=args, kwargs=kwargs)

    def list(self) -> Response:
        url = self.get_url("list")
        return self.client.get(url, {}, format="json")

    def list_unwrap(self) -> collections.OrderedDict:
        response = self.list()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(isinstance(response.data, dict))
        return response.data

    def list_fail(self, code) -> None:
        response = self.list()
        self.assertEqual(response.status_code, code)

    def retrieve(self, pk) -> Response:
        url = self.get_url("detail", pk=pk)
        return self.client.get(url, {}, format="json")

    def retrieve_unwrap(self, pk) -> collections.OrderedDict:
        response = self.retrieve(pk=pk)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(isinstance(response.data, dict))
        return response.data

    def retrieve_fail(self, pk, code) -> None:
        response = self.retrieve(pk=pk)
        self.assertEqual(response.status_code, code)

    def create(self, data) -> Response:
        url = self.get_url("list")
        return self.client.post(url, data, format="json")

    def create_unwrap(self, data) -> collections.OrderedDict:
        response = self.create(data=data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(isinstance(response.data, dict))
        return response.data

    def create_fail(self, data, code) -> None:
        response = self.create(data)
        self.assertEqual(response.status_code, code)

    def update(self, pk, data) -> Response:
        url = self.get_url("detail", pk=pk)
        return self.client.put(url, data, format="json")

    def update_unwrap(self, pk, data) -> collections.OrderedDict:
        response = self.update(pk=pk, data=data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(isinstance(response.data, dict))
        return response.data

    def update_fail(self, pk, data, code) -> None:
        response = self.update(pk, data)
        self.assertEqual(response.status_code, code)

    def destroy(self, pk) -> Response:
        url = self.get_url("detail", pk=pk)
        return self.client.delete(url, format="json")

    def destroy_unwrap(self, pk) -> None:
        response = self.destroy(pk=pk)
        self.assertEqual(response.status_code, 204)

    def destroy_fail(self, pk, code) -> None:
        response = self.destroy(pk)
        self.assertEqual(response.status_code, code)


class ResearchGroupTests(SophonModelTestCase):
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
