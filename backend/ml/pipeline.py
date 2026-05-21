import json
import math
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from xgboost import XGBRegressor


TARGET = "Burn Rate"
ID_COLUMNS = ["Employee ID"]
DATE_COLUMN = "Date of Joining"
RANDOM_STATE = 42


def _clean_columns(df):
    df = df.copy()
    df.columns = [str(col).strip() for col in df.columns]
    return df


def load_dataset(dataset_path):
    df = pd.read_excel(dataset_path)
    df = _clean_columns(df)
    if TARGET not in df.columns:
        raise ValueError(f"Dataset must include target column '{TARGET}'")
    return df


def build_feature_frame(df):
    df = df.copy()
    for col in ID_COLUMNS:
        if col in df.columns:
            df = df.drop(columns=col)

    if DATE_COLUMN in df.columns:
        raw_joined = df[DATE_COLUMN]
        if pd.api.types.is_numeric_dtype(raw_joined):
            joined = pd.to_datetime(raw_joined, unit="D", origin="1899-12-30", errors="coerce")
        else:
            joined = pd.to_datetime(raw_joined, errors="coerce")
        reference_date = joined.max()
        df["Tenure Days"] = (reference_date - joined).dt.days
        df = df.drop(columns=[DATE_COLUMN])

    for col in df.columns:
        if col != TARGET:
            try:
                df[col] = pd.to_numeric(df[col])
            except (TypeError, ValueError):
                pass

    return df


def split_features(df):
    frame = build_feature_frame(df).dropna(subset=[TARGET])
    y = pd.to_numeric(frame[TARGET], errors="coerce")
    frame = frame.loc[y.notna()].copy()
    y = y.loc[y.notna()]
    x = frame.drop(columns=[TARGET])
    numeric_features = x.select_dtypes(include=["number"]).columns.tolist()
    categorical_features = [col for col in x.columns if col not in numeric_features]
    return x, y, numeric_features, categorical_features


def make_preprocessor(numeric_features, categorical_features):
    numeric_pipe = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )
    categorical_pipe = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
        ]
    )
    return ColumnTransformer(
        transformers=[
            ("numeric", numeric_pipe, numeric_features),
            ("categorical", categorical_pipe, categorical_features),
        ],
        remainder="drop",
    )


def model_specs():
    return {
        "Linear Regression": LinearRegression(),
        "Random Forest Regressor": RandomForestRegressor(
            n_estimators=250,
            max_depth=12,
            min_samples_leaf=3,
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),
        "XGBoost Regressor": XGBRegressor(
            n_estimators=350,
            max_depth=4,
            learning_rate=0.045,
            subsample=0.9,
            colsample_bytree=0.9,
            objective="reg:squarederror",
            random_state=RANDOM_STATE,
            n_jobs=2,
        ),
    }


def _metrics(y_true, y_pred):
    mse = mean_squared_error(y_true, y_pred)
    return {
        "mae": float(mean_absolute_error(y_true, y_pred)),
        "mse": float(mse),
        "rmse": float(np.sqrt(mse)),
        "r2": float(r2_score(y_true, y_pred)),
    }


def _feature_names(preprocessor):
    names = []
    if "numeric" in preprocessor.named_transformers_:
        names.extend(preprocessor.transformers_[0][2])
    cat_pipe = preprocessor.named_transformers_.get("categorical")
    if cat_pipe is not None:
        encoder = cat_pipe.named_steps["onehot"]
        categorical_cols = preprocessor.transformers_[1][2]
        names.extend(encoder.get_feature_names_out(categorical_cols).tolist())
    return names


def _feature_importance(pipeline):
    estimator = pipeline.named_steps["model"]
    names = _feature_names(pipeline.named_steps["preprocessor"])
    if hasattr(estimator, "feature_importances_"):
        values = estimator.feature_importances_
    elif hasattr(estimator, "coef_"):
        values = np.abs(np.ravel(estimator.coef_))
    else:
        return []
    rows = [{"feature": name, "importance": float(value)} for name, value in zip(names, values)]
    return sorted(rows, key=lambda row: row["importance"], reverse=True)[:20]


