from pydantic import BaseModel
from typing import Optional

class Libro(BaseModel):
    titulo: str
    ISBN: str
    año_publicacion: int
    editorial: str
    autor: str
    estado: str

class Prestamo(BaseModel):
    estudiante_id: int
    libro_id: int
    fecha_prestamo: str
    fecha_devolucion: Optional[str] = None