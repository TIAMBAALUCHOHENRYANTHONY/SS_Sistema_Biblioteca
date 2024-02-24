from fastapi import APIRouter, HTTPException
from models import Prestamo
from database import db_cursor, db_connection
import json

router = APIRouter()

# CRUD de préstamos
@router.post("/prestamos/")
async def crear_prestamo(prestamo: Prestamo):
    query = "INSERT INTO prestamos (libro_id, fecha_prestamo, fecha_devolucion) VALUES (%s, %s, %s)"
    values = (prestamo.libro_id, prestamo.fecha_prestamo, prestamo.fecha_devolucion)
    db_cursor.execute(query, values)
    db_connection.commit()
    return {"mensaje": "Préstamo creado exitosamente", "prestamo_id": db_cursor.lastrowid}

# OBTENCION DE PRESTAMO POR ID
@router.get("/prestamos/{prestamo_id}")
async def obtener_prestamo(prestamo_id: int):
    query = "SELECT * FROM prestamos WHERE prestamo_id = %s"
    db_cursor.execute(query, (prestamo_id,))
    prestamo = db_cursor.fetchone()
    if not prestamo:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")
    prestamo_dict = {
        "prestamo_id": str(prestamo[0]),
        "estudiante_id": str(prestamo[1]),
        "libro_id": str(prestamo[2]),
        "fecha_prestamo": str(prestamo[3]),
        "fecha_devolucion": str(prestamo[4]) if prestamo[4] else None
    }
    return {"data": prestamo_dict}

# ELIMINAR PRESTAMO
@router.delete("/prestamos/{prestamo_id}")
async def eliminar_prestamo(prestamo_id: int):
    query = "DELETE FROM prestamos WHERE prestamo_id = %s"
    db_cursor.execute(query, (prestamo_id,))
    db_connection.commit()
    return {"mensaje": "Préstamo eliminado exitosamente"}

@router.get("/prestamos/")
async def obtener_prestamos():
    query = "SELECT * FROM prestamos"
    db_cursor.execute(query)
    prestamos = db_cursor.fetchall()
    lista_prestamos = []
    for prestamo in prestamos:
        prestamo_dict = {
            "prestamo_id": str(prestamo[0]),
            "libro_id": str(prestamo[1]),
            "fecha_prestamo": str(prestamo[2]),
            "fecha_devolucion": str(prestamo[3]) if prestamo[3] else None
        }
        lista_prestamos.append(prestamo_dict)
    return {"data": lista_prestamos}
