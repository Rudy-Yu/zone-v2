# ✅ TESTING DASHBOARD (REAL DATA)

## Fitur yang Ditest
- GET `/api/dashboard`
  - Total revenue (sales invoices)
  - Total expense (purchase invoices)
  - Pending invoices count
  - Total products
  - Recent transactions (sales & purchase)
  - Cash flow last 6 months (aggregate sales & purchase)

## Persiapan
1) Pastikan MongoDB, backend, dan frontend berjalan (`start-all.ps1`).
2) Pastikan ada data pada koleksi:
   - `sales_invoices` (isi `amount`, `status`, `invoice_date`/`created_at`)
   - `purchase_invoices`
   - `products`

## Langkah Uji (API)
```http
GET http://localhost:8000/api/dashboard
```

**Harapan:**
- Status 200
- `stats.total_revenue` = sum `amount` dari `sales_invoices` (status Paid/Pending/Overdue)
- `stats.total_expense` = sum `amount` dari `purchase_invoices`
- `stats.pending_invoices` = jumlah `sales_invoices` dengan status Pending/Overdue
- `stats.total_products` = count dokumen `products`
- `recent_transactions` berisi gabungan sales & purchase (maks 5 terbaru)
- `cash_flow_data` memiliki 6 bulan terakhir dengan `revenue` & `expense`

## Validasi Cepat (Mongo)
- Cek total products:
  ```powershell
  mongo zone_db --eval "db.products.countDocuments()"
  ```
- Cek total revenue:
  ```powershell
  mongo zone_db --eval "db.sales_invoices.aggregate([{ $match: { status: { $in: ['Paid','Pending','Overdue'] } } }, { $group: { _id: null, total: { $sum: '$amount' } } }])"
  ```
- Cek total expense:
  ```powershell
  mongo zone_db --eval "db.purchase_invoices.aggregate([{ $match: { status: { $in: ['Paid','Pending','Overdue'] } } }, { $group: { _id: null, total: { $sum: '$amount' } } }])"
  ```

## Checklist
- [ ] Response 200
- [ ] Total revenue sesuai aggregate Mongo
- [ ] Total expense sesuai aggregate Mongo
- [ ] Pending invoices count benar
- [ ] Total products benar
- [ ] Recent transactions gabungan sales & purchase (maks 5, urut terbaru)
- [ ] Cash flow 6 bulan terisi dengan revenue/expense

---

*Last Updated: 2024-01-20*

