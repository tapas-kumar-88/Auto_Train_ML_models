import optuna
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from xgboost import XGBClassifier, XGBRegressor
import numpy as np

class ModelTuner:
    def __init__(self, problem_type):
        self.problem_type = problem_type

    def tune_random_forest(self, X, y):
        def objective(trial):
            n_estimators = trial.suggest_int('n_estimators', 10, 200)
            max_depth = trial.suggest_int('max_depth', 2, 32, log=True)
            min_samples_split = trial.suggest_int('min_samples_split', 2, 10)
            
            if self.problem_type == "classification":
                model = RandomForestClassifier(
                    n_estimators=n_estimators,
                    max_depth=max_depth,
                    min_samples_split=min_samples_split
                )
                score = cross_val_score(model, X, y, n_jobs=-1, cv=3, scoring='accuracy').mean()
            else:
                model = RandomForestRegressor(
                    n_estimators=n_estimators,
                    max_depth=max_depth,
                    min_samples_split=min_samples_split
                )
                score = cross_val_score(model, X, y, n_jobs=-1, cv=3, scoring='r2').mean()
            return score

        study = optuna.create_study(direction='maximize')
        study.optimize(objective, n_trials=10)
        return study.best_params

    def tune_xgboost(self, X, y):
        def objective(trial):
            param = {
                'n_estimators': trial.suggest_int('n_estimators', 50, 300),
                'max_depth': trial.suggest_int('max_depth', 3, 10),
                'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
                'subsample': trial.suggest_float('subsample', 0.5, 1.0),
            }
            
            if self.problem_type == "classification":
                model = XGBClassifier(**param, use_label_encoder=False, eval_metric='logloss')
                score = cross_val_score(model, X, y, n_jobs=-1, cv=3, scoring='accuracy').mean()
            else:
                model = XGBRegressor(**param)
                score = cross_val_score(model, X, y, n_jobs=-1, cv=3, scoring='r2').mean()
            return score

        study = optuna.create_study(direction='maximize')
        study.optimize(objective, n_trials=10)
        return study.best_params

    def tune_model(self, model_name, X, y):
        """
        Generic entry point for tuning.
        """
        if "Random Forest" in model_name:
            return self.tune_random_forest(X, y)
        elif "XGBoost" in model_name:
            return self.tune_xgboost(X, y)
        else:
            # For other models, we might just return default or implement more
            return {}
