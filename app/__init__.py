from flask import Flask
from flask_cors import CORS
from .config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp)

    from .routes.conversation import conversation_bp
    app.register_blueprint(conversation_bp)

    return app