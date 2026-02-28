from sqlalchemy import Boolean, Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    upi_id = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    transactions = relationship("Transaction", back_populates="user", foreign_keys="Transaction.user_id")
    fraud_reports = relationship("FraudReport", back_populates="reporter")


class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_upi = Column(String, index=True, nullable=False)
    receiver_name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=True)  # Food, Education, Shopping, Others
    description = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    hour = Column(Integer, nullable=False)  # Hour of transaction (0-23)
    is_night = Column(Integer, nullable=False)  # 1 if night (22-6), 0 otherwise
    is_new_receiver = Column(Integer, default=0)  # 1 if first time, 0 otherwise
    
    # Fraud detection fields
    risk_score = Column(Integer, nullable=False)  # 0-100
    is_flagged = Column(Boolean, default=False)
    fraud_reasons = Column(String, nullable=True)  # JSON string of reasons
    
    # Status
    status = Column(String, default="completed")  # completed, cancelled, pending
    
    # Relationships
    user = relationship("User", back_populates="transactions", foreign_keys=[user_id])


class FraudReport(Base):
    __tablename__ = "fraud_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reported_upi = Column(String, index=True, nullable=False)
    reason = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    reporter = relationship("User", back_populates="fraud_reports")
