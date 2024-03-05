from fastapi import APIRouter, HTTPException, Query
from models import Libro
from database import db_cursor, db_connection
import json
from Crypto.Cipher import AES

key = b'mi_clave_secreta'

import binascii

def encrypt(key, data):
    cipher = AES.new(key, AES.MODE_EAX)
    ciphertext, tag = cipher.encrypt_and_digest(data.encode())

    encrypted_data = cipher.nonce + tag + ciphertext
    return binascii.hexlify(encrypted_data)

def decrypt(key, encrypted_data):
    encrypted_bytes = binascii.unhexlify(encrypted_data)
    nonce = encrypted_bytes[:AES.block_size]
    tag = encrypted_bytes[AES.block_size:AES.block_size * 2]
    ciphertext = encrypted_bytes[AES.block_size * 2:]

    cipher = AES.new(key, AES.MODE_EAX, nonce)
    plaintext = cipher.decrypt_and_verify(ciphertext, tag)

    return plaintext


router = APIRouter()

# CRUD de libros
@router.post("/libro/")
async def crear_libro(libro: Libro):
    query = "INSERT INTO libros (titulo, ISBN, año_publicacion, editorial, autor, estado) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (libro.titulo, libro.ISBN, libro.año_publicacion, libro.editorial, libro.autor, libro.estado)
    db_cursor.execute(query, values)
    db_connection.commit()
    return {"mensaje": "Libro creado exitosamente", "libro_id": db_cursor.lastrowid}

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
        encrypted_libro = encrypt(key, json.dumps(libro_dict))
        lista_libros.append(encrypted_libro)
    return {"data": lista_libros}

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
    encrypted_libro = encrypt(key, json.dumps(libro_dict))
    return {"data": encrypted_libro}

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
        encrypted_libro = encrypt(key, json.dumps(libro_dict))
        lista_libros.append(encrypted_libro)
        
    return {"data": lista_libros}

# ACTUALIZAR LIBROS
@router.put("/libros/{libro_id}")
async def actualizar_libro(libro_id: int, libro: Libro):
    query = "UPDATE libros SET titulo = %s, ISBN = %s, año_publicacion = %s, editorial = %s, autor = %s, estado = %s WHERE libro_id = %s"
    values = (libro.titulo, libro.ISBN, libro.año_publicacion, libro.editorial, libro.autor, libro.estado, libro_id)
    db_cursor.execute(query, values)
    db_connection.commit()
    return {"mensaje": "Libro actualizado exitosamente"}

# ACTUALIZAR ESTADO DE LOS LIBROS
@router.put("/libros/{libro_id}/estado")
async def actualizar_estado_libro(libro_id: int, estado: str):
    query = "UPDATE libros SET estado = %s WHERE libro_id = %s"
    values = (estado, libro_id)
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

# RUTA PARA OBTENER LIBROS POR TÍTULO
@router.get("/libros/titulo/")
async def obtener_libros_por_titulo(titulo: str = Query(..., min_length=1)):
    query = "SELECT * FROM libros WHERE titulo LIKE %s"
    db_cursor.execute(query, ('%' + titulo + '%',))
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
        encrypted_libro = encrypt(key, json.dumps(libro_dict))
        lista_libros.append(encrypted_libro)
        
    return {"data": lista_libros}

# RUTA PARA OBTENER LIBROS POR AUTOR
@router.get("/libros/autor/")
async def obtener_libros_por_autor(autor: str = Query(..., min_length=1)):
    query = "SELECT * FROM libros WHERE autor LIKE %s"
    db_cursor.execute(query, ('%' + autor + '%',))
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
        encrypted_libro = encrypt(key, json.dumps(libro_dict))
        lista_libros.append(encrypted_libro)
        
    return {"data": lista_libros}