import pandas as pd
import joblib
import os
import json
from sklearn.model_selection import train_test_split
from preprocessing import DataPreprocessor
from models import get_classification_models, get_regression_models
from tuning import ModelTuner
from evaluation import Evaluator

class MLPipeline:
    def __init__(self, data_path, target_column):
        self.data_path = data_path
        self.target_column = target_column
        self.preprocessor = DataPreprocessor()
        self.evaluator = Evaluator()
        self.results = {}
        self.best_model = None
        self.best_model_name = ""

    def run(self):
        # 1. Load Data
        df = pd.read_csv(self.data_path)
        
        # 2. Validate
        self.preprocessor.validate_dataset(df)
        
        # 3. Detect Problem Type
        problem_type = self.preprocessor.detect_problem_type(df, self.target_column)
        
        # 4. EDA
        eda_plots = self.evaluator.generate_eda(df, self.target_column)
        
        # 5. Preprocess
        X, y = self.preprocessor.preprocess(df, self.target_column, is_train=True)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # 6. Train Models
        models_dict = get_classification_models() if problem_type == "classification" else get_regression_models()
        
        leaderboard = []
        
        for name, model in models_dict.items():
            print(f"Training {name}...")
            try:
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
                metrics = self.evaluator.get_metrics(y_test, y_pred, problem_type)
                
                # Plot importance if possible
                imp_path = self.evaluator.plot_feature_importance(model, X.columns.tolist(), name)
                
                result = {
                    "model_name": name,
                    "metrics": metrics,
                    "importance_plot": imp_path
                }
                leaderboard.append(result)
            except Exception as e:
                print(f"Failed to train {name}: {str(e)}")

        # 7. Tuning (For top model or specific ones)
        # For simplicity, let's just pick the best one and try tuning if it's RF or XGB
        if problem_type == "classification":
            best_init = max(leaderboard, key=lambda x: x['metrics']['accuracy'])
        else:
            best_init = max(leaderboard, key=lambda x: x['metrics']['r2_score'])
            
        self.best_model_name = best_init['model_name']
        tuner = ModelTuner(problem_type)
        best_params = tuner.tune_model(self.best_model_name, X_train, y_train)
        
        if best_params:
            print(f"Tuning {self.best_model_name} with params: {best_params}")
            # Retrain with best params
            t_model = models_dict[self.best_model_name].set_params(**best_params)
            t_model.fit(X_train, y_train)
            y_pred = t_model.predict(X_test)
            new_metrics = self.evaluator.get_metrics(y_test, y_pred, problem_type)
            
            # Update best model
            self.best_model = t_model
            # Update entry in leaderboard
            for entry in leaderboard:
                if entry['model_name'] == self.best_model_name:
                    entry['metrics'] = new_metrics
                    entry['tuned'] = True
        else:
            self.best_model = models_dict[self.best_model_name]

        # 8. Save Best Model
        model_save_path = f"models/best_model_{problem_type}.joblib"
        joblib.dump({
            "model": self.best_model,
            "preprocessor": self.preprocessor,
            "problem_type": problem_type,
            "target": self.target_column,
            "features": X.columns.tolist()
        }, model_save_path)

        # 9. Final Results Package
        final_results = {
            "problem_type": problem_type,
            "target": self.target_column,
            "eda_plots": eda_plots,
            "leaderboard": leaderboard,
            "best_model": self.best_model_name,
            "model_path": model_save_path
        }
        
        with open("reports/results.json", "w") as f:
            json.dump(final_results, f, indent=4)
            
        return final_results
