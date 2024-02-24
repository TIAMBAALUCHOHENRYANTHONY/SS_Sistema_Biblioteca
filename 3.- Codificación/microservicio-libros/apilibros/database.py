import mysql.connector

# Conexión a la base de datos MySQL
db_connection = mysql.connector.connect(
    host="127.0.0.1", user="root", password="", database="bibliotecadb"
)
db_cursor = db_connection.cursor()