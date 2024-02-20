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