def train_all(dataset_path, artifact_dir):
    artifact_dir = Path(artifact_dir)
    artifact_dir.mkdir(parents=True, exist_ok=True)
    df = load_dataset(dataset_path)
    x, y, numeric_features, categorical_features = split_features(df)
    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.2, random_state=RANDOM_STATE
    )

    results = {}
    best_name = None
    best_rmse = float("inf")
    for name, estimator in model_specs().items():
        pipeline = Pipeline(
            steps=[
                ("preprocessor", make_preprocessor(numeric_features, categorical_features)),
                ("model", estimator),
            ]
        )
        pipeline.fit(x_train, y_train)
        y_train_pred = pipeline.predict(x_train)
        y_test_pred = pipeline.predict(x_test)
        
        train_metrics = _metrics(y_train, y_train_pred)
        test_metrics = _metrics(y_test, y_test_pred)
        rmse_gap = test_metrics["rmse"] - train_metrics["rmse"]
        overfit_ratio = test_metrics["rmse"] / max(train_metrics["rmse"], 1e-9)
        status = "watch" if overfit_ratio > 1.25 and rmse_gap > 0.03 else "ok"
        
        # Calculate real actual vs predicted scatter points (100 sample points from test set)
        indices = np.linspace(0, len(y_test) - 1, 100, dtype=int)
        y_test_sample = y_test.iloc[indices].values
        y_test_pred_sample = y_test_pred[indices]
        
        scatter_points = []
        for actual, predicted in zip(y_test_sample, y_test_pred_sample):
            act = float(actual)
            pred = float(np.clip(predicted, 0.0, 1.0))
            scatter_points.append({
                "actual": round(act, 4),
                "predicted": round(pred, 4),
                "residual": round(act - pred, 4)
            })
            
        results[name] = {
            "train": train_metrics,
            "test": test_metrics,
            "overfitting": {
                "rmse_gap": float(rmse_gap),
                "rmse_ratio": float(overfit_ratio),
                "status": status,
            },
            "feature_importance": _feature_importance(pipeline),
            "scatter_points": scatter_points,
        }
        joblib.dump(pipeline, artifact_dir / f"{slugify(name)}.joblib")
        if test_metrics["rmse"] < best_rmse:
            best_rmse = test_metrics["rmse"]
            best_name = name

    metadata = {
        "best_model": best_name,
        "target": TARGET,
        "features": x.columns.tolist(),
        "numeric_features": numeric_features,
        "categorical_features": categorical_features,
        "row_count": int(len(df)),
        "trained_rows": int(len(x_train)),
        "test_rows": int(len(x_test)),
        "metrics": results,
        "analytics": dataset_analytics(df),
    }
    (artifact_dir / "metadata.json").write_text(json.dumps(metadata, indent=2, cls=_SafeEncoder))
    return metadata


class _SafeEncoder(json.JSONEncoder):
    """JSON encoder that converts NaN / Inf to null so the output is always valid JSON."""
    def default(self, o):
        if isinstance(o, float) and (math.isnan(o) or math.isinf(o)):
            return None
        return super().default(o)

    def encode(self, o):
        return super().encode(self._sanitize(o))

    def _sanitize(self, o):
        if isinstance(o, float) and (math.isnan(o) or math.isinf(o)):
            return None
        if isinstance(o, dict):
            return {k: self._sanitize(v) for k, v in o.items()}
        if isinstance(o, list):
            return [self._sanitize(v) for v in o]
        if isinstance(o, (np.integer,)):
            return int(o)
        if isinstance(o, (np.floating,)):
            v = float(o)
            return None if math.isnan(v) or math.isinf(v) else v
        return o


def slugify(name):
    return name.lower().replace(" ", "_")


def ensure_artifacts(dataset_path, artifact_dir):
    artifact_dir = Path(artifact_dir)
    metadata_path = artifact_dir / "metadata.json"
    if not metadata_path.exists():
        return train_all(dataset_path, artifact_dir)
    return json.loads(metadata_path.read_text())


