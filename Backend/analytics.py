from sqlalchemy.orm import Session
from sqlalchemy import func, extract, desc
from models import Transaction
from schemas import CategorySpending, MonthlySpending, SpendingAnalytics
from typing import List
from datetime import datetime

class AnalyticsService:
    
    @staticmethod
    def get_spending_analytics(db: Session, user_id: int) -> SpendingAnalytics:
        """Get comprehensive spending analytics for a user"""
        
        # Total spent and transaction count
        total_result = db.query(
            func.sum(Transaction.amount).label('total'),
            func.count(Transaction.id).label('count')
        ).filter(Transaction.user_id == user_id).first()
        
        total_spent = float(total_result.total) if total_result.total else 0.0
        total_transactions = total_result.count or 0
        
        # Category breakdown
        category_data = db.query(
            Transaction.category,
            func.sum(Transaction.amount).label('total'),
            func.count(Transaction.id).label('count')
        ).filter(
            Transaction.user_id == user_id,
            Transaction.category.isnot(None)
        ).group_by(Transaction.category).all()
        
        category_breakdown = [
            CategorySpending(
                category=cat or "Others",
                total=float(total),
                count=count
            )
            for cat, total, count in category_data
        ]
        
        # If no categories, add default
        if not category_breakdown:
            category_breakdown = [
                CategorySpending(category="Others", total=0.0, count=0)
            ]
        
        # Monthly breakdown (last 12 months)
        monthly_data = db.query(
            extract('year', Transaction.timestamp).label('year'),
            extract('month', Transaction.timestamp).label('month'),
            func.sum(Transaction.amount).label('total'),
            func.count(Transaction.id).label('count')
        ).filter(
            Transaction.user_id == user_id
        ).group_by('year', 'month').order_by(desc('year'), desc('month')).limit(12).all()
        
        monthly_breakdown = []
        for year, month, total, count in monthly_data:
            month_name = datetime(int(year), int(month), 1).strftime('%B %Y')
            monthly_breakdown.append(
                MonthlySpending(
                    month=month_name,
                    total=float(total),
                    count=count
                )
            )
        
        # Reverse to show chronological order (Oldest -> Newest) for the last 12 months
        monthly_breakdown.reverse()
        
        # Calculate average transaction amount
        avg_amount = total_spent / total_transactions if total_transactions > 0 else 0.0
        
        return SpendingAnalytics(
            total_spent=total_spent,
            total_transactions=total_transactions,
            category_breakdown=category_breakdown,
            monthly_breakdown=monthly_breakdown,
            avg_transaction_amount=round(avg_amount, 2)
        )
    
    @staticmethod
    def get_category_chart_data(db: Session, user_id: int) -> dict:
        """Get data formatted for pie chart visualization"""
        category_data = db.query(
            Transaction.category,
            func.sum(Transaction.amount).label('total')
        ).filter(
            Transaction.user_id == user_id,
            Transaction.category.isnot(None)
        ).group_by(Transaction.category).all()
        
        labels = [cat or "Others" for cat, _ in category_data]
        values = [float(total) for _, total in category_data]
        
        return {
            "labels": labels,
            "values": values
        }
    
    @staticmethod
    def get_monthly_chart_data(db: Session, user_id: int, months: int = 6) -> dict:
        """Get data formatted for bar chart visualization"""
        monthly_data = db.query(
            extract('year', Transaction.timestamp).label('year'),
            extract('month', Transaction.timestamp).label('month'),
            func.sum(Transaction.amount).label('total')
        ).filter(
            Transaction.user_id == user_id
        ).group_by('year', 'month').order_by(desc('year'), desc('month')).limit(months).all()
        
        labels = []
        values = []
        
        # Iterate in reverse to populate chart from left (older) to right (newer)
        for year, month, total in reversed(monthly_data):
            month_name = datetime(int(year), int(month), 1).strftime('%b %Y')
            labels.append(month_name)
            values.append(float(total))
        
        return {
            "labels": labels,
            "values": values
        }


analytics_service = AnalyticsService()
