from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import SpendingAnalytics
from auth import get_current_user
from analytics import analytics_service

# Removed the internal prefix to prevent double-routing issues
router = APIRouter(tags=["Analytics"])

@router.get("/spending", response_model=SpendingAnalytics)
async def get_spending_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get comprehensive spending analytics including total spent and breakdowns.
    """
    return analytics_service.get_spending_analytics(db, current_user.id)


@router.get("/charts/category", response_model=dict)
async def get_category_chart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get data formatted for the pie chart (category-wise spending).
    """
    return analytics_service.get_category_chart_data(db, current_user.id)


@router.get("/charts/monthly", response_model=dict)
async def get_monthly_chart(
    months: int = 6,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get data formatted for the bar chart (monthly spending).
    """
    return analytics_service.get_monthly_chart_data(db, current_user.id, months)