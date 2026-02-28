# UPI Fraud Detection & User Protection Layer

A machine learning based system that predicts fraud risk before a UPI transaction is completed.  
Built as a hackathon prototype focused on fast fraud detection, explainability, and user safety.

---

## Problem
UPI fraud is increasing due to:
- Unknown receivers
- Fake refund scams
- High value suspicious transfers
- Reported fraudulent UPI IDs

Current systems often detect fraud **after the transaction**.  
This project predicts risk **before payment happens**.

---

## Solution
We built a real-time fraud risk scoring system that:
1. Analyzes transaction behavior
2. Calculates fraud probability
3. Converts it into a risk score (0–100)
4. Warns the user before payment

---

## Key Features
- Fraud risk score (0–100)
- Real-time prediction
- Explainable ML model
- Community fraud reporting
- Smart fraud alerts
- Transaction analytics dashboard

---

## Tech Stack
**Backend:** FastAPI (Python)  
**Frontend:** React + Tailwind  
**Database:** SQLite  
**Machine Learning:** Scikit-learn  
**Data Processing:** Pandas, NumPy  
 
---

## Machine Learning Model
We used a **Logistic Regression** model trained on simulated UPI transaction data.

**Features used:**
- Transaction amount
- New receiver detection
- Amount deviation from user average
- Night-time transaction detection
- Community fraud reports
- Transaction frequency

**Output**
- Risk Score: 0 – 100
- Fraud Probability
- Fraud Explanation

Example response:
```json
{
  "risk_score": 82,
  "is_flagged": true,
  "reasons": [
    "High transaction amount",
    "New receiver",
    "Reported UPI ID"
  ]
}
```

---

## Project Architecture
User → Frontend (React)  
↓  
Backend API (FastAPI)  
↓  
Fraud Detection Model  
↓  
Database (SQLite)

---

## How to Run Backend
Install dependencies
pip install -r requirements.txt
Run server
uvicorn main:app --reload

## How to Run Frontend
Install packages
npm install

Run frontend
npm run dev


---

## ML Contribution
Developed and trained the fraud detection machine learning model using simulated transaction data and implemented real-time risk scoring.

---

## Future Improvements
- Real UPI transaction dataset
- Graph-based fraud detection
- Behavioral user profiling
- Deep learning model for anomaly detection
