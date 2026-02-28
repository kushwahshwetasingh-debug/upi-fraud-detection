# UPI Fraud Detection Backend

Real-time fraud detection and financial awareness system for UPI transactions built with FastAPI.

## 🎯 Features

- **Real-Time Fraud Detection**: Analyzes transactions before completion
- **ML-Based Risk Scoring**: Uses Logistic Regression for fraud prediction
- **Explainable Alerts**: Provides clear reasons for fraud flags
- **Spending Analytics**: Category and monthly spending breakdowns
- **Community Reports**: Users can report suspicious UPI IDs
- **JWT Authentication**: Secure user authentication and authorization
- **RESTful API**: Well-documented endpoints for frontend integration

## 🛠️ Tech Stack

- **Framework**: FastAPI (Python)
- **Database**: SQLite (easily upgradable to PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **ML**: Scikit-learn (Logistic Regression)
- **Data Processing**: NumPy, Pandas
- **ORM**: SQLAlchemy

## 📁 Project Structure

```
upi_fraud_backend/
├── main.py                      # FastAPI application entry point
├── models.py                    # Database models (User, Transaction, FraudReport)
├── schemas.py                   # Pydantic schemas for validation
├── database.py                  # Database configuration
├── auth.py                      # Authentication utilities (JWT, password hashing)
├── fraud_detection.py           # ML fraud detection service
├── analytics.py                 # Analytics service for spending insights
├── routes_auth.py               # Authentication routes
├── routes_transactions.py       # Transaction routes
├── routes_fraud_reports.py      # Fraud report routes
├── routes_analytics.py          # Analytics routes
├── create_ml_model.py           # Script to generate ML model
├── requirements.txt             # Python dependencies
├── .env                         # Environment configuration
└── README.md                    # This file
```

## 🚀 Setup Instructions

### 1. Clone or Create Project Directory

```bash
mkdir upi_fraud_backend
cd upi_fraud_backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Edit the `.env` file and update the SECRET_KEY:

```env
SECRET_KEY=your-very-secure-secret-key-minimum-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./upi_fraud.db
MODEL_PATH=fraud_model.pkl
DEBUG=True
```

**Important**: Generate a secure secret key for production:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 5. Create ML Model

```bash
python create_ml_model.py
```

This will generate `fraud_model.pkl` with a trained Logistic Regression model.

### 6. Run the Application

```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and get JWT token |
| GET | `/auth/me` | Get current user info |

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/transactions/check-fraud` | Check fraud risk before payment |
| POST | `/transactions/create` | Create a new transaction |
| GET | `/transactions/` | Get all transactions |
| GET | `/transactions/{id}` | Get specific transaction |
| GET | `/transactions/flagged/all` | Get all flagged transactions |

### Fraud Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/fraud-reports/` | Report suspicious UPI ID |
| GET | `/fraud-reports/` | Get my reports |
| GET | `/fraud-reports/upi/{upi_id}` | Get report count for UPI |
| GET | `/fraud-reports/top-reported/` | Get most reported UPIs |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/spending` | Get spending analytics |
| GET | `/analytics/charts/category` | Get category chart data |
| GET | `/analytics/charts/monthly` | Get monthly chart data |

## 🔐 Authentication Flow

1. **Register**: POST to `/auth/register` with user details
2. **Login**: POST to `/auth/login` to get JWT token
3. **Use Token**: Include in headers: `Authorization: Bearer <token>`

### Example Registration

```json
POST /auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password123",
  "upi_id": "john@paytm",
  "phone": "+919876543210"
}
```

### Example Login

```json
POST /auth/login
{
  "username": "john_doe",
  "password": "secure_password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

## 💳 Transaction Flow

### 1. Check Fraud Risk (Before Payment)

```json
POST /transactions/check-fraud
Headers: Authorization: Bearer <token>
{
  "receiver_upi": "merchant@paytm",
  "receiver_name": "ABC Store",
  "amount": 6000,
  "category": "Shopping",
  "description": "Electronics purchase"
}

Response:
{
  "risk_score": 75,
  "is_flagged": true,
  "reasons": [
    "High transaction amount",
    "New receiver"
  ],
  "warning_message": "⚠️ This transaction looks risky (Risk Score: 75/100). Reasons: High transaction amount, New receiver"
}
```

### 2. Create Transaction

```json
POST /transactions/create
Headers: Authorization: Bearer <token>
{
  "receiver_upi": "merchant@paytm",
  "receiver_name": "ABC Store",
  "amount": 6000,
  "category": "Shopping",
  "description": "Electronics purchase"
}
```

## 🤖 Fraud Detection Logic

### ML Model (v1)
- **Features**: `[amount, is_night]`
- **Algorithm**: Logistic Regression
- **Output**: Probability (0-1) converted to risk score (0-100)

### Rule-Based Scoring

1. **High Amount** (>5000): +30 points
2. **Night Transaction** (22:00-06:00): +20 points
3. **Reported UPI** (≥5 reports): +35 points
4. **New Receiver**: +15 points
5. **Unusual Amount** (>3x user average): +20 points

### Risk Threshold
- **Risk Score ≥ 70**: Transaction flagged as risky
- **Risk Score < 70**: Transaction considered safe

## 📊 Analytics Examples

### Category Spending

```json
GET /analytics/spending

Response:
{
  "total_spent": 45000,
  "total_transactions": 120,
  "category_breakdown": [
    {"category": "Food", "total": 15000, "count": 50},
    {"category": "Shopping", "total": 20000, "count": 30},
    {"category": "Education", "total": 10000, "count": 40}
  ],
  "monthly_breakdown": [...],
  "avg_transaction_amount": 375
}
```

## 🧪 Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123",
    "upi_id": "test@paytm",
    "phone": "+919876543210"
  }'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
