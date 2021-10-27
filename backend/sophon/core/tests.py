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

    def list_fail(self) -> None:
        response = self.list()
        self.assertTrue(response.status_code >= 400)

    def retrieve(self, pk) -> Response:
        url = self.get_url("detail", pk=pk)
        return self.client.get(url, {}, format="json")

    def retrieve_unwrap(self, pk) -> collections.OrderedDict:
        response = self.retrieve(pk=pk)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(isinstance(response.data, dict))
        return response.data

    def retrieve_fail(self, pk) -> None:
        response = self.retrieve(pk=pk)
        self.assertTrue(response.status_code >= 400)

    def create(self, data) -> Response:
        url = self.get_url("list")
        return self.client.post(url, data, format="json")

    def create_unwrap(self, data) -> collections.OrderedDict:
        response = self.create(data=data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(isinstance(response.data, dict))
        return response.data

    def create_fail(self, data) -> None:
        response = self.create(data)
        self.assertTrue(response.status_code >= 400)

    def update(self, pk, data) -> Response:
        url = self.get_url("detail", pk=pk)
        return self.client.put(url, data, format="json")

    def update_unwrap(self, pk, data) -> collections.OrderedDict:
        response = self.update(pk=pk, data=data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(isinstance(response.data, dict))
        return response.data

    def destroy(self, pk) -> Response:
        url = self.get_url("detail", pk=pk)
        return self.client.delete(url, format="json")

    def destroy_unwrap(self, pk) -> None:
        response = self.destroy(pk=pk)
        self.assertEqual(response.status_code, 204)

    def destroy_fail(self, pk) -> None:
        response = self.destroy(pk)
        self.assertTrue(response.status_code >= 400)


class ResearchGroupTests(SophonModelTestCase):
    @classmethod
    def get_basename(cls) -> str:
        return "research-group"

    test_user: User = None

    @classmethod
    def setUpTestData(cls):
        cls.test_user = User.objects.create_user(username="TEST", password="TheGreatDjangoTest")

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

        results = r["results"]

        self.assertIn("slug", results[0])
        self.assertIn("name", results[0])
        self.assertIn("description", results[0])
        self.assertIn("owner", results[0])
        self.assertIn("members", results[0])
        self.assertIn("access", results[0])

    def test_retrieve_valid(self):
        result = self.retrieve_unwrap("alpha")

        self.assertIn("slug", result)
        self.assertIn("name", result)
        self.assertIn("description", result)
        self.assertIn("owner", result)
        self.assertIn("members", result)
        self.assertIn("access", result)

        self.assertEqual(result["slug"], "alpha")
        self.assertEqual(result["name"], "Alpha")
        self.assertEqual(result["description"], "First test group.")
        self.assertEqual(result["owner"], self.test_user.id)
        self.assertEqual(result["members"], [])
        self.assertEqual(result["access"], "MANUAL")

    def test_retrieve_not_existing(self):
        self.retrieve_fail("banana")

    def test_create_valid(self):
        self.client.login(username="TEST", password="TheGreatDjangoTest")

        result = self.create_unwrap({
            "slug": "omega",
            "name": "Omega",
            "description": "Last test group.",
            "members": [],
            "access": "OPEN",
        })
        self.assertIn("slug", result)
        self.assertIn("name", result)
        self.assertIn("description", result)
        self.assertIn("members", result)
        self.assertIn("access", result)

        check = self.retrieve_unwrap("omega")

        self.assertIn("slug", check)
        self.assertIn("name", check)
        self.assertIn("description", check)
        self.assertIn("owner", check)
        self.assertIn("members", check)
        self.assertIn("access", check)

        self.assertEqual(check["slug"], "omega")
        self.assertEqual(check["name"], "Omega")
        self.assertEqual(check["description"], "Last test group.")
        self.assertEqual(result["owner"], self.test_user.id)
        self.assertEqual(result["members"], [])
        self.assertEqual(result["access"], "OPEN")

    def test_create_not_logged_in(self):
        self.create_fail({
            "slug": "fail",
            "name": "Failure",
            "description": "This creation should fail.",
            "members": [],
            "access": "OPEN",
        })

    def test_create_invalid_schema(self):
        self.client.login(username="TEST", password="TheGreatDjangoTest")

        self.create_fail({
            "potato": "sweet",
            "access": "OPEN",
        })

    def test_update_valid(self):
        self.client.login(username="TEST", password="TheGreatDjangoTest")

        creation = self.create_unwrap({
            "slug": "gamma",
            "name": "Gamma",
            "description": "A test group to update.",
            "members": [],
            "access": "OPEN",
        })
        self.assertIn("slug", creation)
        self.assertIn("name", creation)
        self.assertIn("description", creation)
        self.assertIn("members", creation)
        self.assertIn("access", creation)

        check = self.retrieve_unwrap("gamma")

        self.assertEqual(check["slug"], "gamma")
        self.assertEqual(check["name"], "Gamma")
        self.assertEqual(check["description"], "A test group to update.")
        self.assertEqual(check["owner"], self.test_user.id)
        self.assertEqual(check["members"], [])
        self.assertEqual(check["access"], "OPEN")

        update = self.update_unwrap("gamma", {
            "slug": "gamma",
            "name": "Gamma",
            "description": "An updated test group.",
            "members": [],
            "access": "MANUAL",
        })

        self.assertIn("slug", update)
        self.assertIn("name", update)
        self.assertIn("description", update)
        self.assertIn("owner", update)
        self.assertIn("members", update)
        self.assertIn("access", update)

        self.assertEqual(update["slug"], "gamma")
        self.assertEqual(update["name"], "Gamma")
        self.assertEqual(update["description"], "An updated test group.")
        self.assertEqual(update["owner"], self.test_user.id)
        self.assertEqual(update["members"], [])
        self.assertEqual(update["access"], "MANUAL")

        check2 = self.retrieve_unwrap("gamma")

        self.assertEqual(check2["slug"], "gamma")
        self.assertEqual(check2["name"], "Gamma")
        self.assertEqual(check2["description"], "An updated test group.")
        self.assertEqual(check2["owner"], self.test_user.id)
        self.assertEqual(check2["members"], [])
        self.assertEqual(check2["access"], "MANUAL")

    def test_update_not_logged_in(self):
        result = self.update_unwrap("alpha", {
            "slug": "alpha",
            "name": "AAAAA",
            "description": "An hacker has updated the Alpha group without permissions!",
            "members": [],
            "access": "MANUAL",
        })

        self.assertIn("slug", result)
        self.assertIn("name", result)
        self.assertIn("description", result)
        self.assertIn("owner", result)
        self.assertIn("members", result)
        self.assertIn("access", result)

        self.assertEqual(result["slug"], "alpha")
        self.assertEqual(result["name"], "Alpha")
        self.assertEqual(result["description"], "First test group.")
        self.assertEqual(result["owner"], self.test_user.id)
        self.assertEqual(result["members"], [])
        self.assertEqual(result["access"], "MANUAL")

    def test_update_invalid_schema(self):
        result = self.update_unwrap("alpha", {
            "hahaha": "soccer",
        })

        self.assertIn("slug", result)
        self.assertIn("name", result)
        self.assertIn("description", result)
        self.assertIn("owner", result)
        self.assertIn("members", result)
        self.assertIn("access", result)

        self.assertEqual(result["slug"], "alpha")
        self.assertEqual(result["name"], "Alpha")
        self.assertEqual(result["description"], "First test group.")
        self.assertEqual(result["owner"], self.test_user.id)
        self.assertEqual(result["members"], [])
        self.assertEqual(result["access"], "MANUAL")

    # TODO: Create destroy test
