from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import shutil
import os
import uuid
import json
from train import MLPipeline

app = FastAPI(title="AutoTrainML API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
UPLOADS_DIR = "uploads"
MODELS_DIR = "models"
REPORTS_DIR = "reports"

for d in [UPLOADS_DIR, MODELS_DIR, REPORTS_DIR]:
    if not os.path.exists(d):
        os.makedirs(d)

# Serve static files for reports (plots)
app.mount("/reports", StaticFiles(directory=REPORTS_DIR), name="reports")

# In-memory job status
jobs = {}

@app.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOADS_DIR, f"{file_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Get columns preview
    import pandas as pd
    df = pd.read_csv(file_path, nrows=5)
    columns = df.columns.tolist()
    preview = df.head(5).to_dict(orient='records')
    
    return {
        "dataset_id": file_id,
        "filename": file.filename,
        "columns": columns,
        "preview": preview,
        "path": file_path
    }

def run_training_task(dataset_id, file_path, target_column):
    try:
        jobs[dataset_id] = {"status": "processing", "progress": 10}
        pipeline = MLPipeline(file_path, target_column)
        results = pipeline.run()
        jobs[dataset_id] = {"status": "completed", "results": results}
    except Exception as e:
        jobs[dataset_id] = {"status": "failed", "error": str(e)}

@app.post("/train")
async def train_model(background_tasks: BackgroundTasks, dataset_id: str = Form(...), path: str = Form(...), target_column: str = Form(...)):
    if dataset_id in jobs and jobs[dataset_id]["status"] == "processing":
        return {"message": "Training already in progress", "dataset_id": dataset_id}
    
    background_tasks.add_task(run_training_task, dataset_id, path, target_column)
    return {"message": "Training started", "dataset_id": dataset_id}

@app.get("/status/{dataset_id}")
async def get_status(dataset_id: str):
    if dataset_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[dataset_id]

@app.get("/results/{dataset_id}")
async def get_results(dataset_id: str):
    if dataset_id not in jobs:
        # Check if results.json exists in reports (for persistence in this simple version)
        if os.path.exists("reports/results.json"):
             with open("reports/results.json", "r") as f:
                 return json.load(f)
        raise HTTPException(status_code=404, detail="Results not found")
    
    job = jobs[dataset_id]
    if job["status"] == "completed":
        return job["results"]
    return job


@app.get("/download-model")
async def download_model():
    # Find the most recent joblib file in models
    files = [f for f in os.listdir(MODELS_DIR) if f.endswith('.joblib')]
    if not files:
        raise HTTPException(status_code=404, detail="No trained models found")
    
    # Just take the first one or most recent
    latest_model = os.path.join(MODELS_DIR, files[0])
    return FileResponse(latest_model, filename="best_model.joblib")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
