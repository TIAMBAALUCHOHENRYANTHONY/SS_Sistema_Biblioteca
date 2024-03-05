import unittest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app

class TestLibrosAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    @patch('routers.libros.encrypt', MagicMock(return_value=b'encrypted_data'))
    def test_crear_libro(self):
        # Simulamos la inserción en la base de datos
        response = self.client.post("/libro/", json={
            "titulo": "Prueba",
            "ISBN": "123456789",
            "año_publicacion": 2023,
            "editorial": "Editorial de prueba",
            "autor": "Autor de prueba",
            "estado": "disponible"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("Libro creado exitosamente", response.json()["mensaje"])

    @patch('routers.libros.decrypt', MagicMock(return_value='{"libro_id": "1", "titulo": "Prueba"}'))
    def test_obtener_libros(self):
        # Simulamos la obtención de libros desde la base de datos
        response = self.client.get("/libros/")
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertTrue(isinstance(data, list))
        self.assertEqual(len(data), 1)
        self.assertIn("libro_id", data[0])
        self.assertIn("titulo", data[0])

if __name__ == '__main__':
    unittest.main()