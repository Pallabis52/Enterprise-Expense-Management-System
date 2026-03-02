import requests
import json
import time

BASE_URL = "http://localhost:8081/api"

def test_complaint_flow():
    # 1. Register a test user
    email = f"test_{int(time.time())}@example.com"
    reg_data = {
        "name": "Test User",
        "email": email,
        "password": "password123",
        "role": "USER"
    }
    
    print(f"[*] Registering user: {email}")
    r = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
    if r.status_code != 200:
        print(f"[!] Register failed: {r.text}")
        return

    token = r.json().get("token")
    print(f"[*] Auth Token: {token[:10]}...")

    # 2. Submit a complaint
    headers = {"Authorization": f"Bearer {token}"}
    complaint_data = {
        "title": "Debug Complaint",
        "description": "This is a test complaint to diagnose the 500 error."
    }

    print("[*] Submitting complaint...")
    r = requests.post(f"{BASE_URL}/complaints", json=complaint_data, headers=headers)
    
    print(f"[*] Status Code: {r.status_code}")
    print(f"[*] Response Body: {r.text}")

    if r.status_code == 500:
        print("[!] REPRODUCED: 500 Server Error detected.")
    elif r.status_code == 200:
        print("[+] SUCCESS: Complaint submitted successfully.")

if __name__ == "__main__":
    test_complaint_flow()
