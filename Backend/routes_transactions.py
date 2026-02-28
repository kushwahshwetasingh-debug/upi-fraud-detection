from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import json

from database import get_db
from models import User, Transaction
from schemas import (
    TransactionCreate,
    TransactionResponse,
    FraudCheckResponse
)
from auth import get_current_user
from fraud_detection import fraud_detector

# Router tags for documentation grouping
router = APIRouter(tags=["Transactions"])

@router.post("/predict", response_model=FraudCheckResponse)
async def check_fraud(
    transaction_data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Check fraud risk for a transaction BEFORE processing it.
    The risk_score and risk_level will change based on the amount and time.
    """
    
    # 1. Capture real-time context
    if transaction_data.is_night is not None:
        is_night_actual = 1 if transaction_data.is_night else 0
    else:
        current_hour = datetime.now().hour
        is_night_actual = fraud_detector.determine_is_night(current_hour)
    
    # 2. Check historical context for the user
    is_new_receiver = fraud_detector.check_is_new_receiver(
        db, current_user.id, transaction_data.receiver_upi
    )
    user_avg_amount = fraud_detector.get_user_avg_amount(db, current_user.id)
    
    # 3. Calculate dynamic risk score using the ML model
    # Passing the transaction_data.amount ensures the score shifts with user input.
    risk_score, reasons = fraud_detector.calculate_risk_score(
        amount=transaction_data.amount,
        is_night=is_night_actual,
        receiver_upi=transaction_data.receiver_upi,
        is_new_receiver=is_new_receiver,
        user_avg_amount=user_avg_amount,
        db=db
    )
    
    # 4. --- ASSIGN RISK LEVEL (Strictly follows the 4 cases in FRONTEND.docx) ---
    # Case 4: Pattern (Dark Red) - Large Amount + Night Transaction
    if risk_score >= 85 and is_night_actual == 1:
        risk_level = "PATTERN"
    # Case 3: High Risk (Red) - Very high risk score
    elif risk_score >= 70:
        risk_level = "HIGH"
    # Case 2: Medium Risk (Orange) - Suspicious pattern detected
    elif risk_score >= 35:
        risk_level = "MEDIUM"
    # Case 1: Safe (Green) - Low risk transaction
    else:
        risk_level = "SAFE"
    
    # 5. Determine flagging status and generate warning
    is_flagged = risk_score >= 70
    warning_message = None
    
    if is_flagged:
        warning_message = f"⚠️ Risk Score: {risk_score}/100. "
        if reasons:
            warning_message += f"Reasons: {', '.join(reasons)}"
    else:
        warning_message = f"Transaction Approved. Status: {risk_level}"
    
    # 6. Return response to Frontend
    return FraudCheckResponse(
        risk_score=risk_score,
        is_flagged=is_flagged,
        risk_level=risk_level, 
        reasons=reasons,
        warning_message=warning_message
    )


@router.post("/create", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    transaction_data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new transaction with fraud detection and save to database.
    """
    
    # Prevent self-transactions
    if transaction_data.receiver_upi == current_user.upi_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send money to yourself"
        )
    
    # Capture transaction time and context
    now = datetime.now()
    current_hour = now.hour
    is_night = fraud_detector.determine_is_night(current_hour)
    
    is_new_receiver = fraud_detector.check_is_new_receiver(
        db, current_user.id, transaction_data.receiver_upi
    )
    user_avg_amount = fraud_detector.get_user_avg_amount(db, current_user.id)
    
    # Calculate risk score for database entry
    risk_score, reasons = fraud_detector.calculate_risk_score(
        amount=transaction_data.amount,
        is_night=is_night,
        receiver_upi=transaction_data.receiver_upi,
        is_new_receiver=is_new_receiver,
        user_avg_amount=user_avg_amount,
        db=db
    )
    
    # Save transaction record
    new_transaction = Transaction(
        user_id=current_user.id,
        receiver_upi=transaction_data.receiver_upi,
        receiver_name=transaction_data.receiver_name,
        amount=transaction_data.amount,
        category=transaction_data.category or "Others",
        description=transaction_data.description,
        timestamp=now,
        hour=current_hour,
        is_night=is_night,
        is_new_receiver=is_new_receiver,
        risk_score=risk_score,
        is_flagged=(risk_score >= 70),
        fraud_reasons=json.dumps(reasons) if reasons else None,
        status="completed"
    )
    
    try:
        db.add(new_transaction)
        db.commit()
        db.refresh(new_transaction)
        return new_transaction
    except Exception as e:
        db.rollback()  # Rollback on error to keep DB session clean
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error during creation: {str(e)}"
        )


@router.get("/", response_model=List[TransactionResponse])
async def get_transactions(
    limit: int = 50,
    skip: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get recent transaction history for the logged-in user.
    """
    return db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).order_by(Transaction.timestamp.desc()).offset(skip).limit(limit).all()


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get details for a specific transaction by ID.
    """
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    return transaction


@router.get("/flagged/all", response_model=List[TransactionResponse])
async def get_flagged_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all risky/flagged transactions for the user.
    """
    return db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.is_flagged == True
    ).order_by(Transaction.timestamp.desc()).all()