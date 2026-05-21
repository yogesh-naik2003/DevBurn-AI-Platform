# AI Developer Burnout Prediction Platform

Full-stack burnout regression platform with a React frontend, Flask REST API, and Python ML pipeline.

## What is included

- Linear Regression, Random Forest Regressor, and XGBoost Regressor training
- Preprocessing for missing values, categorical encoding, scaling, and tenure engineering
- Evaluation metrics: MAE, MSE, RMSE, and R2
- Overfitting detection using train RMSE vs test RMSE comparison
- Feature importance output for tree models and coefficient magnitude for linear regression
- JWT authentication with login/register
- REST APIs for auth, models, analytics, predictions, and retraining
- Responsive prediction, analytics, and model diagnostic dashboards
- Deployment-ready requirements, environment examples, and Docker files

## Faculty Mandatory Requirements

| Requirement | Status | Where implemented |
| --- | --- | --- |
| Linear Regression | Included | `backend/ml/pipeline.py` -> `model_specs()` |
| Random Forest Regressor | Included | `backend/ml/pipeline.py` -> `model_specs()` |
| XGBoost Regressor | Included | `backend/ml/pipeline.py` -> `model_specs()` |
| Model evaluation comparison | Included | `backend/ml/pipeline.py` computes MAE, MSE, RMSE, R2 for every model; `frontend/src/components/ModelsPanel.jsx` displays comparison |
| Overfitting analysis | Included | `backend/ml/pipeline.py` compares train RMSE vs test RMSE and marks `ok` or `watch`; frontend shows Train vs Test RMSE chart |
| Deployment | Included | `backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml`, `.env.example` files |

## Project structure

```text
backend/
  app/             Flask app, auth, routes
  ml/              Training, preprocessing, analytics, prediction pipeline
frontend/
  src/             React dashboard
employee_burnout_analysis-AI 2.xlsx
```

## Backend setup

```powershell
cd backend
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
python run.py
```

The first protected API request trains models and writes artifacts to `backend/artifacts/`.

## Notebook training workflow

You can train the model from Jupyter and then use the saved model in the frontend.

```powershell
cd backend
.\\.venv\\Scripts\\Activate.ps1
pip install -r ..\\notebooks\\requirements-notebook.txt
jupyter notebook ..\\notebooks\\train_burnout_models.ipynb
```

Run all notebook cells. The notebook trains Linear Regression, Random Forest Regressor, and XGBoost Regressor on `employee_burnout_analysis-AI 2.xlsx`, evaluates the models, performs overfitting analysis, visualizes feature importance, and saves the trained artifacts into:

```text
backend/artifacts/
```

The Flask API automatically reads those artifacts, so after notebook training you only need to restart `python run.py` and refresh the React frontend.

If you run the notebook in Google Colab, upload the full project folder so the files exist at:

```text
/content/ISM/backend/ml/pipeline.py
/content/ISM/employee_burnout_analysis-AI 2.xlsx
```

Then set this in the first notebook cell if auto-detection does not find it:

```python
MANUAL_PROJECT_ROOT = "/content/ISM"
```

After training in Colab, download the generated `backend/artifacts/` files and copy them into your local `backend/artifacts/` folder before restarting Flask.

Default login:

```text
admin@example.com
admin123
```

## Frontend setup

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:5173`.

## API endpoints

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/models`
- `GET /api/analytics`
- `POST /api/predict`
- `POST /api/train`

Protected endpoints require:

```text
Authorization: Bearer <jwt>
```

## Prediction payload

```json
{
  "Gender": "Male",
  "Company Type": "Product",
  "WFH Setup Available": "Yes",
  "Designation": 2,
  "Resource Allocation": 5,
  "Mental Fatigue Score": 5.5,
  "Tenure Days": 900
}
```

## Production notes

- Set a strong `SECRET_KEY`.
- Change the seed admin password or delete `backend/artifacts/users.json` after creating real users.
- Serve Flask with Gunicorn or a platform WSGI runner.
- Build React with `npm run build` and serve `frontend/dist` from your static host.
- Keep `DATASET_PATH`, `ARTIFACT_DIR`, and `FRONTEND_ORIGIN` environment-specific.

## Docker deployment

From the project root:

```powershell
docker compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Health check: `http://localhost:5000/api/health`
