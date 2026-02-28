from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from database import init_db
from routes_auth import router as auth_router
from routes_transactions import router as transactions_router
from routes_fraud_reports import router as fraud_reports_router
from routes_analytics import router as analytics_router

app = FastAPI(
    title="UPI Fraud Detection API",
    description="Real-time fraud detection and financial awareness system",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()
    print("✓ Database initialized")

# --- ROUTE INCLUSION ---
# We use /api as the base for all routers to keep frontend calls consistent.

# Auth remains /api/auth/...
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])

# Transactions now maps directly to /api/... 
# This allows /api/predict to work
app.include_router(transactions_router, prefix="/api", tags=["Transactions"])

# Fraud Reports and Analytics prefixes
app.include_router(fraud_reports_router, prefix="/api/fraud-reports", tags=["Fraud Reports"])
app.include_router(analytics_router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"message": "API Active", "docs": "/docs"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    # Running on port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)