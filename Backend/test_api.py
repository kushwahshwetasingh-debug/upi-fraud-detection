"""
Test script to demonstrate UPI Fraud Detection API functionality
Run this after starting the FastAPI server
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def print_response(title, response):
    """Pretty print API response"""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)

def test_api():
    """Test the UPI Fraud Detection API"""
    
    print("\n🚀 UPI Fraud Detection API Test Suite")
    print("="*60)
    
    # Test 1: Register User
    print("\n📝 Test 1: Register New User")
    register_data = {
        "username": "test_user",
        "email": "test@example.com",
        "password": "securepass123",
        "upi_id": "testuser@paytm",
        "phone": "+919876543210"
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    print_response("User Registration", response)
    
    if response.status_code != 201:
        print("\n⚠️ Registration failed. User might already exist.")
    
    # Test 2: Login
    print("\n🔐 Test 2: User Login")
    login_data = {
        "username": "test_user",
        "password": "securepass123"
    }
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print_response("User Login", response)
    
    if response.status_code != 200:
        print("\n❌ Login failed. Cannot continue tests.")
        return
    
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test 3: Get Current User
    print("\n👤 Test 3: Get Current User Info")
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print_response("Current User Info", response)
    
    # Test 4: Check Fraud - Low Risk Transaction
    print("\n✅ Test 4: Check Fraud - Low Risk Transaction")
    transaction_data = {
        "receiver_upi": "merchant@paytm",
        "receiver_name": "Coffee Shop",
        "amount": 250,
        "category": "Food",
        "description": "Morning coffee"
    }
    response = requests.post(
        f"{BASE_URL}/transactions/check-fraud",
        headers=headers,
        json=transaction_data
    )
    print_response("Low Risk Transaction Check", response)
    
    # Test 5: Check Fraud - High Risk Transaction
    print("\n⚠️ Test 5: Check Fraud - High Risk Transaction")
    risky_transaction = {
        "receiver_upi": "unknown@paytm",
        "receiver_name": "Unknown Merchant",
        "amount": 8000,
        "category": "Shopping",
        "description": "Expensive purchase"
    }
    response = requests.post(
        f"{BASE_URL}/transactions/check-fraud",
        headers=headers,
        json=risky_transaction
    )
    print_response("High Risk Transaction Check", response)
    
    # Test 6: Create Normal Transaction
    print("\n💳 Test 6: Create Transaction")
    response = requests.post(
        f"{BASE_URL}/transactions/create",
        headers=headers,
        json=transaction_data
    )
    print_response("Transaction Created", response)
    
    # Test 7: Get All Transactions
    print("\n📊 Test 7: Get All Transactions")
    response = requests.get(f"{BASE_URL}/transactions/", headers=headers)
    print_response("All Transactions", response)
    
    # Test 8: Report Fraud
    print("\n🚨 Test 8: Report Suspicious UPI")
    fraud_report = {
        "reported_upi": "scammer@paytm",
        "reason": "Received suspicious refund request from this UPI ID"
    }
    response = requests.post(
        f"{BASE_URL}/fraud-reports/",
        headers=headers,
        json=fraud_report
    )
    print_response("Fraud Report", response)
    
    # Test 9: Check UPI Report Count
    print("\n🔍 Test 9: Check UPI Report Count")
    response = requests.get(
        f"{BASE_URL}/fraud-reports/upi/scammer@paytm",
        headers=headers
    )
    print_response("UPI Report Count", response)
    
    # Test 10: Get Spending Analytics
    print("\n📈 Test 10: Get Spending Analytics")
    response = requests.get(f"{BASE_URL}/analytics/spending", headers=headers)
    print_response("Spending Analytics", response)
    
    # Test 11: Get Category Chart Data
    print("\n📊 Test 11: Get Category Chart Data")
    response = requests.get(f"{BASE_URL}/analytics/charts/category", headers=headers)
    print_response("Category Chart Data", response)
    
    print("\n" + "="*60)
    print("✅ All tests completed!")
    print("="*60)

if __name__ == "__main__":
    try:
        # Check if server is running
        response = requests.get(f"{BASE_URL}/health", timeout=2)
        if response.status_code == 200:
            print("✓ Server is running")
            test_api()
        else:
            print("❌ Server is not responding correctly")
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server")
        print("Please ensure the FastAPI server is running:")
        print("  python main.py")
    except Exception as e:
        print(f"❌ Error: {e}")
