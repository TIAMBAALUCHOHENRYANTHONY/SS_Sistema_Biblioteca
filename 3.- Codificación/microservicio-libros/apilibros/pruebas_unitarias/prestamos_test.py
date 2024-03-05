import unittest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app

class TestPrestamosAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    @patch('routers.prestamos.encrypt', MagicMock(return_value=b'encrypted_data'))
    def test_crear_prestamo(self):
        # Simulamos la inserción en la base de datos
        response = self.client.post("/prestamos/", json={
            "libro_id": 1,
            "fecha_prestamo": "2024-03-05",
            "fecha_devolucion": "2024-03-12"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("Préstamo creado exitosamente", response.json()["mensaje"])

    @patch('routers.prestamos.decrypt', MagicMock(return_value='{"prestamo_id": "1", "libro_id": "1"}'))
    def test_obtener_prestamo(self):
        # Simulamos la obtención de préstamos desde la base de datos
        response = self.client.get("/prestamos/1")
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertIn("prestamo_id", data)
        self.assertIn("libro_id", data)
        self.assertIn("fecha_prestamo", data)
        self.assertIn("fecha_devolucion", data)

    @patch('routers.prestamos.encrypt', MagicMock(return_value=b'encrypted_data'))
    def test_obtener_prestamos(self):
        # Simulamos la obtención de préstamos desde la base de datos
        response = self.client.get("/prestamos/")
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertTrue(isinstance(data, list))

if __name__ == '__main__':
    unittest.main()