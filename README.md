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

### UI
<img width="1871" height="897" alt="Image" src="https://github.com/user-attachments/assets/e1bac852-43bd-41ea-81c4-190863a8d13d" />


### Upload dataset
<img width="1225" height="527" alt="Image" src="https://github.com/user-attachments/assets/d114a6d2-e664-4b31-8182-164de6670b70" />


### Select the target column
<img width="1857" height="900" alt="Image" src="https://github.com/user-attachments/assets/a774fc15-690d-40a0-8ba5-8abec4420f9b" />


### Find the best model
<img width="1875" height="717" alt="Image" src="https://github.com/user-attachments/assets/be3f8a6f-ed1c-4c52-b6c2-26a80b0b2fb6" />
<img width="1856" height="877" alt="Image" src="https://github.com/user-attachments/assets/77d56a35-592c-4128-a036-25b7ecae685b" />


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
