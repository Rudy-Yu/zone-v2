# ✅ TESTING SALES INVOICE MODULE

## 📋 Modul yang Sudah Diperbaiki: **SALES INVOICE**

### ✅ Fitur yang Sudah Diimplementasikan:

1. **GET /api/sales-invoices** - List semua sales invoices dari database
   - ✅ Auto-detect overdue invoices
   - ✅ Auto-update status ke Overdue

2. **POST /api/sales-invoices** - Create sales invoice dengan:
   - ✅ Validasi customer exists
   - ✅ Validasi products exist
   - ✅ Auto-generate invoice number (INV-YYYY-XXXXXX)
   - ✅ Auto-calculate total amount
   - ✅ Auto-fill product names

3. **GET /api/sales-invoices/{invoice_id}** - Get invoice by ID dari database
   - ✅ Auto-check overdue

4. **PUT /api/sales-invoices/{invoice_id}** - Update invoice (hanya jika belum Paid)

5. **PUT /api/sales-invoices/{invoice_id}/status** - Update status dengan:
   - ✅ Status transition validation
   - ✅ Auto-create journal entry saat status = Pending (Accounting integration)
   - ✅ Update account balances (AR & Sales Revenue)
   - ✅ Record payment saat status = Paid
   - ✅ Update customer total_purchases dan last_purchase
   - ✅ Create payment journal entry

6. **DELETE /api/sales-invoices/{invoice_id}** - Delete invoice (hanya jika belum Paid)

---

## 🧪 Cara Testing:

### 1. Pastikan Backend Berjalan
```powershell
cd backend
.\venv\Scripts\activate
uvicorn server:app --reload
```

### 2. Test dengan Postman/Thunder Client

#### Test 1: Create Sales Invoice
```http
POST http://localhost:8000/api/sales-invoices
Content-Type: application/json

{
  "customer_id": "CUSTOMER_ID_DARI_DATABASE",
  "invoice_date": "2024-01-20",
  "due_date": "2024-02-19",
  "items": [
    {
      "product_id": "PRODUCT_ID_DARI_DATABASE",
      "product_name": "Test Product",
      "quantity": 2,
      "unit_price": 100000,
      "total": 200000
    }
  ],
  "notes": "Test invoice"
}
```

**Expected Response:**
- Status: 200 OK
- Invoice number auto-generated: `INV-2024-000001`
- Status: `Draft`
- Total amount calculated

#### Test 2: Post Invoice (Draft → Pending)
```http
PUT http://localhost:8000/api/sales-invoices/{invoice_id}/status
Content-Type: application/json

{
  "status": "Pending"
}
```

**Expected Response:**
- Status: 200 OK
- Invoice status = `Pending`
- ✅ Journal entry created (AR Debit, Sales Revenue Credit)
- ✅ Account balances updated

#### Test 3: Record Payment (Pending → Paid)
```http
PUT http://localhost:8000/api/sales-invoices/{invoice_id}/status
Content-Type: application/json

{
  "status": "Paid",
  "paid_amount": 200000
}
```

**Expected Response:**
- Status: 200 OK
- Invoice status = `Paid`
- ✅ Payment journal entry created (Cash Debit, AR Credit)
- ✅ Customer total_purchases updated
- ✅ Customer last_purchase updated
- ✅ Account balances updated

#### Test 4: Get All Invoices (Check Overdue)
```http
GET http://localhost:8000/api/sales-invoices
```

**Expected Response:**
- Status: 200 OK
- List of all invoices
- Invoices dengan due_date < today otomatis status = `Overdue`

---

## ✅ Checklist Testing:

- [ ] Create sales invoice berhasil
- [ ] Invoice number auto-generated dengan format benar
- [ ] Get all invoices menampilkan data dari database
- [ ] Get invoice by ID berhasil
- [ ] Update invoice (belum Paid) berhasil
- [ ] Post invoice (Draft → Pending) membuat journal entry
- [ ] Post invoice update account balances
- [ ] Record payment (Pending → Paid) membuat payment journal entry
- [ ] Record payment update customer total_purchases
- [ ] Record payment update customer last_purchase
- [ ] Overdue detection bekerja
- [ ] Tidak bisa update invoice yang sudah Paid
- [ ] Tidak bisa delete invoice yang sudah Paid
- [ ] Validasi customer exists
- [ ] Validasi product exists

---

## 🔍 Test Cases:

### Test Case 1: Create dan Post Invoice
1. Create invoice dengan amount = 1,000,000
2. Post invoice (status = Pending)
3. **Expected**: 
   - Journal entry created
   - AR account balance +1,000,000
   - Sales Revenue account balance +1,000,000

### Test Case 2: Record Payment
1. Post invoice (amount = 1,000,000)
2. Record payment (paid_amount = 1,000,000)
3. **Expected**:
   - Payment journal entry created
   - Cash account balance +1,000,000
   - AR account balance -1,000,000
   - Customer total_purchases +1,000,000

### Test Case 3: Overdue Detection
1. Create invoice dengan due_date = yesterday
2. Get all invoices
3. **Expected**: Invoice status = `Overdue`

### Test Case 4: Status Transition Validation
1. Create invoice (status = Draft)
2. Try update status langsung ke "Paid"
3. **Expected**: Error "Invalid status transition"

---

## 📝 Notes:

- Invoice number format: `INV-YYYY-XXXXXX` (contoh: INV-2024-000001)
- Journal entry dibuat otomatis saat invoice di-post (Draft → Pending)
- Payment journal entry dibuat saat invoice di-mark sebagai Paid
- Customer total_purchases dan last_purchase di-update saat payment
- Overdue detection otomatis saat get invoices
- Invoice yang sudah Paid tidak bisa di-edit atau di-delete

---

## 🔗 Integration dengan Modul Lain:

- ✅ **Accounting**: Auto-create journal entries
- ✅ **Customer**: Update total_purchases dan last_purchase
- ✅ **Products**: Validasi product exists

---

*Last Updated: 2024-01-20*

