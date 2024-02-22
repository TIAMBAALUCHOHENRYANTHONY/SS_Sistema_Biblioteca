from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import mysql.connector

from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from datetime import datetime, timedelta

# Configuración del JWT
SECRET_KEY = "bibliotecaESPE123"  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return user_id

# Dummy database para autenticación (reemplázalo con tu propio mecanismo de autenticación)
users_db = {
    "jjcadena2@espe.edu.ec": {
        "username": "jjcadena2@espe.edu.ec",
        "hashed_password": "passw0rd123",
        "full_name": "Jeremy Cadena"
    }
}

app = FastAPI()

# Endpoint para generar tokens JWT
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_dict = users_db.get(form_data.username)
    if not user_dict:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    if not form_data.password == user_dict["hashed_password"]:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    access_token = create_access_token(
        data={"sub": user_dict["username"]}
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Conexión a la base de datos MySQL
db_connection = mysql.connector.connect(
    host="127.0.0.1",user="root", password="Jejocad1218", database="bibliotecadb" 
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
@app.get("/libros/", dependencies=[Depends(get_current_user)])
async def obtener_libros():
    query = "SELECT * FROM libros"
    db_cursor.execute(query)
    libros = db_cursor.fetchall()
    lista_libros = []
    for libro in libros:
        libro_dict = {
            "libro_id": libro[0],
            "titulo": libro[1],
            "ISBN": libro[2],
            "año_publicacion": libro[3],
            "editorial": libro[4],
            "autor": libro[5],
            "estado": libro[6]
        }
        lista_libros.append(libro_dict)
    return lista_libros

# CREACIÓN DE LIBROS
@app.post("/libro/")
async def crear_libro(libro: Libro):
    query = "INSERT INTO libros (titulo, ISBN, año_publicacion, editorial, autor, estado) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (libro.titulo, libro.ISBN, libro.año_publicacion, libro.editorial, libro.autor, libro.estado)
    db_cursor.execute(query, values)
    db_connection.commit()
    return {"mensaje": "Libro creado exitosamente", "libro_id": db_cursor.lastrowid}

# OBTENER LIBRO POR ID
@app.get("/libros/{libro_id}", dependencies=[Depends(get_current_user)])
async def obtener_libro(libro_id: int):
    query = "SELECT * FROM libros WHERE libro_id = %s"
    db_cursor.execute(query, (libro_id,))
    libro = db_cursor.fetchone()
    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    return {"libro_id": libro[0], "titulo": libro[1], "ISBN": libro[2], "año_publicacion": libro[3], "editorial": libro[4], "autor": libro[5], "estado": libro[6]}

# ACTUALIZAR LIBROS
@app.put("/libros/{libro_id}")
async def actualizar_libro(libro_id: int, libro: Libro):
    query = "UPDATE libros SET titulo = %s, ISBN = %s, año_publicacion = %s, editorial = %s, autor = %s, estado = %s WHERE libro_id = %s"
    values = (libro.titulo, libro.ISBN, libro.año_publicacion, libro.editorial, libro.autor, libro.estado, libro_id)
    db_cursor.execute(query, values)
    db_connection.commit()
    return {"mensaje": "Libro actualizado exitosamente"}

# ACTUALIZAR ESTADO DEL LIBRO
@app.put("/libros/{libro_id}/estado")
async def actualizar_estado_libro(libro_id: int, estado: Libro):
    query = "UPDATE libros SET estado = %s WHERE libro_id = %s"
    values = (estado.estado, libro_id)
    db_cursor.execute(query, values)
    db_connection.commit()
    return {"mensaje": "Estado del libro actualizado exitosamente"}

# ELIMINAR LIBROS
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

@app.get("/prestamos/{prestamo_id}", dependencies=[Depends(get_current_user)])
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