def load_best_model(artifact_dir):
    metadata = json.loads((Path(artifact_dir) / "metadata.json").read_text())
    model_path = Path(artifact_dir) / f"{slugify(metadata['best_model'])}.joblib"
    return metadata, joblib.load(model_path)

def predict_burnout(payload, artifact_dir):
    metadata = json.loads((Path(artifact_dir) / "metadata.json").read_text())
    row = {feature: payload.get(feature) for feature in metadata["features"]}
    df = pd.DataFrame([row])
    
    predictions = {}
    for model_name in metadata["metrics"].keys():
        try:
            model_path = Path(artifact_dir) / f"{slugify(model_name)}.joblib"
            pipeline = joblib.load(model_path)
            predictions[model_name] = float(np.clip(pipeline.predict(df)[0], 0, 1))
        except Exception:
            pass

    # Use the best model for the primary result
    best_model_name = metadata["best_model"]
    prediction = predictions.get(best_model_name, 0.0)

    if prediction >= 0.65:
        risk = "High"
    elif prediction >= 0.4:
        risk = "Moderate"
    else:
        risk = "Low"
        
    return {
        "burn_rate": prediction, 
        "risk_level": risk, 
        "model": best_model_name,
        "all_predictions": predictions
    }


def dataset_analytics(df):
    frame = build_feature_frame(df)
    target = pd.to_numeric(frame[TARGET], errors="coerce")
    by_gender = []
    if "Gender" in df.columns:
        by_gender = (
            df.assign(**{TARGET: pd.to_numeric(df[TARGET], errors="coerce")})
            .groupby("Gender", dropna=True)[TARGET]
            .mean()
            .reset_index()
            .rename(columns={TARGET: "average_burn_rate"})
            .to_dict(orient="records")
        )
    by_company = []
    if "Company Type" in df.columns:
        by_company = (
            df.assign(**{TARGET: pd.to_numeric(df[TARGET], errors="coerce")})
            .groupby("Company Type", dropna=True)[TARGET]
            .mean()
            .reset_index()
            .rename(columns={TARGET: "average_burn_rate"})
            .to_dict(orient="records")
        )
    by_wfh = []
    if "WFH Setup Available" in df.columns:
        by_wfh = (
            df.assign(**{TARGET: pd.to_numeric(df[TARGET], errors="coerce")})
            .groupby("WFH Setup Available", dropna=True)[TARGET]
            .mean()
            .reset_index()
            .rename(columns={TARGET: "average_burn_rate"})
            .to_dict(orient="records")
        )
    by_designation = []
    if "Designation" in df.columns:
        by_designation = (
            df.assign(**{TARGET: pd.to_numeric(df[TARGET], errors="coerce")})
            .groupby("Designation", dropna=True)[TARGET]
            .mean()
            .reset_index()
            .rename(columns={TARGET: "average_burn_rate"})
            .to_dict(orient="records")
        )
    by_resource = []
    if "Resource Allocation" in df.columns:
        by_resource = (
            df.assign(**{TARGET: pd.to_numeric(df[TARGET], errors="coerce")})
            .groupby("Resource Allocation", dropna=True)[TARGET]
            .mean()
            .reset_index()
            .rename(columns={TARGET: "average_burn_rate"})
            .to_dict(orient="records")
        )
    correlations = (
        frame.select_dtypes(include=["number"])
        .corr(numeric_only=True)[TARGET]
        .drop(labels=[TARGET], errors="ignore")
        .dropna()
        .sort_values(key=lambda values: values.abs(), ascending=False)
        .head(10)
    )
    return {
        "average_burn_rate": float(target.mean()),
        "median_burn_rate": float(target.median()),
        "high_risk_share": float((target >= 0.65).mean()),
        "missing_values": {k: int(v) for k, v in df.isna().sum().to_dict().items()},
        "burn_rate_by_gender": by_gender,
        "burn_rate_by_company_type": by_company,
        "burn_rate_by_wfh": by_wfh,
        "burn_rate_by_designation": by_designation,
        "burn_rate_by_resource_allocation": by_resource,
        "correlations": [
            {"feature": feature, "correlation": float(value)}
            for feature, value in correlations.items()
        ],
    }

