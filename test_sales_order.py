"""
Test script untuk Sales Order API
Jalankan: python test_sales_order.py
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_sales_order():
    print("=" * 60)
    print("TESTING SALES ORDER API")
    print("=" * 60)
    
    # 1. Test Create Sales Order
    print("\n[1] Testing CREATE Sales Order...")
    order_data = {
        "customer_id": "test_customer_id",  # Ganti dengan ID customer yang ada
        "customer_name": "Test Customer",
        "order_date": "2024-01-20",
        "delivery_date": "2024-01-25",
        "items": [
            {
                "product_id": "test_product_id",  # Ganti dengan ID product yang ada
                "product_name": "Test Product",
                "quantity": 2,
                "unit_price": 100000,
                "total": 200000
            }
        ],
        "notes": "Test order"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/sales-orders", json=order_data)
        if response.status_code == 200:
            order = response.json()
            print(f"✅ CREATE SUCCESS")
            print(f"   Order ID: {order.get('id')}")
            print(f"   Order Number: {order.get('order_number')}")
            print(f"   Status: {order.get('status')}")
            order_id = order.get('id')
        else:
            print(f"❌ CREATE FAILED: {response.status_code}")
            print(f"   {response.text}")
            return
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return
    
    # 2. Test Get Sales Order
    print(f"\n[2] Testing GET Sales Order (ID: {order_id})...")
    try:
        response = requests.get(f"{BASE_URL}/sales-orders/{order_id}")
        if response.status_code == 200:
            order = response.json()
            print(f"✅ GET SUCCESS")
            print(f"   Order Number: {order.get('order_number')}")
            print(f"   Customer: {order.get('customer_name')}")
            print(f"   Total: {order.get('total_amount')}")
        else:
            print(f"❌ GET FAILED: {response.status_code}")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
    
    # 3. Test Get All Sales Orders
    print("\n[3] Testing GET All Sales Orders...")
    try:
        response = requests.get(f"{BASE_URL}/sales-orders")
        if response.status_code == 200:
            orders = response.json()
            print(f"✅ GET ALL SUCCESS")
            print(f"   Total Orders: {len(orders)}")
        else:
            print(f"❌ GET ALL FAILED: {response.status_code}")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
    
    # 4. Test Update Status
    print(f"\n[4] Testing UPDATE Status to Confirmed...")
    try:
        response = requests.put(
            f"{BASE_URL}/sales-orders/{order_id}/status",
            json={"status": "Confirmed"}
        )
        if response.status_code == 200:
            result = response.json()
            print(f"✅ UPDATE STATUS SUCCESS")
            print(f"   {result.get('message')}")
        else:
            print(f"❌ UPDATE STATUS FAILED: {response.status_code}")
            print(f"   {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
    
    # 5. Test Delete (optional - uncomment to test)
    # print(f"\n[5] Testing DELETE Sales Order...")
    # try:
    #     response = requests.delete(f"{BASE_URL}/sales-orders/{order_id}")
    #     if response.status_code == 200:
    #         print(f"✅ DELETE SUCCESS")
    #     else:
    #         print(f"❌ DELETE FAILED: {response.status_code}")
    # except Exception as e:
    #     print(f"❌ ERROR: {str(e)}")
    
    print("\n" + "=" * 60)
    print("TESTING COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    test_sales_order()

