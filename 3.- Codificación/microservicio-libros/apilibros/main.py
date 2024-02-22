from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import mysql.connector

app = FastAPI()

# Conexión a la base de datos MySQL
db_connection = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="Jejocad1218",
    database="bibliotecadb"
)
db_cursor = db_connection.cursor()

# Definición de modelos
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

# CRUD de libros
@app.post("/libros/")
async def crear_libro(libro: Libro):
    query = "INSERT INTO libros (titulo, ISBN, año_publicacion, editorial, autor, estado) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (libro.titulo, libro.ISBN, libro.año_publicacion, libro.editorial, libro.autor, libro.estado)
    db_cursor.execute(query, values)
    db_connection.commit()
    return {"mensaje": "Libro creado exitosamente", "libro_id": db_cursor.lastrowid}

@app.get("/libros/{libro_id}")
async def obtener_libro(libro_id: int):
    query = "SELECT * FROM libros WHERE libro_id = %s"
    db_cursor.execute(query, (libro_id,))
    libro = db_cursor.fetchone()
    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    return {"libro_id": libro[0], "titulo": libro[1], "ISBN": libro[2], "año_publicacion": libro[3], "editorial": libro[4], "autor": libro[5], "estado": libro[6]}

@app.put("/libros/{libro_id}")
async def actualizar_libro(libro_id: int, libro: Libro):
    query = "UPDATE libros SET titulo = %s, ISBN = %s, año_publicacion = %s, editorial = %s, autor = %s, estado = %s WHERE libro_id = %s"
    values = (libro.titulo, libro.ISBN, libro.año_publicacion, libro.editorial, libro.autor, libro.estado, libro_id)
    db_cursor.execute(query, values)
    db_connection.commit()
    return {"mensaje": "Libro actualizado exitosamente"}

@app.put("/libros/{libro_id}/estado")
async def actualizar_estado_libro(libro_id: int, estado: Libro):
    query = "UPDATE libros SET estado = %s WHERE libro_id = %s"
    values = (estado.estado, libro_id)
    db_cursor.execute(query, values)
    db_connection.commit()
    return {"mensaje": "Estado del libro actualizado exitosamente"}

@app.delete("/libros/{libro_id}")
async def eliminar_libro(libro_id: int):
    query = "DELETE FROM libros WHERE libro_id = %s"
    db_cursor.execute(query, (libro_id,))
    db_connection.commit()
    return {"mensaje": "Libro eliminado exitosamente"}

# CRUD de préstamos
@app.post("/prestamos/")
async def crear_prestamo(prestamo: Prestamo):
    query = "INSERT INTO prestamos (estudiante_id, libro_id, fecha_prestamo, fecha_devolucion) VALUES (%s, %s, %s, %s)"
    values = (prestamo.estudiante_id, prestamo.libro_id, prestamo.fecha_prestamo, prestamo.fecha_devolucion)
    db_cursor.execute(query, values)
    db_connection.commit()
    return {"mensaje": "Préstamo creado exitosamente", "prestamo_id": db_cursor.lastrowid}

@app.get("/prestamos/{prestamo_id}")
async def obtener_prestamo(prestamo_id: int):
    query = "SELECT * FROM prestamos WHERE prestamo_id = %s"
    db_cursor.execute(query, (prestamo_id,))
    prestamo = db_cursor.fetchone()
    if not prestamo:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")
    return {"prestamo_id": prestamo[0], "estudiante_id": prestamo[1], "libro_id": prestamo[2], "fecha_prestamo": prestamo[3], "fecha_devolucion": prestamo[4]}

@app.delete("/prestamos/{prestamo_id}")
async def eliminar_prestamo(prestamo_id: int):
    query = "DELETE FROM prestamos WHERE prestamo_id = %s"
    db_cursor.execute(query, (prestamo_id,))
    db_connection.commit()
    return {"mensaje": "Préstamo eliminado exitosamente"}