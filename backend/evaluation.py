import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, confusion_matrix,
    mean_absolute_error, mean_squared_error, r2_score
)
import os

class Evaluator:
    def __init__(self, report_dir="reports"):
        self.report_dir = report_dir
        if not os.path.exists(self.report_dir):
            os.makedirs(self.report_dir)

    def generate_eda(self, df, target_column):
        """
        Generate and save EDA plots.
        """
        plots = {}
        
        # 1. Correlation Heatmap
        plt.figure(figsize=(10, 8))
        numeric_df = df.select_dtypes(include=[np.number])
        if not numeric_df.empty:
            sns.heatmap(numeric_df.corr(), annot=True, cmap='coolwarm', fmt=".2f")
            plt.title("Correlation Heatmap")
            heatmap_path = os.path.join(self.report_dir, "correlation_heatmap.png")
            plt.savefig(heatmap_path)
            plt.close()
            plots['heatmap'] = heatmap_path

        # 2. Target Distribution
        plt.figure(figsize=(8, 6))
        if df[target_column].dtype == 'object' or df[target_column].nunique() <= 20:
            sns.countplot(x=target_column, data=df)
        else:
            sns.histplot(df[target_column], kde=True)
        plt.title(f"Distribution of {target_column}")
        target_dist_path = os.path.join(self.report_dir, "target_distribution.png")
        plt.savefig(target_dist_path)
        plt.close()
        plots['target_dist'] = target_dist_path

        # 3. Missing Values Plot
        plt.figure(figsize=(10, 6))
        sns.barplot(x=df.columns, y=df.isnull().sum())
        plt.xticks(rotation=45)
        plt.title("Missing Values per Column")
        missing_path = os.path.join(self.report_dir, "missing_values.png")
        plt.savefig(missing_path)
        plt.close()
        plots['missing'] = missing_path

        return plots

    def get_metrics(self, y_true, y_pred, problem_type):
        """
        Calculate metrics based on problem type.
        """
        if problem_type == "classification":
            return {
                "accuracy": accuracy_score(y_true, y_pred),
                "precision": precision_score(y_true, y_pred, average='weighted'),
                "recall": recall_score(y_true, y_pred, average='weighted'),
                "f1_score": f1_score(y_true, y_pred, average='weighted'),
                "confusion_matrix": confusion_matrix(y_true, y_pred).tolist()
            }
        else:
            mse = mean_squared_error(y_true, y_pred)
            return {
                "mae": mean_absolute_error(y_true, y_pred),
                "mse": mse,
                "rmse": np.sqrt(mse),
                "r2_score": r2_score(y_true, y_pred)
            }

    def plot_feature_importance(self, model, feature_names, model_name):
        """
        Save feature importance plot if available.
        """
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            indices = np.argsort(importances)[::-1]
            
            plt.figure(figsize=(10, 6))
            plt.title(f"Feature Importances - {model_name}")
            plt.bar(range(len(importances)), importances[indices], align="center")
            plt.xticks(range(len(importances)), [feature_names[i] for i in indices], rotation=45)
            plt.tight_layout()
            
            importance_path = os.path.join(self.report_dir, f"importance_{model_name.replace(' ', '_')}.png")
            plt.savefig(importance_path)
            plt.close()
            return importance_path
        return None
