# AutoTrainML 🚀

A professional, full-stack AutoML platform that automates the entire machine learning lifecycle—from data preprocessing to model deployment.

## ✨ Features

- **Automated Data Preprocessing**: Handles missing values, encoding, and feature scaling automatically.
- **Smart Problem Detection**: Automatically identifies if your task is Classification or Regression.
- **Ensemble Learning**: Trains 20+ models including Random Forest, XGBoost, LightGBM, SVM, and more.
- **Hyperparameter Tuning**: Integrated with **Optuna** for Bayesian optimization of model parameters.
- **Automatic EDA**: Generates correlation heatmaps, distribution plots, and feature importance charts.
- **Modern UI**: Built with React, Tailwind CSS, and Framer Motion for a premium, responsive experience.

## Images

## 🛠️ Tech Stack

### Backend 
- **Core**: FastAPI (Python)
- **ML**: Scikit-Learn, XGBoost, LightGBM, Optuna
- **Data**: Pandas, NumPy
- **Viz**: Matplotlib, Seaborn

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🚀 Getting Started

### 1. Project Structure
```text
AutoTrainML
├── backend/        # FastAPI ML Engine
├── frontend/       # React Dashboard
└── README.md
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*Port: 8000*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Port: 5173*

## 📖 Usage Workflow

1. **Upload**: Drag and drop your CSV dataset.
2. **Select**: Choose the target column (the variable you want to predict).
3. **Train**: Click start and watch the AI pipeline handle Preprocessing, EDA, and Model Selection.
4. **Deploy**: View the model leaderboard, explore EDA charts, and download the best-performing model as a `.joblib` file.

---
