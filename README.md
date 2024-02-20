Servicio de Autenticación con Roles y Permisos
Este servicio proporciona funcionalidades de autenticación para usuarios, con la capacidad de asignar roles y permisos, así como realizar operaciones de registro e inicio de sesión.

Funcionalidades
Registro de usuarios con nombre de usuario y contraseña.
Inicio de sesión seguro utilizando JWT (JSON Web Tokens).
Asignación de roles a los usuarios.
Definición de permisos asociados a roles.
Verificación de permisos antes de permitir el acceso a recursos protegidos.
Tecnologías Utilizadas
Node.js: Plataforma de tiempo de ejecución de JavaScript.
Express.js: Marco de aplicación web para Node.js.
MySQL: Sistema de gestión de bases de datos relacional.
bcrypt: Biblioteca para el hash seguro de contraseñas.
JSON Web Tokens (JWT): Método compacto y seguro para la transmisión de información entre partes como un objeto JSON.
Instalación
Clona este repositorio en tu máquina local:

bash
Copy code
git clone https://github.com/tuusuario/servicio-autenticacion.git
Instala las dependencias utilizando npm:

bash
Copy code
cd servicio-autenticacion
npm install
Configura la base de datos MySQL y actualiza la configuración de conexión en config/db.js.

Ejecuta el servidor:

sql
Copy code
npm start

Aquí tienes los pasos detallados para montar este microservicio en un README en GitHub:

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

