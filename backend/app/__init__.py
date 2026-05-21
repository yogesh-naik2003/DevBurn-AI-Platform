from flask import Flask
from flask_cors import CORS

from .config import Config
from .routes import api


from flask import request

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Register blueprint first
    app.register_blueprint(api, url_prefix="/api")
    
    # Then initialize CORS
    CORS(app, supports_credentials=True)

    @app.before_request
    def log_before():
        print(f"--> BEFORE REQUEST: {request.method} {request.path} | Origin: {request.headers.get('Origin')}", flush=True)

    @app.after_request
    def log_after(response):
        print(f"<-- AFTER REQUEST: {response.status} | CORS Headers: {response.headers.get('Access-Control-Allow-Origin')}", flush=True)
        return response
    
    return app
