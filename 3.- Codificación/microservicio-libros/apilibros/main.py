from fastapi import FastAPI
from routers import libros, prestamos

app = FastAPI()

# Incluyendo los routers de libros y préstamos
app.include_router(libros.router)
app.include_router(prestamos.router)