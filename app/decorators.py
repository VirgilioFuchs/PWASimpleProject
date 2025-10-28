from functools import wraps
from flask import request, abort, jsonify, current_app, g
import jwt

def require_jwt_token(f):

    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None

        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"message": "Token de autenticação ausente."}), 401

        try:
            jwt_secret = current_app.config['JWT_SECRET_KEY']
            data = jwt.decode(token, jwt_secret, algorithms=["HS256"])
            g.user_id = data['user_id']

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expirado. Faça login novamente."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token inválido."}), 401

        # 5. Se tudo deu certo, continue para a rota
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

    return  decorated_function