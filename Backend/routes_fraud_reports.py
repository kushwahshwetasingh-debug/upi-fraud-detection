from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import User, FraudReport
from schemas import FraudReportCreate, FraudReportResponse
from auth import get_current_user

router = APIRouter(prefix="/fraud-reports", tags=["Fraud Reports"])


@router.post("/", response_model=FraudReportResponse, status_code=status.HTTP_201_CREATED)
async def report_fraud(
    report_data: FraudReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Report a suspicious UPI ID
    Community-driven fraud detection
    """
    
    # Prevent self-reporting
    if report_data.reported_upi == current_user.upi_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot report your own UPI ID"
        )
    
    # Check if user already reported this UPI ID
    existing_report = db.query(FraudReport).filter(
        FraudReport.reporter_id == current_user.id,
        FraudReport.reported_upi == report_data.reported_upi
    ).first()
    
    if existing_report:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reported this UPI ID"
        )
    
    # Create new fraud report
    new_report = FraudReport(
        reporter_id=current_user.id,
        reported_upi=report_data.reported_upi,
        reason=report_data.reason
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return new_report


@router.get("/", response_model=List[FraudReportResponse])
async def get_my_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all fraud reports submitted by the current user
    """
    reports = db.query(FraudReport).filter(
        FraudReport.reporter_id == current_user.id
    ).order_by(FraudReport.created_at.desc()).all()
    
    return reports


@router.get("/upi/{upi_id}", response_model=dict)
async def get_upi_report_count(
    upi_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the number of reports for a specific UPI ID
    """
    count = db.query(FraudReport).filter(
        FraudReport.reported_upi == upi_id
    ).count()
    
    risk_level = "Low"
    if count >= 5:
        risk_level = "High"
    elif count >= 2:
        risk_level = "Medium"
    
    return {
        "upi_id": upi_id,
        "report_count": count,
        "risk_level": risk_level
    }


@router.get("/top-reported/", response_model=List[dict])
async def get_top_reported_upis(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get most reported UPI IDs (for awareness)
    """
    from sqlalchemy import func
    
    results = db.query(
        FraudReport.reported_upi,
        func.count(FraudReport.id).label('report_count')
    ).group_by(
        FraudReport.reported_upi
    ).order_by(
        func.count(FraudReport.id).desc()
    ).limit(limit).all()
    
    return [
        {
            "upi_id": upi,
            "report_count": count,
            "risk_level": "High" if count >= 5 else "Medium" if count >= 2 else "Low"
        }
        for upi, count in results
    ]
