import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler, MinMaxScaler
from sklearn.impute import SimpleImputer
import os

class DataPreprocessor:
    def __init__(self):
        self.label_encoders = {}
        self.scaler = None
        self.target_column = None
        self.problem_type = None

    def validate_dataset(self, df):
        """
        Validate dataset based on PRD rules.
        """
        if df.shape[1] < 2:
            raise ValueError("Dataset must contain at least 2 columns")
        if df.shape[0] < 10:
            raise ValueError("Dataset must contain at least 10 rows")
        return True

    def detect_problem_type(self, df, target_column):
        """
        Rules: 
        If unique values <= 20 -> classification
        Else -> regression
        """
        self.target_column = target_column
        unique_values = df[target_column].nunique()
        
        if df[target_column].dtype == 'object' or unique_values <= 20:
            self.problem_type = "classification"
        else:
            self.problem_type = "regression"
        
        return self.problem_type

    def handle_missing_values(self, df):
        """
        Numerical -> mean
        Categorical -> mode
        """
        df = df.copy()
        
        # Identify columns
        num_cols = df.select_dtypes(include=[np.number]).columns
        cat_cols = df.select_dtypes(exclude=[np.number]).columns

        # Handle numerical
        if len(num_cols) > 0:
            num_imputer = SimpleImputer(strategy='mean')
            df[num_cols] = num_imputer.fit_transform(df[num_cols])

        # Handle categorical
        if len(cat_cols) > 0:
            cat_imputer = SimpleImputer(strategy='most_frequent')
            df[cat_cols] = cat_imputer.fit_transform(df[cat_cols])
            
        return df

    def preprocess(self, df, target_column, is_train=True):
        """
        Comprehensive preprocessing pipeline.
        """
        df = df.copy()
        
        # 1. Handle Missing Values
        df = self.handle_missing_values(df)
        
        # 2. Drop duplicates
        df = df.drop_duplicates()
        
        # 3. Detect column types
        X = df.drop(columns=[target_column])
        y = df[target_column]
        
        # 4. Target Encoding if classification
        if self.problem_type == "classification" and y.dtype == 'object':
            if is_train:
                le = LabelEncoder()
                y = le.fit_transform(y)
                self.label_encoders[target_column] = le
            else:
                y = self.label_encoders[target_column].transform(y)

        # 5. Features Encoding
        cat_features = X.select_dtypes(include=['object']).columns
        for col in cat_features:
            if is_train:
                le = LabelEncoder()
                X[col] = le.fit_transform(X[col].astype(str))
                self.label_encoders[col] = le
            else:
                # Handle unseen labels by mapping to a default or most frequent
                # For simplicity in this AutoML, we'll use transform
                X[col] = self.label_encoders[col].transform(X[col].astype(str))

        # 6. Scaling
        # Only scale if requested or for specific models. Here we scale everything for consistency.
        if is_train:
            self.scaler = StandardScaler()
            X_scaled = self.scaler.fit_transform(X)
        else:
            X_scaled = self.scaler.transform(X)
            
        X = pd.DataFrame(X_scaled, columns=X.columns)
        
        return X, y
