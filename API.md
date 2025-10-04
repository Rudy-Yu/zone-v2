# API Documentation

## 📡 API Overview

ZONE v.2 provides a comprehensive RESTful API for all business management operations. The API is built with FastAPI and follows REST principles.

### Base URL
```
Development: http://localhost:8000/api
Production: https://your-domain.com/api
```

### Authentication
All API endpoints require authentication except for login and health check.

```javascript
// Include in headers
Authorization: Bearer <access_token>
```

## 🔐 Authentication Endpoints

### POST /api/auth/login
Login user and get access token.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "admin",
    "permissions": ["read", "write", "delete"]
  }
}
```

### POST /api/auth/logout
Logout user and invalidate token.

**Response:**
```json
{
  "message": "Successfully logged out"
}
```

### GET /api/auth/me
Get current user information.

**Response:**
```json
{
  "id": "user_id",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "admin",
  "permissions": ["read", "write", "delete"],
  "last_login": "2024-01-20T10:30:00Z"
}
```

## 👥 User Management Endpoints

### GET /api/users
Get list of users with pagination and filtering.

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 10)
- `search` (string): Search term
- `role` (string): Filter by role
- `status` (string): Filter by status

**Response:**
```json
{
  "users": [
    {
      "id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "admin",
      "status": "active",
      "created_at": "2024-01-20T10:30:00Z",
      "last_login": "2024-01-20T10:30:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 10
}
```

### POST /api/users
Create new user.

**Request:**
```json
{
  "username": "jane_doe",
  "email": "jane@example.com",
  "password": "secure_password",
  "role": "user",
  "permissions": ["read", "write"]
}
```

**Response:**
```json
{
  "id": "new_user_id",
  "username": "jane_doe",
  "email": "jane@example.com",
  "role": "user",
  "status": "active",
  "created_at": "2024-01-20T10:30:00Z"
}
```

### GET /api/users/{user_id}
Get specific user by ID.

**Response:**
```json
{
  "id": "user_id",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "admin",
  "status": "active",
  "permissions": ["read", "write", "delete"],
  "created_at": "2024-01-20T10:30:00Z",
  "last_login": "2024-01-20T10:30:00Z"
}
```

### PUT /api/users/{user_id}
Update user information.

**Request:**
```json
{
  "email": "new_email@example.com",
  "role": "manager",
  "permissions": ["read", "write", "delete"]
}
```

### DELETE /api/users/{user_id}
Delete user.

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

## 🛒 Sales Management Endpoints

### Customer Management

#### GET /api/customers
Get list of customers.

**Query Parameters:**
- `page` (int): Page number
- `limit` (int): Items per page
- `search` (string): Search term
- `type` (string): Customer type (Individual, Corporate)
- `status` (string): Customer status

**Response:**
```json
{
  "customers": [
    {
      "id": "CUST-001",
      "name": "PT. ABC Indonesia",
      "contact_person": "John Doe",
      "email": "john@abcindonesia.com",
      "phone": "+62 21 1234 5678",
      "address": "Jl. Sudirman No. 123, Jakarta Pusat",
      "city": "Jakarta",
      "type": "Corporate",
      "status": "Active",
      "credit_limit": 100000000,
      "total_purchases": 45000000,
      "last_purchase": "2024-01-15",
      "created_at": "2023-06-15"
    }
  ],
  "total": 50,
  "page": 1,
  "pages": 5
}
```

#### POST /api/customers
Create new customer.

**Request:**
```json
{
  "name": "PT. XYZ Trading",
  "contact_person": "Jane Smith",
  "email": "jane@xyztrading.com",
  "phone": "+62 21 8765 4321",
  "address": "Jl. Thamrin No. 456, Jakarta Pusat",
  "city": "Jakarta",
  "type": "Corporate",
  "credit_limit": 50000000
}
```

#### GET /api/customers/{customer_id}
Get specific customer.

#### PUT /api/customers/{customer_id}
Update customer information.

#### DELETE /api/customers/{customer_id}
Delete customer.

### Sales Orders

#### GET /api/sales-orders
Get list of sales orders.

**Query Parameters:**
- `page` (int): Page number
- `limit` (int): Items per page
- `search` (string): Search term
- `status` (string): Order status
- `customer_id` (string): Filter by customer
- `date_from` (string): Start date filter
- `date_to` (string): End date filter

**Response:**
```json
{
  "sales_orders": [
    {
      "id": "SO-001",
      "order_number": "SO-2024-001",
      "customer_id": "CUST-001",
      "customer_name": "PT. ABC Indonesia",
      "order_date": "2024-01-20",
      "delivery_date": "2024-01-25",
      "status": "Confirmed",
      "total_amount": 15000000,
      "items": [
        {
          "product_id": "PROD-001",
          "product_name": "Product A",
          "quantity": 10,
          "unit_price": 1000000,
          "total_price": 10000000
        }
      ],
      "created_at": "2024-01-20T10:30:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "pages": 3
}
```

#### POST /api/sales-orders
Create new sales order.

**Request:**
```json
{
  "customer_id": "CUST-001",
  "order_date": "2024-01-20",
  "delivery_date": "2024-01-25",
  "items": [
    {
      "product_id": "PROD-001",
      "quantity": 10,
      "unit_price": 1000000
    }
  ],
  "notes": "Urgent delivery required"
}
```

#### GET /api/sales-orders/{order_id}
Get specific sales order.

#### PUT /api/sales-orders/{order_id}
Update sales order.

#### DELETE /api/sales-orders/{order_id}
Delete sales order.

### Quotations

#### GET /api/quotations
Get list of quotations.

**Query Parameters:**
- `page` (int): Page number
- `limit` (int): Items per page
- `search` (string): Search term
- `status` (string): Quotation status
- `customer_id` (string): Filter by customer

**Response:**
```json
{
  "quotations": [
    {
      "id": "QUO-001",
      "quotation_number": "QUO-2024-001",
      "customer_id": "CUST-001",
      "customer_name": "PT. ABC Indonesia",
      "quotation_date": "2024-01-20",
      "valid_until": "2024-02-20",
      "status": "Sent",
      "total_amount": 15000000,
      "items": [
        {
          "product_id": "PROD-001",
          "product_name": "Product A",
          "quantity": 10,
          "unit_price": 1000000,
          "total_price": 10000000
        }
      ],
      "created_at": "2024-01-20T10:30:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "pages": 2
}
```

#### POST /api/quotations
Create new quotation.

#### GET /api/quotations/{quotation_id}
Get specific quotation.

#### PUT /api/quotations/{quotation_id}
Update quotation.

#### DELETE /api/quotations/{quotation_id}
Delete quotation.

## 🛍️ Purchase Management Endpoints

### Vendor Management

#### GET /api/vendors
Get list of vendors.

**Response:**
```json
{
  "vendors": [
    {
      "id": "VEND-001",
      "name": "PT. Supplier ABC",
      "contact_person": "John Supplier",
      "email": "john@supplier.com",
      "phone": "+62 21 1111 2222",
      "address": "Jl. Supplier No. 123",
      "city": "Jakarta",
      "type": "Supplier",
      "status": "Active",
      "payment_terms": "30 days",
      "credit_limit": 50000000,
      "rating": 4.5,
      "created_at": "2023-06-15"
    }
  ],
  "total": 20,
  "page": 1,
  "pages": 2
}
```

#### POST /api/vendors
Create new vendor.

#### GET /api/vendors/{vendor_id}
Get specific vendor.

#### PUT /api/vendors/{vendor_id}
Update vendor.

#### DELETE /api/vendors/{vendor_id}
Delete vendor.

### Purchase Orders

#### GET /api/purchase-orders
Get list of purchase orders.

**Response:**
```json
{
  "purchase_orders": [
    {
      "id": "PO-001",
      "order_number": "PO-2024-001",
      "vendor_id": "VEND-001",
      "vendor_name": "PT. Supplier ABC",
      "order_date": "2024-01-20",
      "delivery_date": "2024-01-25",
      "status": "Ordered",
      "total_amount": 10000000,
      "items": [
        {
          "product_id": "PROD-001",
          "product_name": "Raw Material A",
          "quantity": 100,
          "unit_price": 100000,
          "total_price": 10000000
        }
      ],
      "created_at": "2024-01-20T10:30:00Z"
    }
  ],
  "total": 30,
  "page": 1,
  "pages": 3
}
```

#### POST /api/purchase-orders
Create new purchase order.

#### GET /api/purchase-orders/{order_id}
Get specific purchase order.

#### PUT /api/purchase-orders/{order_id}
Update purchase order.

#### DELETE /api/purchase-orders/{order_id}
Delete purchase order.

## 📦 Inventory Management Endpoints

### Products

#### GET /api/products
Get list of products.

**Query Parameters:**
- `page` (int): Page number
- `limit` (int): Items per page
- `search` (string): Search term
- `category` (string): Product category
- `status` (string): Product status

**Response:**
```json
{
  "products": [
    {
      "id": "PROD-001",
      "sku": "SKU-001",
      "name": "Product A",
      "description": "High quality product",
      "category": "Electronics",
      "price": 1000000,
      "cost": 800000,
      "stock_quantity": 100,
      "min_stock": 10,
      "max_stock": 500,
      "status": "Active",
      "created_at": "2023-06-15"
    }
  ],
  "total": 200,
  "page": 1,
  "pages": 20
}
```

#### POST /api/products
Create new product.

#### GET /api/products/{product_id}
Get specific product.

#### PUT /api/products/{product_id}
Update product.

#### DELETE /api/products/{product_id}
Delete product.

### Stock Opname

#### GET /api/stock-opname
Get list of stock opnames.

**Response:**
```json
{
  "stock_opnames": [
    {
      "id": "OPN-001",
      "opname_number": "OPN-2024-001",
      "warehouse_id": "WH-001",
      "warehouse_name": "Main Warehouse",
      "opname_date": "2024-01-20",
      "status": "Completed",
      "items": [
        {
          "product_id": "PROD-001",
          "product_name": "Product A",
          "system_quantity": 100,
          "actual_quantity": 95,
          "variance": -5,
          "variance_amount": -500000
        }
      ],
      "total_variance": -500000,
      "created_at": "2024-01-20T10:30:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "pages": 1
}
```

#### POST /api/stock-opname
Create new stock opname.

#### GET /api/stock-opname/{opname_id}
Get specific stock opname.

#### PUT /api/stock-opname/{opname_id}
Update stock opname.

#### DELETE /api/stock-opname/{opname_id}
Delete stock opname.

### Transfer Stock

#### GET /api/transfer-stock
Get list of stock transfers.

**Response:**
```json
{
  "transfers": [
    {
      "id": "TRF-001",
      "transfer_number": "TRF-2024-001",
      "from_warehouse_id": "WH-001",
      "from_warehouse_name": "Main Warehouse",
      "to_warehouse_id": "WH-002",
      "to_warehouse_name": "Branch Warehouse",
      "transfer_date": "2024-01-20",
      "status": "Completed",
      "items": [
        {
          "product_id": "PROD-001",
          "product_name": "Product A",
          "quantity": 50,
          "unit_cost": 1000000
        }
      ],
      "total_cost": 50000000,
      "created_at": "2024-01-20T10:30:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "pages": 2
}
```

#### POST /api/transfer-stock
Create new stock transfer.

#### GET /api/transfer-stock/{transfer_id}
Get specific stock transfer.

#### PUT /api/transfer-stock/{transfer_id}
Update stock transfer.

#### DELETE /api/transfer-stock/{transfer_id}
Delete stock transfer.

## 🏭 Manufacturing Endpoints

### Production Orders

#### GET /api/production-orders
Get list of production orders.

**Response:**
```json
{
  "production_orders": [
    {
      "id": "PROD-001",
      "order_number": "PROD-2024-001",
      "product_id": "PROD-001",
      "product_name": "Finished Product A",
      "quantity": 100,
      "start_date": "2024-01-20",
      "end_date": "2024-01-25",
      "status": "In Progress",
      "workstation_id": "WS-001",
      "workstation_name": "Assembly Line 1",
      "worker_id": "WRK-001",
      "worker_name": "John Worker",
      "bom_items": [
        {
          "material_id": "MAT-001",
          "material_name": "Raw Material A",
          "quantity_required": 200,
          "quantity_used": 200
        }
      ],
      "created_at": "2024-01-20T10:30:00Z"
    }
  ],
  "total": 20,
  "page": 1,
  "pages": 2
}
```

#### POST /api/production-orders
Create new production order.

#### GET /api/production-orders/{order_id}
Get specific production order.

#### PUT /api/production-orders/{order_id}
Update production order.

#### DELETE /api/production-orders/{order_id}
Delete production order.

## 📢 Marketing Endpoints

### Marketing Campaigns

#### GET /api/campaigns
Get list of marketing campaigns.

**Response:**
```json
{
  "campaigns": [
    {
      "id": "CAMP-001",
      "name": "Summer Sale 2024",
      "description": "Summer promotion campaign",
      "start_date": "2024-06-01",
      "end_date": "2024-08-31",
      "status": "Active",
      "budget": 100000000,
      "spent": 25000000,
      "channels": ["Social Media", "Email", "TV"],
      "target_audience": "Young Adults",
      "roi": 2.5,
      "leads_generated": 500,
      "conversions": 50,
      "created_at": "2024-01-20T10:30:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "pages": 1
}
```

#### POST /api/campaigns
Create new marketing campaign.

#### GET /api/campaigns/{campaign_id}
Get specific marketing campaign.

#### PUT /api/campaigns/{campaign_id}
Update marketing campaign.

#### DELETE /api/campaigns/{campaign_id}
Delete marketing campaign.

## 🏪 Franchise Endpoints

### Franchise Partners

#### GET /api/franchise-partners
Get list of franchise partners.

**Response:**
```json
{
  "franchise_partners": [
    {
      "id": "FRAN-001",
      "name": "Franchise Partner A",
      "contact_person": "John Partner",
      "email": "john@franchise.com",
      "phone": "+62 21 3333 4444",
      "address": "Jl. Franchise No. 123",
      "city": "Jakarta",
      "territory": "Jakarta Pusat",
      "status": "Active",
      "start_date": "2023-01-01",
      "royalty_rate": 5.0,
      "monthly_sales": 50000000,
      "royalty_amount": 2500000,
      "performance_rating": 4.5,
      "created_at": "2023-01-01T10:30:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "pages": 3
}
```

#### POST /api/franchise-partners
Create new franchise partner.

#### GET /api/franchise-partners/{partner_id}
Get specific franchise partner.

#### PUT /api/franchise-partners/{partner_id}
Update franchise partner.

#### DELETE /api/franchise-partners/{partner_id}
Delete franchise partner.

## 💰 Accounting Endpoints

### Chart of Accounts

#### GET /api/chart-of-accounts
Get list of chart of accounts.

**Response:**
```json
{
  "accounts": [
    {
      "id": "ACC-001",
      "account_code": "1000",
      "account_name": "Cash",
      "account_type": "Asset",
      "parent_account": null,
      "level": 1,
      "normal_balance": "Debit",
      "status": "Active",
      "created_at": "2023-06-15"
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 10
}
```

#### POST /api/chart-of-accounts
Create new chart of account.

#### GET /api/chart-of-accounts/{account_id}
Get specific chart of account.

#### PUT /api/chart-of-accounts/{account_id}
Update chart of account.

#### DELETE /api/chart-of-accounts/{account_id}
Delete chart of account.

### General Journal

#### GET /api/journal-entries
Get list of journal entries.

**Response:**
```json
{
  "journal_entries": [
    {
      "id": "JE-001",
      "entry_number": "JE-2024-001",
      "entry_date": "2024-01-20",
      "description": "Sales transaction",
      "status": "Posted",
      "entries": [
        {
          "account_id": "ACC-001",
          "account_name": "Cash",
          "debit": 1000000,
          "credit": 0
        },
        {
          "account_id": "ACC-002",
          "account_name": "Sales Revenue",
          "debit": 0,
          "credit": 1000000
        }
      ],
      "total_debit": 1000000,
      "total_credit": 1000000,
      "created_at": "2024-01-20T10:30:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "pages": 5
}
```

#### POST /api/journal-entries
Create new journal entry.

#### GET /api/journal-entries/{entry_id}
Get specific journal entry.

#### PUT /api/journal-entries/{entry_id}
Update journal entry.

#### DELETE /api/journal-entries/{entry_id}
Delete journal entry.

## 📊 Reports Endpoints

### GET /api/reports/balance-sheet
Get balance sheet report.

**Query Parameters:**
- `date` (string): Report date (YYYY-MM-DD)
- `format` (string): Report format (json, pdf, excel)

**Response:**
```json
{
  "report_date": "2024-01-20",
  "assets": {
    "current_assets": 500000000,
    "fixed_assets": 1000000000,
    "total_assets": 1500000000
  },
  "liabilities": {
    "current_liabilities": 200000000,
    "long_term_liabilities": 300000000,
    "total_liabilities": 500000000
  },
  "equity": {
    "total_equity": 1000000000
  }
}
```

### GET /api/reports/profit-loss
Get profit and loss statement.

**Query Parameters:**
- `start_date` (string): Start date (YYYY-MM-DD)
- `end_date` (string): End date (YYYY-MM-DD)
- `format` (string): Report format (json, pdf, excel)

### GET /api/reports/cash-flow
Get cash flow statement.

### GET /api/reports/aging-report
Get aging report.

## 🔧 System Endpoints

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00Z",
  "version": "2.0.0",
  "database": "connected",
  "uptime": 3600
}
```

### GET /api/settings
Get system settings.

**Response:**
```json
{
  "general": {
    "company_name": "ZONE v.2",
    "currency": "IDR",
    "timezone": "Asia/Jakarta"
  },
  "database": {
    "host": "localhost",
    "port": 27017,
    "name": "zone_db"
  },
  "email": {
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587
  }
}
```

### PUT /api/settings
Update system settings.

## 📝 Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## 🔒 Rate Limiting

### Rate Limits
- **Authentication**: 5 requests per minute
- **General API**: 100 requests per minute
- **Reports**: 10 requests per minute

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 📚 API Examples

### Complete Workflow Example

#### 1. Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'
```

#### 2. Create Customer
```bash
curl -X POST http://localhost:8000/api/customers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "PT. New Customer",
    "contact_person": "John Doe",
    "email": "john@newcustomer.com",
    "phone": "+62 21 1234 5678",
    "type": "Corporate"
  }'
```

#### 3. Create Sales Order
```bash
curl -X POST http://localhost:8000/api/sales-orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST-001",
    "order_date": "2024-01-20",
    "items": [
      {
        "product_id": "PROD-001",
        "quantity": 10,
        "unit_price": 1000000
      }
    ]
  }'
```

## 🧪 Testing

### API Testing

#### Health Check
```bash
curl http://localhost:8000/api/health
```

#### Authentication Test
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "password": "test"}'
```

#### CRUD Test
```bash
# Create
curl -X POST http://localhost:8000/api/customers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Customer"}'

# Read
curl -X GET http://localhost:8000/api/customers \
  -H "Authorization: Bearer <token>"

# Update
curl -X PUT http://localhost:8000/api/customers/{id} \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Customer"}'

# Delete
curl -X DELETE http://localhost:8000/api/customers/{id} \
  -H "Authorization: Bearer <token>"
```

---

**ZONE v.2 API** - Complete Business Management API
*Built with FastAPI for modern applications*

---

*This API documentation is regularly updated to reflect current endpoints and features.*











