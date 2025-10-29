from flask import Blueprint, request, jsonify, g
import mysql.connector
from ..db import get_db_connection
from ..decorators import require_api_key, require_jwt_token, require_admin

conversation_bp = Blueprint('conversation', __name__)

@conversation_bp.route('/conversa', methods=['POST'])
@require_api_key
@require_jwt_token
@require_admin
def post_message():
    data = request.get_json()
    content = data.get('content')

    if not content:
        return jsonify({"error": "O 'content' (conteúdo) da mensagem é obrigatório."}), 400

    admin_user_id = g.user['user_id']

    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Erro no servidor (banco de dados)"}), 500

        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO mensagens (user_id, content) VALUES (%s, %s)",
            (admin_user_id, content)
        )
        conn.commit()
        return jsonify({"message": "Mensagem postada com sucesso pelo admin."}), 201

    except mysql.connector.Error as err:
        return jsonify({"error": f"Erro de banco de dados: {err}"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

@conversation_bp.route('/conversa', methods=['GET'])
@require_api_key
@require_jwt_token
def get_messages():
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Erro no servidor (banco de dados)"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT m.content, DATE_FORMAT(m.created_at, '%H:%i') as created_at, u.nomeUsuario 
            FROM mensagens m
            JOIN usuarios u ON m.user_id = u.id 
            ORDER BY m.created_at ASC
            """
        )
        messages = cursor.fetchall()
        
        return jsonify(messages), 200

    except mysql.connector.Error as err:
        return jsonify({"error": f"Erro de banco de dados: {err}"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()
