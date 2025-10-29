from functools import wraps
from flask import request, jsonify, current_app, g
import jwt
import mysql.connector
from .db import get_db_connection

def require_jwt_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"message": "Token de autenticação ausente."}), 401

        conn = None
        cursor = None
        try:
            jwt_secret = current_app.config['JWT_SECRET_KEY']
            data = jwt.decode(token, jwt_secret, algorithms=["HS256"])
            user_id = data['user_id']

            conn = get_db_connection()
            if conn is None:
                return jsonify({"error": "Erro no servidor (banco de dados)"}), 500

            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT id, nomeUsuario, is_admin FROM usuarios WHERE id = %s", (user_id,))
            user = cursor.fetchone()

            if not user:
                return jsonify({"message": "Usuário do token não encontrado."}), 401

            g.user = user

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expirado. Faça login novamente."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token inválido."}), 401
        except mysql.connector.Error as err:
            return jsonify({"error": f"Erro de banco de dados: {err}"}), 500
        finally:
            if cursor:
                cursor.close()
            if conn and conn.is_connected():
                conn.close()
        
        return f(*args, **kwargs)

    return decorated_function


def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = current_app.config.get('API_KEY')
        chave_enviada = request.headers.get('X-API-Key')
        if chave_enviada and chave_enviada == api_key:
            return f(*args, **kwargs)
        else:
            response = jsonify({"error": "Chave api inválida ou ausente"})
            response.status_code = 401
            return response
    return decorated_function


def require_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not hasattr(g, 'user') or not g.user:
            return jsonify({"error": "Usuário não autenticado"}), 401
        
        if g.user.get('is_admin'):
            return f(*args, **kwargs)
        else:
            return jsonify({"error": "Acesso negado. Requer permissão do admin."}), 403

    return decorated_function
