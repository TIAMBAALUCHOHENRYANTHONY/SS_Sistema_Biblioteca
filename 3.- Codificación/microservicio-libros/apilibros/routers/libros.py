from fastapi import APIRouter, HTTPException
from models import Libro
from cryptography.fernet import Fernet
from database import db_cursor, db_connection
import json

router = APIRouter()

# Clave de cifrado
key = Fernet.generate_key()
cipher_suite = Fernet(key)

# CRUD de libros
@router.get("/libros/")
async def obtener_libros():
    query = "SELECT * FROM libros"
    db_cursor.execute(query)
    libros = db_cursor.fetchall()
    lista_libros = []
    for libro in libros:
        libro_dict = {
            "libro_id": str(libro[0]),
            "titulo": libro[1],
            "ISBN": libro[2],
            "año_publicacion": str(libro[3]),
            "editorial": libro[4],
            "autor": libro[5],
            "estado": libro[6]
        }
        lista_libros.append(libro_dict)
    response_json = json.dumps(lista_libros)
    encrypted_response = cipher_suite.encrypt(response_json.encode())
    return {"data": encrypted_response.decode()}

# CREACIÓN DE LIBROS
@router.post("/libro/")
async def crear_libro(libro: Libro):
    query = "INSERT INTO libros (titulo, ISBN, año_publicacion, editorial, autor, estado) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (libro.titulo, libro.ISBN, libro.año_publicacion, libro.editorial, libro.autor, libro.estado)
    db_cursor.execute(query, values)
    db_connection.commit()
    return {"mensaje": "Libro creado exitosamente", "libro_id": db_cursor.lastrowid}

# OBTENER LIBRO POR ID
@router.get("/libros/{libro_id}")
async def obtener_libro(libro_id: int):
    query = "SELECT * FROM libros WHERE libro_id = %s"
    db_cursor.execute(query, (libro_id,))
    libro = db_cursor.fetchone()
    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    libro_dict = {
        "libro_id": str(libro[0]),
        "titulo": libro[1],
        "ISBN": libro[2],
        "año_publicacion": str(libro[3]),
        "editorial": libro[4],
        "autor": libro[5],
        "estado": libro[6]
    }
    response_json = json.dumps(libro_dict)
    encrypted_response = cipher_suite.encrypt(response_json.encode())
    return {"data": encrypted_response.decode()}

# OBTENER LIBRO POR ESTADO
@router.get("/libros/estado/{estado}")
async def obtener_libros_por_estado(estado: str):
    query = "SELECT * FROM libros WHERE estado = %s"
    db_cursor.execute(query, (estado,))
    libros = db_cursor.fetchall()
    
    lista_libros = []
    for libro in libros:
        libro_dict = {
            "libro_id": str(libro[0]),
            "titulo": libro[1],
            "ISBN": libro[2], 
            "año_publicacion": str(libro[3]),
            "editorial": libro[4],
            "autor": libro[5],
            "estado": libro[6]
        }
        lista_libros.append(libro_dict)
        
    response_json = json.dumps(lista_libros)
    encrypted_response = cipher_suite.encrypt(response_json.encode())
    return {"data": encrypted_response.decode()}

# ACTUALIZAR LIBROS
@router.put("/libros/{libro_id}")
async def actualizar_libro(libro_id: int, libro: Libro):
    query = "UPDATE libros SET titulo = %s, ISBN = %s, año_publicacion = %s, editorial = %s, autor = %s, estado = %s WHERE libro_id = %s"
    values = (libro.titulo, libro.ISBN, libro.año_publicacion, libro.editorial, libro.autor, libro.estado, libro_id)
    db_cursor.execute(query, values)
    db_connection.commit()
    return {"mensaje": "Libro actualizado exitosamente"}

# ACTUALIZAR ESTADO DEL LIBRO
@router.put("/libros/{libro_id}/estado")
async def actualizar_estado_libro(libro_id: int, estado: Libro):
    query = "UPDATE libros SET estado = %s WHERE libro_id = %s"
    values = (estado.estado, libro_id)
    db_cursor.execute(query, values)
    db_connection.commit()
    return {"mensaje": "Estado del libro actualizado exitosamente"}

# ELIMINAR LIBROS
@router.delete("/libros/{libro_id}")
async def eliminar_libro(libro_id: int):
    query = "DELETE FROM libros WHERE libro_id = %s"
    db_cursor.execute(query, (libro_id,))
    db_connection.commit()
    return {"mensaje": "Libro eliminado exitosamente"}