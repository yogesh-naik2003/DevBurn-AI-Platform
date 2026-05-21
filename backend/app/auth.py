import json
from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from flask import current_app, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash


def _ensure_user_store():
    users_file = current_app.config["USERS_FILE"]
    users_file.parent.mkdir(parents=True, exist_ok=True)
    if not users_file.exists():
        users_file.write_text(
            json.dumps(
                {
                    "admin@example.com": {
                        "name": "Admin",
                        "password_hash": generate_password_hash("admin123"),
                    }
                },
                indent=2,
            )
        )


def _load_users():
    _ensure_user_store()
    return json.loads(current_app.config["USERS_FILE"].read_text())


def _save_users(users):
    current_app.config["USERS_FILE"].write_text(json.dumps(users, indent=2))


def register_user(name, email, password):
    users = _load_users()
    email = email.strip().lower()
    if email in users:
        return None, "Email is already registered"
    users[email] = {"name": name.strip() or email, "password_hash": generate_password_hash(password)}
    _save_users(users)
    return {"email": email, "name": users[email]["name"]}, None


def authenticate_user(email, password):
    users = _load_users()
    email = email.strip().lower()
    user = users.get(email)
    if not user or not check_password_hash(user["password_hash"], password):
        return None
    return {"email": email, "name": user["name"]}


def make_token(user):
    expires = datetime.now(timezone.utc) + timedelta(hours=current_app.config["JWT_EXPIRES_HOURS"])
    return jwt.encode(
        {"sub": user["email"], "name": user["name"], "exp": expires},
        current_app.config["SECRET_KEY"],
        algorithm="HS256",
    )


def token_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return jsonify({"error": "Missing bearer token"}), 401
        token = header.removeprefix("Bearer ").strip()
        try:
            payload = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
        except jwt.PyJWTError:
            return jsonify({"error": "Invalid or expired token"}), 401
        request.user = {"email": payload["sub"], "name": payload.get("name", payload["sub"])}
        return fn(*args, **kwargs)

    return wrapper
