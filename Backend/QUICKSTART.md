# 🚀 Quick Start Guide - UPI Fraud Detection Backend

## ⚡ Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Generate ML Model
```bash
python create_ml_model.py
```

### Step 3: Start the Server
```bash
python main.py
```

The API will be running at **http://localhost:8000**

### Step 4: Test the API
Open another terminal and run:
```bash
python test_api.py
```

Or visit the interactive documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 📋 What You Get

### ✅ Complete Backend Features
1. **User Authentication** (JWT)
2. **Transaction Management**
3. **Real-time Fraud Detection**
4. **ML-based Risk Scoring**
5. **Community Fraud Reports**
6. **Spending Analytics**
7. **Category & Monthly Charts**

### 🎯 Key Endpoints

#### Authentication
- `POST /auth/register` - Create account
- `POST /auth/login` - Get JWT token
- `GET /auth/me` - User profile

#### Fraud Detection
- `POST /transactions/check-fraud` - Check risk BEFORE payment
- `POST /transactions/create` - Process transaction
- `GET /transactions/flagged/all` - View risky transactions

#### Analytics
- `GET /analytics/spending` - Full spending breakdown
- `GET /analytics/charts/category` - Pie chart data
- `GET /analytics/charts/monthly` - Bar chart data

---

## 🧪 Quick Test Example

### 1. Register User
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "pass123",
    "upi_id": "john@paytm",
    "phone": "+919876543210"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "pass123"
  }'
```

Copy the `access_token` from response.

### 3. Check Fraud Risk
```bash
curl -X POST http://localhost:8000/transactions/check-fraud \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "receiver_upi": "merchant@paytm",
    "receiver_name": "Store",
    "amount": 6000,
    "category": "Shopping"
  }'
```

---

## 🔐 Default Configuration

- **Database**: SQLite (`upi_fraud.db`)
- **Token Expiry**: 30 minutes
- **Fraud Threshold**: Risk Score ≥ 70
- **ML Model**: Logistic Regression

---

## 📚 What's Included

```
upi_fraud_backend/
├── main.py                    # FastAPI app
├── models.py                  # Database models
├── schemas.py                 # Validation schemas
├── database.py                # DB configuration
├── auth.py                    # JWT & auth
├── fraud_detection.py         # ML fraud detection
├── analytics.py               # Spending analytics
├── routes_*.py                # API routes
├── create_ml_model.py         # ML model generator
├── test_api.py                # Test suite
├── requirements.txt           # Dependencies
├── .env                       # Configuration
├── README.md                  # Full documentation
└── QUICKSTART.md              # This file
```

---

## 🎓 Next Steps

1. ✅ Run `test_api.py` to verify everything works
2. 📖 Read `README.md` for detailed documentation
3. 🔧 Customize `.env` for your needs
4. 🚀 Build your React frontend
5. 🌐 Deploy to production

---

## 💡 Pro Tips

- Use **Swagger UI** at `/docs` for interactive testing
- The ML model is lightweight (Logistic Regression) - perfect for hackathons
- All fraud reasons are explainable - builds user trust
- Community reports make detection smarter over time

---

## 🆘 Need Help?

- Server not starting? Check if port 8000 is free
- Login fails? Make sure you registered first
- Fraud detection not working? Verify `fraud_model.pkl` exists

---

**Built for Hackathons | Production-Ready | Fully Documented**

Happy Coding! 🚀
