# Instrucciones para Microservicio de Autenticación con Roles y Permisos

Este servicio proporciona funcionalidades de autenticación para usuarios, con la capacidad de asignar roles y permisos, así como realizar operaciones de registro e inicio de sesión.

## Funcionalidades

- Registro de usuarios con nombre de usuario y contraseña.
- Inicio de sesión seguro utilizando JWT (JSON Web Tokens).
- Asignación de roles a los usuarios.
- Definición de permisos asociados a roles.
- Verificación de permisos antes de permitir el acceso a recursos protegidos.

## Tecnologías Utilizadas

- Node.js: Plataforma de tiempo de ejecución de JavaScript.
- Express.js: Marco de aplicación web para Node.js.
- MySQL: Sistema de gestión de bases de datos relacional.
- bcrypt: Biblioteca para el hash seguro de contraseñas.
- JSON Web Tokens (JWT): Método compacto y seguro para la transmisión de información entre partes como un objeto JSON.

## Instalación

1. Clona este repositorio en tu máquina local:

    ```
    git clone https://github.com/tuusuario/servicio-autenticacion.git
    ```

2. Instala las dependencias utilizando npm:

    ```
    cd servicio-autenticacion
    npm install
    ```

3. Configura la base de datos MySQL y actualiza la configuración de conexión en `config/db.js`.

4. Ejecuta el servidor:

    ```
    npm start
    ```
## Uso de las Rutas

### Inicio de Sesión
Utiliza la ruta `/api/login` para iniciar sesión. Envía una solicitud POST con el nombre de usuario y la contraseña en el cuerpo de la solicitud.

POST /api/login

Cuerpo de la solicitud:
{
    "username": "ejemplo",
    "password": "contraseña"
}

POST /api/register

Cuerpo de la solicitud:
{
    "username": "nuevoUsuario",
    "password": "contraseña"
}

## Uso del Microservicio

### Operaciones de Usuario
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id
- GET /api/users
- GET /api/userName/:username
- PUT /api/userRole/:id
### Operaciones de Rol
- POST /api/roles
- GET /api/roles/:id
- GET /api/roles
- PUT /api/roles/:id
- DELETE /api/roles/:id
### Operaciones de Permiso
- POST /api/permissions
- GET /api/permissions/:id
- GET /api/permissions
- PUT /api/permissions/:id
- DELETE /api/permissions/:id

### Instrucciones para Montar el Microservicio-Libros

#### Requisitos Previos
- Python 3.x instalado en tu sistema.
- MySQL Server instalado y en funcionamiento.

#### Pasos para la Configuración

1. **Configuración de la Base de Datos:**
   - Asegúrate de tener un servidor MySQL en ejecución.
   - Crea una base de datos llamada `bibliotecadb`.

2. **Configuración de la Conexión a la Base de Datos:**
   - Abre el archivo `main.py`.
   - Modifica los parámetros de conexión a la base de datos según tu configuración:
     ```python
     db_connection = mysql.connector.connect(
         host="127.0.0.1",
         user="root",
         password="TuContraseña",
         database="bibliotecadb"
     )
     ```

#### Ejecución del Microservicio

3. **Inicia el Servidor FastAPI:**
   ```
   uvicorn main:app --reload
   ```

4. **Accede al Microservicio:**
   - Una vez que el servidor esté en funcionamiento, puedes acceder a la documentación y realizar peticiones a través de tu navegador o herramientas como Postman.
   - La documentación estará disponible en `http://localhost:8000/docs`.

#### Uso del Microservicio

- **Crear un Nuevo Libro:**
  ```
  POST /libros/
  ```
- **Obtener Detalles de un Libro:**
  ```
  GET /libros/{libro_id}
  ```
- **Actualizar Detalles de un Libro:**
  ```
  PUT /libros/{libro_id}
  ```
- **Actualizar Estado de un Libro:**
  ```
  PUT /libros/{libro_id}/estado
  ```
- **Eliminar un Libro:**
  ```
  DELETE /libros/{libro_id}
  ```

- **Crear un Nuevo Préstamo:**
  ```
  POST /prestamos/
  ```
- **Obtener Detalles de un Préstamo:**
  ```
  GET /prestamos/{prestamo_id}
  ```
- **Eliminar un Préstamo:**
  ```
  DELETE /prestamos/{prestamo_id}
  ```

#### Notas Adicionales
- Asegúrate de que el servicio MySQL esté en ejecución antes de iniciar el microservicio.
- No olvides revisar y ajustar las políticas de seguridad y permisos según tus necesidades.
- Para entornos de producción, se recomienda configurar apropiadamente los parámetros de seguridad y las variables de entorno sensibles.
- Para más detalles sobre las rutas y los modelos de datos, consulta la documentación de FastAPI en `http://localhost:8000/docs`.

