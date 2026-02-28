import joblib
import os
from typing import List, Tuple
from datetime import datetime
from sqlalchemy.orm import Session
from models import Transaction, FraudReport
import numpy as np

class FraudDetectionService:
    def __init__(self, model_path: str = "fraud_model.pkl"):
        self.model_path = model_path
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load the ML model if it exists"""
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                print(f"✓ ML model loaded from {self.model_path}")
            except Exception as e:
                print(f"⚠ Warning: Could not load ML model: {e}")
                self.model = None
        else:
            print(f"⚠ Warning: ML model not found at {self.model_path}")
            self.model = None
    
    def calculate_risk_score(
        self,
        amount: float,
        is_night: int,
        receiver_upi: str,
        is_new_receiver: int,
        user_avg_amount: float,
        db: Session
    ) -> Tuple[int, List[str]]:
        """
        Calculate fraud risk score and return reasons
        
        Returns:
            Tuple of (risk_score: int, reasons: List[str])
        """
        reasons = []
        
        # Get ML probability if model is available
        if self.model is not None:
            try:
                # Input features: [amount, is_night]
                features = np.array([[amount, is_night]])
                prob = self.model.predict_proba(features)[0][1]
                ml_score = int(prob * 100)
            except Exception as e:
                print(f"⚠ ML prediction error: {e}")
                ml_score = 0
        else:
            ml_score = 0
        
        # Rule-based scoring (to complement ML or work standalone)
        rule_score = 0
        
        # Rule 1: Dynamic Amount Scoring (Gradual increase)
        # 1 point per 100 rupees, capped at 75 points
        amount_points = min(int(amount / 100), 75)
        rule_score += amount_points
        
        if amount_points >= 50:
            reasons.append("High transaction amount")
        
        # Rule 2: Late-night transaction
        if is_night == 1:
            rule_score += 20
            reasons.append("Late-night transaction")
        
        # Rule 3: Check if receiver is reported
        report_count = db.query(FraudReport).filter(
            FraudReport.reported_upi == receiver_upi
        ).count()
        
        if report_count >= 5:
            rule_score += 35
            reasons.append("Reported UPI ID")
        elif report_count >= 1:
            rule_score += 15
            reasons.append(f"UPI ID has {report_count} report(s)")
        
        # Rule 4: New receiver
        if is_new_receiver == 1:
            rule_score += 15
            reasons.append("New receiver")
        
        # Rule 5: Amount deviation from user's average
        if user_avg_amount > 0:
            deviation_ratio = amount / user_avg_amount
            if deviation_ratio > 3:
                rule_score += 20
                reasons.append("Unusual amount compared to your average spending")
        
        # Combine ML and rule-based scores
        # Use max to ensure rules are respected and not diluted by low ML scores
        if self.model is not None:
            final_score = max(ml_score, rule_score)
        else:
            final_score = rule_score
        
        # Cap at 100
        final_score = min(final_score, 100)
        
        return final_score, reasons
    
    def check_is_new_receiver(self, db: Session, user_id: int, receiver_upi: str) -> int:
        """Check if this is a new receiver for the user"""
        existing = db.query(Transaction).filter(
            Transaction.user_id == user_id,
            Transaction.receiver_upi == receiver_upi
        ).first()
        
        return 0 if existing else 1
    
    def get_user_avg_amount(self, db: Session, user_id: int) -> float:
        """Get user's average transaction amount"""
        from sqlalchemy import func
        
        avg = db.query(func.avg(Transaction.amount)).filter(
            Transaction.user_id == user_id
        ).scalar()
        
        return float(avg) if avg else 0.0
    
    def determine_is_night(self, hour: int) -> int:
        """Determine if transaction is at night (22:00 - 06:00)"""
        return 1 if (hour >= 22 or hour <= 6) else 0


# Global instance
fraud_detector = FraudDetectionService()
