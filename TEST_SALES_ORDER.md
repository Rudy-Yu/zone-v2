# ✅ TESTING SALES ORDER MODULE

## 📋 Modul yang Sudah Diperbaiki: **SALES ORDER**

### ✅ Fitur yang Sudah Diimplementasikan:

1. **GET /api/sales-orders** - List semua sales orders dari database
2. **POST /api/sales-orders** - Create sales order dengan:
   - ✅ Validasi customer exists
   - ✅ Validasi products exist
   - ✅ Auto-generate order number (SO-YYYY-XXXXXX)
   - ✅ Auto-calculate total amount
   - ✅ Auto-fill product names
3. **GET /api/sales-orders/{order_id}** - Get order by ID dari database
4. **PUT /api/sales-orders/{order_id}** - Update order (hanya jika status Draft)
5. **PUT /api/sales-orders/{order_id}/status** - Update status dengan:
   - ✅ Status transition validation
   - ✅ Stock management (reserve stock saat Confirmed)
   - ✅ Stock restoration saat Cancelled
6. **DELETE /api/sales-orders/{order_id}** - Delete order (hanya jika Draft/Cancelled)

---

## 🧪 Cara Testing:

### 1. Pastikan Backend Berjalan
```powershell
cd backend
.\venv\Scripts\activate
uvicorn server:app --reload
```

### 2. Test dengan Postman/Thunder Client atau Browser

#### Test 1: Create Sales Order
```http
POST http://localhost:8000/api/sales-orders
Content-Type: application/json

{
  "customer_id": "CUSTOMER_ID_DARI_DATABASE",
  "customer_name": "Test Customer",
  "order_date": "2024-01-20",
  "delivery_date": "2024-01-25",
  "items": [
    {
      "product_id": "PRODUCT_ID_DARI_DATABASE",
      "product_name": "Test Product",
      "quantity": 2,
      "unit_price": 100000,
      "total": 200000
    }
  ],
  "notes": "Test order"
}
```

**Expected Response:**
- Status: 200 OK
- Order number auto-generated: `SO-2024-000001`
- Status: `Draft`
- Total amount calculated

#### Test 2: Get All Sales Orders
```http
GET http://localhost:8000/api/sales-orders
```

**Expected Response:**
- Status: 200 OK
- List of all orders from database

#### Test 3: Get Sales Order by ID
```http
GET http://localhost:8000/api/sales-orders/{order_id}
```

**Expected Response:**
- Status: 200 OK
- Order details

#### Test 4: Update Order Status to Confirmed
```http
PUT http://localhost:8000/api/sales-orders/{order_id}/status
Content-Type: application/json

{
  "status": "Confirmed"
}
```

**Expected Response:**
- Status: 200 OK
- Stock decreased for all products in order
- Order status updated to `Confirmed`

#### Test 5: Cancel Order
```http
PUT http://localhost:8000/api/sales-orders/{order_id}/status
Content-Type: application/json

{
  "status": "Cancelled"
}
```

**Expected Response:**
- Status: 200 OK
- Stock restored for all products
- Order status updated to `Cancelled`

---

## ✅ Checklist Testing:

- [ ] Create sales order berhasil
- [ ] Order number auto-generated dengan format benar
- [ ] Get all orders menampilkan data dari database
- [ ] Get order by ID berhasil
- [ ] Update order (Draft) berhasil
- [ ] Update status ke Confirmed mengurangi stock
- [ ] Update status ke Cancelled mengembalikan stock
- [ ] Tidak bisa update order yang sudah Confirmed/Processing
- [ ] Tidak bisa delete order yang sudah Confirmed
- [ ] Validasi customer exists
- [ ] Validasi product exists
- [ ] Validasi stock availability saat Confirm

---

## 🔍 Test Cases:

### Test Case 1: Create Order dengan Stock Cukup
1. Buat product dengan stock = 10
2. Create order dengan quantity = 5
3. Confirm order
4. **Expected**: Stock menjadi 5, order status = Confirmed

### Test Case 2: Create Order dengan Stock Tidak Cukup
1. Buat product dengan stock = 5
2. Create order dengan quantity = 10
3. Confirm order
4. **Expected**: Error "Insufficient stock"

### Test Case 3: Cancel Order Mengembalikan Stock
1. Create dan confirm order (stock berkurang)
2. Cancel order
3. **Expected**: Stock kembali ke nilai awal

### Test Case 4: Status Transition Validation
1. Create order (status = Draft)
2. Try update status langsung ke "Shipped"
3. **Expected**: Error "Invalid status transition"

---

## 📝 Notes:

- Order number format: `SO-YYYY-XXXXXX` (contoh: SO-2024-000001)
- Stock hanya di-update saat status berubah ke Confirmed
- Stock dikembalikan saat order di-cancel
- Order yang sudah Confirmed/Processing tidak bisa di-edit
- Order yang sudah Confirmed/Processing tidak bisa di-delete (harus cancel dulu)

---

*Last Updated: 2024-01-20*

