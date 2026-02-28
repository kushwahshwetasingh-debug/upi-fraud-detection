"""
Script to create a sample fraud detection ML model
This creates fraud_model.pkl for demonstration purposes
"""
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import joblib

def create_sample_fraud_model():
    """
    Create a sample fraud detection model using Logistic Regression
    Features: amount, is_night
    """
    
    # Generate synthetic training data
    np.random.seed(42)
    
    # Generate 1000 samples
    n_samples = 1000
    
    # Feature 1: Transaction amount (0 to 10000)
    amounts = np.random.uniform(100, 10000, n_samples)
    
    # Feature 2: Is night transaction (0 or 1)
    is_night = np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
    
    # Create features matrix
    X = np.column_stack([amounts, is_night])
    
    # Generate labels (fraud or not)
    # Rule: Higher chance of fraud if amount > 5000 OR is_night == 1
    y = np.zeros(n_samples)
    for i in range(n_samples):
        fraud_prob = 0.1  # Base probability
        
        if amounts[i] > 5000:
            fraud_prob += 0.4
        
        if is_night[i] == 1:
            fraud_prob += 0.3
        
        y[i] = 1 if np.random.random() < fraud_prob else 0
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train Logistic Regression model
    model = LogisticRegression(random_state=42, max_iter=1000)
    model.fit(X_train, y_train)
    
    # Evaluate
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    print(f"Model trained successfully!")
    print(f"Training accuracy: {train_score:.2%}")
    print(f"Testing accuracy: {test_score:.2%}")
    
    # Save model
    joblib.dump(model, 'fraud_model.pkl')
    print(f"✓ Model saved to fraud_model.pkl")
    
    # Test prediction
    test_features = np.array([[6000, 1]])  # High amount, night time
    prob = model.predict_proba(test_features)[0][1]
    print(f"\nTest prediction for [amount=6000, is_night=1]:")
    print(f"Fraud probability: {prob:.2%}")
    print(f"Risk score: {int(prob * 100)}/100")

if __name__ == "__main__":
    create_sample_fraud_model()
