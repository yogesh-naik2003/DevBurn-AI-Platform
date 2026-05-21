from flask import Blueprint, current_app, jsonify, request
from flask_cors import CORS

from .auth import authenticate_user, make_token, register_user, token_required
from ml.pipeline import ensure_artifacts, predict_burnout, train_all

api = Blueprint("api", __name__)
CORS(api, supports_credentials=True)


def _metadata():
    return ensure_artifacts(current_app.config["DATASET_PATH"], current_app.config["ARTIFACT_DIR"])


@api.get("/health")
def health():
    return jsonify({"status": "ok"})


@api.post("/auth/login")
def login():
    body = request.get_json(force=True) or {}
    user = authenticate_user(body.get("email", ""), body.get("password", ""))
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401
    return jsonify({"token": make_token(user), "user": user})


@api.post("/auth/register")
def register():
    body = request.get_json(force=True) or {}
    if not body.get("email") or not body.get("password"):
        return jsonify({"error": "Email and password are required"}), 400
    user, error = register_user(body.get("name", ""), body["email"], body["password"])
    if error:
        return jsonify({"error": error}), 409
    return jsonify({"token": make_token(user), "user": user}), 201


@api.get("/models")
@token_required
def models():
    metadata = _metadata()
    return jsonify(
        {
            "best_model": metadata["best_model"],
            "target": metadata["target"],
            "features": metadata["features"],
            "numeric_features": metadata["numeric_features"],
            "categorical_features": metadata["categorical_features"],
            "row_count": metadata["row_count"],
            "trained_rows": metadata["trained_rows"],
            "test_rows": metadata["test_rows"],
            "metrics": metadata["metrics"],
        }
    )


@api.get("/analytics")
@token_required
def analytics():
    return jsonify(_metadata()["analytics"])


@api.post("/predict")
@token_required
def predict():
    body = request.get_json(force=True) or {}
    return jsonify(predict_burnout(body, current_app.config["ARTIFACT_DIR"]))


@api.post("/train")
@token_required
def train():
    metadata = train_all(current_app.config["DATASET_PATH"], current_app.config["ARTIFACT_DIR"])
    return jsonify({"message": "Models retrained", "best_model": metadata["best_model"]})
