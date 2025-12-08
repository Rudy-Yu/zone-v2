# ✅ TESTING QUOTATION MODULE

## 📋 Modul yang Sudah Diperbaiki: **QUOTATION**

### ✅ Fitur yang Sudah Diimplementasikan:

1. **GET /api/quotations** - List semua quotations dari database
   - ✅ Auto-detect expired quotations
   - ✅ Auto-update status ke Expired

2. **POST /api/quotations** - Create quotation dengan:
   - ✅ Validasi customer exists
   - ✅ Validasi products exist
   - ✅ Auto-generate quotation number (QUO-YYYY-XXXXXX)
   - ✅ Auto-calculate total amount
   - ✅ Auto-fill product names

3. **GET /api/quotations/{quotation_id}** - Get quotation by ID dari database
   - ✅ Auto-check expired

4. **PUT /api/quotations/{quotation_id}** - Update quotation (hanya jika belum Accepted/Rejected/Expired)

5. **PUT /api/quotations/{quotation_id}/status** - Update status dengan:
   - ✅ Status transition validation
   - ✅ Auto-set sent_date saat status = Sent
   - ✅ Auto-set accepted_date saat status = Accepted

6. **POST /api/quotations/{quotation_id}/convert-to-order** - Convert quotation ke Sales Order
   - ✅ Validasi quotation status = Accepted
   - ✅ Create sales order dari quotation items
   - ✅ Link quotation ke sales order
   - ✅ Set converted_at timestamp

7. **DELETE /api/quotations/{quotation_id}** - Delete quotation (hanya jika belum converted)

---

## 🧪 Cara Testing:

### 1. Pastikan Backend Berjalan
```powershell
cd backend
.\venv\Scripts\activate
uvicorn server:app --reload
```

### 2. Test dengan Postman/Thunder Client

#### Test 1: Create Quotation
```http
POST http://localhost:8000/api/quotations
Content-Type: application/json

{
  "customer_id": "CUSTOMER_ID_DARI_DATABASE",
  "customer_name": "Test Customer",
  "quotation_date": "2024-01-20",
  "valid_until": "2024-02-20",
  "items": [
    {
      "product_id": "PRODUCT_ID_DARI_DATABASE",
      "product_name": "Test Product",
      "quantity": 2,
      "unit_price": 100000,
      "total": 200000
    }
  ],
  "notes": "Valid for 30 days"
}
```

**Expected Response:**
- Status: 200 OK
- Quotation number auto-generated: `QUO-2024-000001`
- Status: `Draft`
- Total amount calculated

#### Test 2: Send Quotation (Draft → Sent)
```http
PUT http://localhost:8000/api/quotations/{quotation_id}/status
Content-Type: application/json

{
  "status": "Sent"
}
```

**Expected Response:**
- Status: 200 OK
- Quotation status = `Sent`
- sent_date di-set

#### Test 3: Accept Quotation (Sent → Accepted)
```http
PUT http://localhost:8000/api/quotations/{quotation_id}/status
Content-Type: application/json

{
  "status": "Accepted"
}
```

**Expected Response:**
- Status: 200 OK
- Quotation status = `Accepted`
- accepted_date di-set

#### Test 4: Convert Quotation to Sales Order
```http
POST http://localhost:8000/api/quotations/{quotation_id}/convert-to-order
Content-Type: application/json

{
  "delivery_date": "2024-01-25"
}
```

**Expected Response:**
- Status: 200 OK
- ✅ Sales Order created dengan items dari quotation
- ✅ Quotation linked ke sales order
- ✅ converted_at timestamp di-set

#### Test 5: Get All Quotations (Check Expired)
```http
GET http://localhost:8000/api/quotations
```

**Expected Response:**
- Status: 200 OK
- List of all quotations
- Quotations dengan valid_until < today otomatis status = `Expired`

---

## ✅ Checklist Testing:

- [ ] Create quotation berhasil
- [ ] Quotation number auto-generated dengan format benar
- [ ] Get all quotations menampilkan data dari database
- [ ] Get quotation by ID berhasil
- [ ] Update quotation (belum Accepted) berhasil
- [ ] Send quotation (Draft → Sent) set sent_date
- [ ] Accept quotation (Sent → Accepted) set accepted_date
- [ ] Convert quotation to sales order berhasil
- [ ] Sales order created dengan items dari quotation
- [ ] Quotation linked ke sales order
- [ ] Expired detection bekerja
- [ ] Tidak bisa update quotation yang sudah Accepted/Rejected/Expired
- [ ] Tidak bisa delete quotation yang sudah converted
- [ ] Tidak bisa convert quotation yang belum Accepted
- [ ] Validasi customer exists
- [ ] Validasi product exists

---

## 🔍 Test Cases:

### Test Case 1: Create dan Send Quotation
1. Create quotation dengan valid_until = tomorrow
2. Send quotation (status = Sent)
3. **Expected**: 
   - Status = Sent
   - sent_date di-set

### Test Case 2: Accept dan Convert Quotation
1. Accept quotation (status = Accepted)
2. Convert to sales order
3. **Expected**:
   - Sales order created
   - Quotation linked ke sales order
   - converted_at di-set

### Test Case 3: Expired Detection
1. Create quotation dengan valid_until = yesterday
2. Get all quotations
3. **Expected**: Quotation status = `Expired`

### Test Case 4: Status Transition Validation
1. Create quotation (status = Draft)
2. Try update status langsung ke "Accepted"
3. **Expected**: Error "Invalid status transition"

### Test Case 5: Convert Validation
1. Create quotation (status = Draft)
2. Try convert to sales order
3. **Expected**: Error "Quotation must be Accepted"

---

## 📝 Notes:

- Quotation number format: `QUO-YYYY-XXXXXX` (contoh: QUO-2024-000001)
- Expired detection otomatis saat get quotations
- Quotation harus Accepted sebelum bisa di-convert ke sales order
- Sales order dibuat dengan items dari quotation
- Quotation yang sudah converted tidak bisa di-delete

---

## 🔗 Integration dengan Modul Lain:

- ✅ **Sales Order**: Convert quotation ke sales order
- ✅ **Customer**: Validasi customer exists
- ✅ **Products**: Validasi product exists

---

*Last Updated: 2024-01-20*