```

### Using Python Requests

```python
import requests

BASE_URL = "http://localhost:8000"

# Register
response = requests.post(f"{BASE_URL}/auth/register", json={
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123",
    "upi_id": "test@paytm",
    "phone": "+919876543210"
})

# Login
response = requests.post(f"{BASE_URL}/auth/login", json={
    "username": "testuser",
    "password": "test123"
})
token = response.json()["access_token"]

# Check fraud
headers = {"Authorization": f"Bearer {token}"}
response = requests.post(
    f"{BASE_URL}/transactions/check-fraud",
    headers=headers,
    json={
        "receiver_upi": "merchant@paytm",
        "receiver_name": "ABC Store",
        "amount": 6000,
        "category": "Shopping"
    }
)
print(response.json())
```

## 🔧 Database Schema

### Users Table
- id, username, email, hashed_password, upi_id, phone, created_at

### Transactions Table
- id, user_id, receiver_upi, receiver_name, amount, category, description
- timestamp, hour, is_night, is_new_receiver
- risk_score, is_flagged, fraud_reasons, status

### Fraud Reports Table
- id, reporter_id, reported_upi, reason, created_at

## 🚀 Production Deployment

### 1. Update Environment Variables

```env
SECRET_KEY=<strong-production-key>
DEBUG=False
DATABASE_URL=postgresql://user:pass@host:5432/dbname  # Use PostgreSQL
```

### 2. Use Production Server

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 3. Setup Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use strong SECRET_KEY** - Minimum 32 characters
3. **Enable HTTPS** in production
4. **Update CORS origins** - Don't use `["*"]` in production
5. **Regular dependency updates** - Run `pip list --outdated`
6. **Use PostgreSQL** instead of SQLite for production
7. **Implement rate limiting** for API endpoints
8. **Add input validation** at all levels

## 📝 Frontend Integration

### Example React Integration

```javascript
// API client
const API_BASE = 'http://localhost:8000';

// Login
const login = async (username, password) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password})
  });
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
};

// Check fraud before payment
const checkFraud = async (transactionData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/transactions/check-fraud`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(transactionData)
  });
  return await response.json();
};
```

## 🐛 Troubleshooting

### Model Not Loading
- Ensure `fraud_model.pkl` exists in the project directory
- Run `python create_ml_model.py` to generate it

### Database Errors
- Delete `upi_fraud.db` and restart to recreate tables
- Check SQLAlchemy connection string

### Authentication Errors
- Verify JWT token is included in headers
- Check token hasn't expired (30 min default)

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Backend Developer - UPI Fraud Detection System

---

**Happy Coding! 🚀**
