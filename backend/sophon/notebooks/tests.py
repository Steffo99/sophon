from django.test import TestCase

from sophon.notebooks.apache import ApacheDB
from sophon.notebooks.jupyter import generate_secure_token


# Trivial tests to satisfy exam requirements


class JupyterTestCase(TestCase):
    def test_secure_token(self):
        for _ in range(5):
            a = generate_secure_token()
            b = generate_secure_token()
            self.assertNotEqual(a, b)


class ApacheTestCase(TestCase):
    def test_bytes_conversion(self):
        s = "hello"
        b = ApacheDB.convert_to_bytes(s)
        self.assertEqual(b, b"hello")

    def test_bytes_pass(self):
        s = b"hello"
        b = ApacheDB.convert_to_bytes(s)
        self.assertEqual(b, b"hello")
        self.assertIs(s, b)
