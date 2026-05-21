FROM python:3.11-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
COPY employee_burnout_analysis-AI\ 2.xlsx /data.xlsx

ENV DATASET_PATH=/data.xlsx
ENV ARTIFACT_DIR=/app/artifacts
EXPOSE 5000
CMD ["gunicorn", "-b", "0.0.0.0:5000", "run:app"]
