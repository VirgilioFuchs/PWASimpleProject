import mysql.connector
from flask import current_app

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host = current_app.config['DB_HOST'],
            user = current_app.config['DB_USER'],
            password = current_app.config['DB_PASSWORD'],
            database = current_app.config['DB_NAME']
        )
        return conn
    except mysql.connector.Error as err:
        print("Erro ao conectar ao Banco: {err}")
        return None