from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import libros, prestamos

app = FastAPI()

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir solicitudes desde cualquier origen
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Métodos permitidos
    allow_headers=["*"],  # Encabezados permitidos
)

# Incluyendo los routers de libros y préstamos
app.include_router(libros.router)
app.include_router(prestamos.router)