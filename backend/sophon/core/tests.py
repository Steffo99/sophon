import abc
import collections

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
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

    def update_fail(self, pk, data) -> None:
        response = self.update(pk, data)
        self.assertTrue(response.status_code >= 400)

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

    @classmethod
    def setUpTestData(cls):
        test_user = User.objects.create_user(username="TEST", password="TheGreatDjangoTest")

        models.ResearchGroup.objects.create(
            slug="alpha",
            name="Alpha",
            description="First test group.",
            owner=test_user,
            access="MANUAL",
        )

        models.ResearchGroup.objects.create(
            slug="beta",
            name="Beta",
            description="Second test group.",
            owner=test_user,
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

    def test_retrieve(self):
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
        # TODO: How to verify the owner id?
        self.assertEqual(result["members"], [])
        self.assertEqual(result["access"], "MANUAL")

    def test_create(self):
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
        # TODO: How to verify the owner id?
        self.assertEqual(result["members"], [])
        self.assertEqual(result["access"], "OPEN")

    # TODO: Create update test
    # TODO: Create destroy test
