import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_full_flow():
    print("1. Testing Health Check...")
    r = client.get("/")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    print("   Health Check OK:", r.json()["service"])

    print("2. Testing Login as Demo Driver...")
    r = client.post(
        "/api/auth/login",
        json={"email": "driver@enroute.com", "password": "Driver123!"},
    )
    assert r.status_code == 200, f"Driver login failed: {r.text}"
    driver_token = r.json()["access_token"]
    print("   Driver Login OK! Token acquired.")

    print("3. Testing Login as Demo Customer...")
    r = client.post(
        "/api/auth/login",
        json={"email": "customer@enroute.com", "password": "Customer123!"},
    )
    assert r.status_code == 200, f"Customer login failed: {r.text}"
    customer_token = r.json()["access_token"]
    print("   Customer Login OK! Token acquired.")

    print("4. Testing /api/auth/me for Customer...")
    r = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert r.status_code == 200
    user_me = r.json()
    assert user_me["role"] == "CUSTOMER"
    print(f"   Customer Profile OK: {user_me['name']} ({user_me['email']})")

    print("5. Testing Browse Routes (Public)...")
    r = client.get("/api/routes/")
    assert r.status_code == 200
    routes = r.json()
    assert len(routes) >= 5, "Should have at least 5 routes"
    # Ensure public route has contact_phone masked
    assert routes[0]["contact_phone"] is None, "Driver phone should be masked in public route browsing!"
    print(f"   Browse Routes OK! Found {len(routes)} active routes (Phone masked correctly).")

    print("6. Testing Filter Routes (Dehradun)...")
    r = client.get("/api/routes/?origin=Dehradun")
    assert r.status_code == 200
    dehradun_routes = r.json()
    assert len(dehradun_routes) >= 1
    target_route_id = dehradun_routes[0]["id"]
    print(f"   Filter Routes OK! Found {len(dehradun_routes)} routes from Dehradun.")

    print("7. Testing Driver Dashboard Requests...")
    r = client.get(
        "/api/bookings/driver-requests",
        headers={"Authorization": f"Bearer {driver_token}"},
    )
    assert r.status_code == 200
    requests = r.json()
    print(f"   Driver Requests OK! Found {len(requests)} requests for driver.")

    print("8. Testing Customer My-Bookings...")
    r = client.get(
        "/api/bookings/my-bookings",
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert r.status_code == 200
    my_bookings = r.json()
    print(f"   Customer Bookings OK! Found {len(my_bookings)} bookings.")
    # For confirmed bookings, driver phone should be present
    confirmed = [b for b in my_bookings if b["status"] == "CONFIRMED"]
    if confirmed:
        assert confirmed[0]["contact_phone"] is not None, "Driver phone should be disclosed for confirmed booking!"
        print(f"   Confirmed booking disclosure OK! Driver phone: {confirmed[0]['contact_phone']}")

    print("\nALL API BACKEND TESTS PASSED SUCCESSFULLY! [SUCCESS]")


if __name__ == "__main__":
    test_full_flow()
