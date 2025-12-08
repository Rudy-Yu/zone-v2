# ✅ TESTING PRODUCTION ORDER MODULE

## 📋 Modul yang Sudah Diperbaiki: **PRODUCTION ORDER**

### ✅ Fitur yang Sudah Diimplementasikan:

1. **GET /api/production-orders** - List semua production orders dari database
2. **POST /api/production-orders** - Create production order dengan:
   - ✅ Validasi product exists
   - ✅ Validasi BOM components exist
   - ✅ Validasi stock availability untuk semua components
   - ✅ Auto-generate order number (PROD-YYYY-XXXXXX)
   - ✅ Auto-calculate BOM totals
   - ✅ Auto-fill component names
3. **GET /api/production-orders/{order_id}** - Get order by ID
4. **PUT /api/production-orders/{order_id}** - Update order (hanya jika belum In Production/Completed)
5. **PUT /api/production-orders/{order_id}/status** - Update status dengan:
   - ✅ Status transition validation
   - ✅ Material consumption saat In Production (consume dari BOM)
   - ✅ Add finished product to stock saat Completed
   - ✅ Return materials saat Cancelled
6. **DELETE /api/production-orders/{order_id}** - Delete order (hanya jika belum In Production/Completed)

---

## 🧪 Cara Testing:

### Test 1: Create Production Order
```http
POST http://localhost:8000/api/production-orders
Content-Type: application/json

{
  "product_id": "PRODUCT_ID_DARI_DATABASE",
  "product_name": "Finished Product",
  "order_date": "2024-01-20",
  "start_date": "2024-01-22",
  "due_date": "2024-01-30",
  "quantity": 10,
  "workstation": "Assembly Line A",
  "bom": [
    {
      "component_id": "COMPONENT_ID_1",
      "component_name": "Component 1",
      "quantity": 2,
      "unit_price": 50000
    },
    {
      "component_id": "COMPONENT_ID_2",
      "component_name": "Component 2",
      "quantity": 1,
      "unit_price": 30000
    }
  ],
  "notes": "High priority order"
}
```

**Expected Response:**
- Status: 200 OK
- Order number auto-generated: `PROD-2024-000001`
- Status: `Draft`
- Stock availability checked untuk semua components

### Test 2: Start Production (Draft → In Production)
```http
PUT http://localhost:8000/api/production-orders/{order_id}/status
Content-Type: application/json

{
  "status": "In Production"
}
```

**Expected Response:**
- Status: 200 OK
- Order status = `In Production`
- ✅ Materials consumed dari stock (BOM components decreased)

### Test 3: Complete Production (In Production → Completed)
```http
PUT http://localhost:8000/api/production-orders/{order_id}/status
Content-Type: application/json

{
  "status": "Completed",
  "completed_quantity": 10
}
```

**Expected Response:**
- Status: 200 OK
- Order status = `Completed`
- ✅ Finished product added to stock

---

## ✅ Checklist Testing:

- [ ] Create production order berhasil
- [ ] Order number auto-generated
- [ ] BOM validation (components exist)
- [ ] Stock availability validation untuk BOM components
- [ ] Get all orders menampilkan data dari database
- [ ] Get order by ID berhasil
- [ ] Update order (Draft) berhasil
- [ ] Start production (In Production) consumes materials
- [ ] Complete production adds finished product to stock
- [ ] Cancel production returns materials to stock
- [ ] Status transition validation
- [ ] Tidak bisa update order yang sudah In Production/Completed
- [ ] Tidak bisa delete order yang sudah In Production/Completed

---

## 🔍 Test Cases:

### Test Case 1: Material Consumption
1. Create production order dengan BOM (2 components, quantity 10)
2. Start production (status = In Production)
3. **Expected**: 
   - Component 1 stock decreased by 20 (2 * 10)
   - Component 2 stock decreased by 10 (1 * 10)

### Test Case 2: Finished Product Addition
1. Complete production order (quantity = 10)
2. **Expected**: 
   - Finished product stock increased by 10

### Test Case 3: Material Return on Cancel
1. Start production (materials consumed)
2. Cancel production
3. **Expected**: 
   - Materials returned to stock

---

*Last Updated: 2024-01-20*

