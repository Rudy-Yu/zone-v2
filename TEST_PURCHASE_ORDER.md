# ✅ TESTING PURCHASE ORDER MODULE

## 📋 Modul yang Sudah Diperbaiki: **PURCHASE ORDER**

### ✅ Fitur yang Sudah Diimplementasikan:

1. **GET /api/purchase-orders** - List semua purchase orders dari database
2. **POST /api/purchase-orders** - Create purchase order dengan:
   - ✅ Validasi vendor exists
   - ✅ Validasi products exist (atau create jika baru)
   - ✅ Auto-generate order number (PO-YYYY-XXXXXX)
   - ✅ Auto-calculate total amount
   - ✅ Auto-fill product names

3. **GET /api/purchase-orders/{order_id}** - Get order by ID dari database
4. **PUT /api/purchase-orders/{order_id}** - Update order (hanya jika Draft)
5. **PUT /api/purchase-orders/{order_id}/status** - Update status dengan:
   - ✅ Status transition validation
   - ✅ Stock management (increase stock saat Received)
   - ✅ Auto-create product jika belum ada
6. **DELETE /api/purchase-orders/{order_id}** - Delete order (hanya jika Draft/Cancelled)

---

## 🧪 Cara Testing:

### Test 1: Create Purchase Order
```http
POST http://localhost:8000/api/purchase-orders
Content-Type: application/json

{
  "vendor_id": "VENDOR_ID_DARI_DATABASE",
  "vendor_name": "Test Vendor",
  "order_date": "2024-01-20",
  "delivery_date": "2024-01-25",
  "items": [
    {
      "product_id": "PRODUCT_ID_DARI_DATABASE",
      "product_name": "Test Product",
      "quantity": 10,
      "unit_price": 50000,
      "total": 500000
    }
  ],
  "notes": "Test purchase order"
}
```

**Expected Response:**
- Status: 200 OK
- Order number auto-generated: `PO-2024-000001`
- Status: `Draft`

### Test 2: Receive Purchase Order (Confirmed → Received)
```http
PUT http://localhost:8000/api/purchase-orders/{order_id}/status
Content-Type: application/json

{
  "status": "Received"
}
```

**Expected Response:**
- Status: 200 OK
- Order status = `Received`
- ✅ Stock increased untuk semua products
- ✅ Product created jika belum ada

---

## ✅ Checklist Testing:

- [ ] Create purchase order berhasil
- [ ] Order number auto-generated
- [ ] Get all orders menampilkan data dari database
- [ ] Get order by ID berhasil
- [ ] Update order (Draft) berhasil
- [ ] Receive order (Confirmed → Received) meningkatkan stock
- [ ] Product auto-created jika belum ada
- [ ] Status transition validation
- [ ] Tidak bisa update order yang sudah Confirmed/Processing/Received
- [ ] Tidak bisa delete order yang sudah Confirmed

---

*Last Updated: 2024-01-20*

