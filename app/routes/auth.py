import bcrypt
import jwt
import datetime
import mysql.connector
from flask import Blueprint, request, jsonify, current_app, g
from ..db import get_db_collection
from ..decorators import require_api_key, require_jwt_token

auth_bp = Blueprint('auth', __name__)

@require_api_key
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Verificação da existência de usuário e senha
    if not username or not password:
        return jsonify({"error": "Usuário e senha são obrigatórios"}), 400

    # Criptografia da senha
    hashed_password_bytes = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    hashed_password = hashed_password_bytes.decode('utf-8')

    conn = get_db_collection()
    if conn is None:
        return jsonify({"error": "Erro ao conectar ao banco de dados"}), 500

    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO usuarios (nomeUsuario, senhaUsuario) VALUES (%s, %s)",
            (username, hashed_password)
        )
        conn.commit()
        return jsonify({"message": "Usuário registrado com sucesso!"}), 201
    except mysql.connector.Error as err:
        if err.errno == 1062:
            return jsonify({"error": "Nome de usuário já existente"}), 409
        return jsonify({"error": f"Erro de banco de dados: {err}"}), 500

    finally:
        cursor.close()
        conn.close()

@require_api_key
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Usuário e senha são obrigatórios"}), 400

    conn = get_db_collection()
    if conn is None:
        return jsonify({"error": "Erro ao conectar ao banco de dados"}), 500

    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM usuarios WHERE nomeUsuario = %s",
        (username,)
    )
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user is None:
        return jsonify({"error": "Credenciais inválidas"}), 401

    stored_password = user['senhaUsuario'].encode('utf-8')
    provided_password = password.encode('utf-8')

    if bcrypt.checkpw(provided_password, stored_password):
        jwt_secret = current_app.config['JWT_SECRET_KEY']

        token = jwt.encode(
            {
                'user_id': user['id'],
                'username': user['nomeUsuario'],
                'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
            },
            jwt_secret,
            algorithm='HS256'
        )

        print(token)
        return jsonify({"message": "Login bem-sucedido", "token" : token}), 200
    else:
        return jsonify({"error": "Credenciais inválidas"}), 401

@auth_bp.route('/user', methods=['GET'])
@require_api_key
@require_jwt_token
def get_profile():
    user_id_from_token = g.user_id

    conn = get_db_collection()
    if conn is None:
        return jsonify({"message": "Erro no servidor (banco de dados)"}), 500

    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT id, username, created_at FROM usuarios WHERE id = %s",
            (user_id_from_token,)
        )
        user = cursor.fetchone()

        if user:
            return jsonify(user), 200
        else:
            return jsonify({"error": "Usuário não encontrado."}), 404

    except mysql.connector.Error as err:
        return jsonify({"error": f"Erro de banco de dados: {err}"}), 500

    finally:
        cursor.close()
        conn.close()