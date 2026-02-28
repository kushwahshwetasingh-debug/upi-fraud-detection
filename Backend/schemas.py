from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# --- User Schemas ---
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    upi_id: str = Field(..., pattern=r'^[a-zA-Z0-9._-]+@[a-zA-Z]+$')
    phone: str = Field(..., pattern=r'^\+?[0-9]{10,15}$')

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str 
    upi_id: str
    phone: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None


# --- Transaction Schemas ---
class TransactionCreate(BaseModel):
    receiver_upi: str = Field(..., pattern=r'^[a-zA-Z0-9._-]+@[a-zA-Z]+$')
    receiver_name: str = Field(..., min_length=1, max_length=100)
    amount: float = Field(..., gt=0)
    # Allows 'Simulation' category to prevent 422 errors during testing
    category: Optional[str] = Field(None, pattern=r'^(Food|Education|Shopping|Others|Simulation|Transfer)$')
    description: Optional[str] = Field(None, max_length=500)
    is_night: Optional[bool] = None

class TransactionResponse(BaseModel):
    id: int
    user_id: int
    receiver_upi: str
    receiver_name: str
    amount: float
    category: Optional[str]
    description: Optional[str]
    timestamp: datetime
    hour: int
    is_night: bool 
    is_new_receiver: bool
    risk_score: int
    is_flagged: bool
    fraud_reasons: Optional[str]
    status: str
    
    class Config:
        from_attributes = True

class FraudCheckResponse(BaseModel):
    risk_score: int
    is_flagged: bool
    # ADDED: risk_level string to tell frontend exactly which of the 4 cases to show
    # Expected values: "SAFE", "MEDIUM", "HIGH", "PATTERN" [cite: 23, 26, 69]
    risk_level: str 
    reasons: List[str]
    warning_message: Optional[str]


# --- Fraud Report Schemas ---
class FraudReportCreate(BaseModel):
    reported_upi: str = Field(..., pattern=r'^[a-zA-Z0-9._-]+@[a-zA-Z]+$')
    reason: str = Field(..., min_length=10, max_length=500)

class FraudReportResponse(BaseModel):
    id: int
    reporter_id: int
    reported_upi: str
    reason: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# --- Analytics Schemas ---
class CategorySpending(BaseModel):
    category: str
    total: float
    count: int

class MonthlySpending(BaseModel):
    month: str
    total: float
    count: int

class SpendingAnalytics(BaseModel):
    total_spent: float
    total_transactions: int
    category_breakdown: List[CategorySpending]
    monthly_breakdown: List[MonthlySpending]
    avg_transaction_amount: float