import os
from pathlib import Path


class Config:
    BASE_DIR = Path(__file__).resolve().parents[1]
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-before-deploy")
    JWT_EXPIRES_HOURS = int(os.getenv("JWT_EXPIRES_HOURS", "8"))
    DATASET_PATH = Path(os.getenv("DATASET_PATH", "../employee_burnout_analysis-AI 2.xlsx"))
    if not DATASET_PATH.is_absolute():
        DATASET_PATH = (BASE_DIR / DATASET_PATH).resolve()
    ARTIFACT_DIR = Path(os.getenv("ARTIFACT_DIR", BASE_DIR / "artifacts")).resolve()
    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    USERS_FILE = ARTIFACT_DIR / "users.json"
