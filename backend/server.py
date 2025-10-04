from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
import uuid
from datetime import datetime, timedelta
from pdf_generator import PDFGenerator
import tempfile
import os


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'zone_db')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test endpoint
@app.get("/")
async def root():
    return {"message": "ZONE v.2 API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Include the router in the app
app.include_router(api_router)


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Dashboard Models
class DashboardStats(BaseModel):
    total_revenue: float
    total_expense: float
    pending_invoices: int
    total_products: int
    revenue_change: float
    expense_change: float
    invoice_change: int
    product_change: int

class Transaction(BaseModel):
    id: str
    type: str  # "Invoice", "Purchase", "Payment"
    customer: str
    amount: str
    status: str  # "Paid", "Pending", "Overdue"
    date: str

class ChartDataPoint(BaseModel):
    month: str
    revenue: float
    expense: float

class DashboardData(BaseModel):
    stats: DashboardStats
    recent_transactions: List[Transaction]
    cash_flow_data: List[ChartDataPoint]

# Sales Models
class Customer(BaseModel):
    id: str
    name: str
    contact_person: str
    email: str
    phone: str
    address: str
    city: str
    type: str  # Corporate, Retail, Individual
    status: str  # Active, Inactive, Suspended
    credit_limit: float
    total_purchases: float
    last_purchase: Optional[str]
    created_at: str

class CustomerCreate(BaseModel):
    name: str
    contact_person: str
    email: str
    phone: str
    address: str
    city: str
    type: str = "Corporate"
    credit_limit: float = 0

class SalesInvoice(BaseModel):
    id: str
    customer_id: str
    customer_name: str
    invoice_date: str
    due_date: str
    amount: float
    status: str  # Paid, Pending, Overdue, Draft
    items: List[Dict]
    created_by: str
    created_at: str

class SalesInvoiceCreate(BaseModel):
    customer_id: str
    invoice_date: str
    due_date: str
    items: List[Dict]
    notes: Optional[str] = ""

class SalesOrder(BaseModel):
    id: str
    order_number: str
    customer_id: str
    customer_name: str
    order_date: str
    delivery_date: str
    status: str  # Draft, Confirmed, Processing, Shipped, Delivered, Cancelled
    total_amount: float
    items: List[Dict]
    created_by: str
    notes: Optional[str] = ""
    created_at: str

class SalesOrderCreate(BaseModel):
    customer_id: str
    customer_name: str
    order_date: str
    delivery_date: str
    items: List[Dict]
    notes: Optional[str] = ""

class Quotation(BaseModel):
    id: str
    quotation_number: str
    customer_id: str
    customer_name: str
    quotation_date: str
    valid_until: str
    status: str  # Draft, Sent, Accepted, Rejected, Expired
    total_amount: float
    items: List[Dict]
    created_by: str
    notes: Optional[str] = ""
    created_at: str
    sent_date: Optional[str] = None
    accepted_date: Optional[str] = None

class QuotationCreate(BaseModel):
    customer_id: str
    customer_name: str
    quotation_date: str
    valid_until: str
    items: List[Dict]
    notes: Optional[str] = ""

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Dashboard Endpoints
@api_router.get("/dashboard", response_model=DashboardData)
async def get_dashboard_data():
    """Get dashboard statistics and recent transactions"""
    
    # Mock data for now - in production, this would come from actual database queries
    # Calculate stats based on invoices, purchases, products, etc.
    
    stats = DashboardStats(
        total_revenue=194258000.0,
        total_expense=82450000.0,
        pending_invoices=23,
        total_products=1234,
        revenue_change=12.5,  # percentage
        expense_change=-3.2,  # percentage
        invoice_change=5,     # count change
        product_change=-12    # count change
    )
    
    recent_transactions = [
        Transaction(
            id="INV-001",
            type="Invoice",
            customer="PT. ABC Indonesia",
            amount="Rp 15.000.000",
            status="Paid",
            date="2024-01-20"
        ),
        Transaction(
            id="INV-002",
            type="Invoice",
            customer="CV. XYZ Trading",
            amount="Rp 8.500.000",
            status="Pending",
            date="2024-01-19"
        ),
        Transaction(
            id="PO-003",
            type="Purchase",
            customer="Supplier Materials",
            amount="Rp 12.300.000",
            status="Paid",
            date="2024-01-18"
        ),
        Transaction(
            id="INV-004",
            type="Invoice",
            customer="PT. DEF Corp",
            amount="Rp 22.100.000",
            status="Overdue",
            date="2024-01-15"
        )
    ]
    
    # Cash flow chart data for last 6 months
    cash_flow_data = [
        ChartDataPoint(month="Agustus", revenue=150000000, expense=80000000),
        ChartDataPoint(month="September", revenue=180000000, expense=90000000),
        ChartDataPoint(month="Oktober", revenue=165000000, expense=75000000),
        ChartDataPoint(month="November", revenue=200000000, expense=95000000),
        ChartDataPoint(month="Desember", revenue=220000000, expense=100000000),
        ChartDataPoint(month="Januari", revenue=194258000, expense=82450000)
    ]
    
    return DashboardData(
        stats=stats,
        recent_transactions=recent_transactions,
        cash_flow_data=cash_flow_data
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# =============================
# Settings persistence endpoints
# =============================

SETTINGS_DOC_ID = "system_settings"


class SettingsPayload(BaseModel):
    general: Dict[str, Any]
    database: Dict[str, Any]
    email: Dict[str, Any]
    notifications: Dict[str, Any]
    security: Dict[str, Any]
    appearance: Dict[str, Any]


DEFAULT_SETTINGS: SettingsPayload = SettingsPayload(
    general={
        "companyName": "ZONE v.2",
        "companyAddress": "Jl. Industri No. 123, Jakarta Pusat",
        "companyPhone": "+62 21 1234 5678",
        "companyEmail": "info@zone.com",
        "companyWebsite": "www.zone.com",
        "taxNumber": "123456789012345",
        "currency": "IDR",
        "timezone": "Asia/Jakarta",
        "dateFormat": "DD/MM/YYYY",
        "timeFormat": "24h",
    },
    database={
        "dbHost": "localhost",
        "dbPort": "27017",
        "dbName": "zone_db",
        "backupFrequency": "daily",
        "lastBackup": "",
        "autoBackup": True,
        "backupRetention": "30",
    },
    email={
        "smtpHost": "smtp.gmail.com",
        "smtpPort": "587",
        "smtpUsername": "noreply@zone.com",
        "smtpPassword": "",
        "smtpEncryption": "TLS",
        "fromName": "ZONE System",
        "fromEmail": "noreply@zone.com",
    },
    notifications={
        "emailNotifications": True,
        "smsNotifications": False,
        "pushNotifications": True,
        "lowStockAlert": True,
        "paymentReminder": True,
        "systemMaintenance": True,
        "newUserAlert": True,
        "orderStatusUpdate": True,
    },
    security={
        "sessionTimeout": "30",
        "passwordMinLength": "8",
        "requireSpecialChars": True,
        "requireNumbers": True,
        "requireUppercase": True,
        "maxLoginAttempts": "5",
        "lockoutDuration": "15",
        "twoFactorAuth": False,
        "ipWhitelist": "",
        "auditLog": True,
    },
    appearance={
        "theme": "light",
        "primaryColor": "#ef4444",
        "secondaryColor": "#64748b",
        "sidebarCollapsed": False,
        "showNotifications": True,
        "showQuickActions": True,
        "defaultPageSize": "25",
        "autoRefresh": True,
        "refreshInterval": "30",
    },
)


@api_router.get("/settings", response_model=SettingsPayload)
async def get_settings():
    doc = await db.settings.find_one({"_id": SETTINGS_DOC_ID})
    if not doc:
        # Seed default settings
        payload = DEFAULT_SETTINGS.dict()
        await db.settings.replace_one(
            {"_id": SETTINGS_DOC_ID}, {"_id": SETTINGS_DOC_ID, **payload}, upsert=True
        )
        return DEFAULT_SETTINGS
    # remove _id before constructing model
    doc.pop("_id", None)
    return SettingsPayload(**doc)


@api_router.put("/settings", response_model=SettingsPayload)
async def put_settings(payload: SettingsPayload):
    await db.settings.replace_one(
        {"_id": SETTINGS_DOC_ID}, {"_id": SETTINGS_DOC_ID, **payload.dict()}, upsert=True
    )
    return payload


@api_router.post("/settings/backup")
async def backup_settings():
    # Mock backup: copy current settings to backups collection with timestamp
    doc = await db.settings.find_one({"_id": SETTINGS_DOC_ID})
    if not doc:
        doc = {"_id": SETTINGS_DOC_ID, **DEFAULT_SETTINGS.dict()}
    backup_doc = {"createdAt": datetime.utcnow(), "settings": doc}
    result = await db.settings_backups.insert_one(backup_doc)
    return {"message": "Backup created", "backup_id": str(result.inserted_id)}


@api_router.post("/settings/restore")
async def restore_settings():
    # Mock restore: restore most recent backup if exists
    latest = await db.settings_backups.find().sort("createdAt", -1).limit(1).to_list(1)
    if not latest:
        raise HTTPException(status_code=404, detail="No backups found")
    settings_doc = latest[0]["settings"]
    # Ensure correct _id
    settings_doc["_id"] = SETTINGS_DOC_ID
    await db.settings.replace_one({"_id": SETTINGS_DOC_ID}, settings_doc, upsert=True)
    return {"message": "Settings restored", "restored_at": datetime.utcnow()}


# =============================
# Fast Input Support Endpoints
# =============================

@api_router.get("/customers/search")
async def search_customers(q: str = ""):
    """Search customers for autocomplete"""
    if not q:
        return []
    
    # Mock customer data for search
    customers = [
        {"id": "CUST-001", "name": "PT. ABC Indonesia", "email": "john@abcindonesia.com"},
        {"id": "CUST-002", "name": "CV. XYZ Trading", "email": "jane@xyztrading.com"},
        {"id": "CUST-003", "name": "Toko Maju Jaya", "email": "bob@majujaya.com"},
        {"id": "CUST-004", "name": "PT. DEF Corp", "email": "alice@defcorp.com"},
    ]
    
    # Filter customers based on search query
    filtered = [
        customer for customer in customers
        if q.lower() in customer["name"].lower() or q.lower() in customer["email"].lower()
    ]
    
    return filtered[:10]  # Limit to 10 results

@api_router.get("/products/search")
async def search_products(q: str = ""):
    """Search products for autocomplete"""
    if not q:
        return []
    
    # Mock product data for search
    products = [
        {"id": "PROD-001", "name": "Product A", "sku": "PA001", "price": 100000},
        {"id": "PROD-002", "name": "Product B", "sku": "PB002", "price": 200000},
        {"id": "PROD-003", "name": "Product C", "sku": "PC003", "price": 300000},
    ]
    
    # Filter products based on search query
    filtered = [
        product for product in products
        if q.lower() in product["name"].lower() or q.lower() in product["sku"].lower()
    ]
    
    return filtered[:10]  # Limit to 10 results

@api_router.get("/vendors/search")
async def search_vendors(q: str = ""):
    """Search vendors for autocomplete"""
    if not q:
        return []
    
    # Mock vendor data for search
    vendors = [
        {"id": "VEND-001", "name": "Supplier A", "contact": "supplier-a@email.com"},
        {"id": "VEND-002", "name": "Supplier B", "contact": "supplier-b@email.com"},
        {"id": "VEND-003", "name": "Supplier C", "contact": "supplier-c@email.com"},
    ]
    
    # Filter vendors based on search query
    filtered = [
        vendor for vendor in vendors
        if q.lower() in vendor["name"].lower() or q.lower() in vendor["contact"].lower()
    ]
    
    return filtered[:10]  # Limit to 10 results

@api_router.get("/customers/{customer_id}")
async def get_customer_by_id(customer_id: str):
    """Get customer details for auto-fill"""
    # Mock customer data
    customers = {
        "CUST-001": {
            "id": "CUST-001",
            "name": "PT. ABC Indonesia",
            "contactPerson": "John Doe",
            "email": "john@abcindonesia.com",
            "phone": "+62 21 1234 5678",
            "address": "Jl. Sudirman No. 123, Jakarta Pusat",
            "city": "Jakarta",
            "type": "Corporate",
            "creditLimit": 100000000
        },
        "CUST-002": {
            "id": "CUST-002",
            "name": "CV. XYZ Trading",
            "contactPerson": "Jane Smith",
            "email": "jane@xyztrading.com",
            "phone": "+62 31 9876 5432",
            "address": "Jl. Thamrin No. 456, Surabaya",
            "city": "Surabaya",
            "type": "Corporate",
            "creditLimit": 50000000
        }
    }
    
    customer = customers.get(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    return customer

@api_router.get("/products/{product_id}")
async def get_product_by_id(product_id: str):
    """Get product details for auto-fill"""
    # Mock product data
    products = {
        "PROD-001": {
            "id": "PROD-001",
            "name": "Product A",
            "sku": "PA001",
            "price": 100000,
            "description": "High quality product A",
            "category": "Electronics",
            "stock": 50
        },
        "PROD-002": {
            "id": "PROD-002",
            "name": "Product B",
            "sku": "PB002",
            "price": 200000,
            "description": "Premium product B",
            "category": "Accessories",
            "stock": 25
        }
    }
    
    product = products.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product

# Sales API Endpoints

# Customer Endpoints
@api_router.get("/customers", response_model=List[Customer])
async def get_customers():
    """Get all customers"""
    # Mock data for now - in production, this would come from database
    customers = [
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
        },
        {
            "id": "CUST-002",
            "name": "CV. XYZ Trading",
            "contact_person": "Jane Smith",
            "email": "jane@xyztrading.com",
            "phone": "+62 31 9876 5432",
            "address": "Jl. Thamrin No. 456, Surabaya",
            "city": "Surabaya",
            "type": "Corporate",
            "status": "Active",
            "credit_limit": 50000000,
            "total_purchases": 28000000,
            "last_purchase": "2024-01-10",
            "created_at": "2023-08-20"
        },
        {
            "id": "CUST-003",
            "name": "Toko Maju Jaya",
            "contact_person": "Bob Wilson",
            "email": "bob@majujaya.com",
            "phone": "+62 22 5555 7777",
            "address": "Jl. Asia Afrika No. 789, Bandung",
            "city": "Bandung",
            "type": "Retail",
            "status": "Active",
            "credit_limit": 25000000,
            "total_purchases": 15000000,
            "last_purchase": "2024-01-12",
            "created_at": "2023-09-10"
        }
    ]
    return customers

@api_router.post("/customers", response_model=Customer)
async def create_customer(customer: CustomerCreate):
    """Create a new customer"""
    new_customer = Customer(
        id=f"CUST-{str(uuid.uuid4())[:8].upper()}",
        name=customer.name,
        contact_person=customer.contact_person,
        email=customer.email,
        phone=customer.phone,
        address=customer.address,
        city=customer.city,
        type=customer.type,
        status="Active",
        credit_limit=customer.credit_limit,
        total_purchases=0,
        last_purchase=None,
        created_at=datetime.utcnow().isoformat()
    )
    # In production, save to database
    return new_customer

@api_router.get("/customers/{customer_id}", response_model=Customer)
async def get_customer(customer_id: str):
    """Get customer by ID"""
    # Mock data - in production, fetch from database
    customers = {
        "CUST-001": {
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
    }
    
    customer = customers.get(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    return customer

@api_router.put("/customers/{customer_id}", response_model=Customer)
async def update_customer(customer_id: str, customer: CustomerCreate):
    """Update customer"""
    # In production, update in database
    updated_customer = Customer(
        id=customer_id,
        name=customer.name,
        contact_person=customer.contact_person,
        email=customer.email,
        phone=customer.phone,
        address=customer.address,
        city=customer.city,
        type=customer.type,
        status="Active",
        credit_limit=customer.credit_limit,
        total_purchases=0,
        last_purchase=None,
        created_at=datetime.utcnow().isoformat()
    )
    return updated_customer

@api_router.delete("/customers/{customer_id}")
async def delete_customer(customer_id: str):
    """Delete customer"""
    # In production, delete from database
    return {"message": "Customer deleted successfully"}

# Sales Invoice Endpoints
@api_router.get("/sales-invoices", response_model=List[SalesInvoice])
async def get_sales_invoices():
    """Get all sales invoices"""
    # Mock data for now - in production, this would come from database
    invoices = [
        {
            "id": "INV-001",
            "customer_id": "CUST-001",
            "customer_name": "PT. ABC Indonesia",
            "invoice_date": "2024-01-20",
            "due_date": "2024-02-19",
            "amount": 15000000,
            "status": "Paid",
            "items": [
                {"product_id": "PRD-001", "product_name": "Laptop Gaming", "quantity": 1, "unit_price": 15000000, "total": 15000000}
            ],
            "created_by": "John Sales",
            "created_at": "2024-01-20 10:30:00"
        },
        {
            "id": "INV-002",
            "customer_id": "CUST-002",
            "customer_name": "CV. XYZ Trading",
            "invoice_date": "2024-01-19",
            "due_date": "2024-02-18",
            "amount": 8500000,
            "status": "Pending",
            "items": [
                {"product_id": "PRD-002", "product_name": "Mouse Wireless", "quantity": 5, "unit_price": 250000, "total": 1250000},
                {"product_id": "PRD-003", "product_name": "Keyboard Mechanical", "quantity": 3, "unit_price": 1200000, "total": 3600000}
            ],
            "created_by": "Jane Sales",
            "created_at": "2024-01-19 14:15:00"
        },
        {
            "id": "INV-003",
            "customer_id": "CUST-003",
            "customer_name": "Toko Maju Jaya",
            "invoice_date": "2024-01-18",
            "due_date": "2024-02-17",
            "amount": 22100000,
            "status": "Overdue",
            "items": [
                {"product_id": "PRD-001", "product_name": "Laptop Gaming", "quantity": 1, "unit_price": 15000000, "total": 15000000},
                {"product_id": "PRD-004", "product_name": "Monitor 27\"", "quantity": 2, "unit_price": 3500000, "total": 7000000}
            ],
            "created_by": "Bob Sales",
            "created_at": "2024-01-18 09:45:00"
        }
    ]
    return invoices

@api_router.post("/sales-invoices", response_model=SalesInvoice)
async def create_sales_invoice(invoice: SalesInvoiceCreate):
    """Create a new sales invoice"""
    new_invoice = SalesInvoice(
        id=f"INV-{str(uuid.uuid4())[:8].upper()}",
        customer_id=invoice.customer_id,
        customer_name="",  # Will be populated from customer data
        invoice_date=invoice.invoice_date,
        due_date=invoice.due_date,
        amount=sum(item.get('total', 0) for item in invoice.items),
        status="Draft",
        items=invoice.items,
        created_by="Current User",
        created_at=datetime.utcnow().isoformat()
    )
    # In production, save to database
    return new_invoice

@api_router.get("/sales-invoices/{invoice_id}", response_model=SalesInvoice)
async def get_sales_invoice(invoice_id: str):
    """Get sales invoice by ID"""
    # Mock data - in production, fetch from database
    invoices = {
        "INV-001": {
            "id": "INV-001",
            "customer_id": "CUST-001",
            "customer_name": "PT. ABC Indonesia",
            "invoice_date": "2024-01-20",
            "due_date": "2024-02-19",
            "amount": 15000000,
            "status": "Paid",
            "items": [
                {"product_id": "PRD-001", "product_name": "Laptop Gaming", "quantity": 1, "unit_price": 15000000, "total": 15000000}
            ],
            "created_by": "John Sales",
            "created_at": "2024-01-20 10:30:00"
        }
    }
    
    invoice = invoices.get(invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Sales invoice not found")
    
    return invoice

@api_router.put("/sales-invoices/{invoice_id}", response_model=SalesInvoice)
async def update_sales_invoice(invoice_id: str, invoice: SalesInvoiceCreate):
    """Update sales invoice"""
    # In production, update in database
    updated_invoice = SalesInvoice(
        id=invoice_id,
        customer_id=invoice.customer_id,
        customer_name="",  # Will be populated from customer data
        invoice_date=invoice.invoice_date,
        due_date=invoice.due_date,
        amount=sum(item.get('total', 0) for item in invoice.items),
        status="Draft",
        items=invoice.items,
        created_by="Current User",
        created_at=datetime.utcnow().isoformat()
    )
    return updated_invoice

@api_router.delete("/sales-invoices/{invoice_id}")
async def delete_sales_invoice(invoice_id: str):
    """Delete sales invoice"""
    # In production, delete from database
    return {"message": "Sales invoice deleted successfully"}

# Sales Order Endpoints
@api_router.get("/sales-orders", response_model=List[SalesOrder])
async def get_sales_orders():
    """Get all sales orders"""
    # Mock data for now - in production, this would come from database
    orders = [
        {
            "id": "SO-001",
            "order_number": "SO-2024-001",
            "customer_id": "CUST-001",
            "customer_name": "PT. ABC Indonesia",
            "order_date": "2024-01-20",
            "delivery_date": "2024-01-25",
            "status": "Confirmed",
            "total_amount": 45000000,
            "items": [
                {"product_id": "PRD-001", "product_name": "Laptop Gaming", "quantity": 2, "unit_price": 15000000, "total": 30000000},
                {"product_id": "PRD-002", "product_name": "Mouse Wireless", "quantity": 5, "unit_price": 250000, "total": 1250000}
            ],
            "created_by": "John Sales",
            "notes": "Priority delivery required",
            "created_at": "2024-01-20 10:30:00"
        },
        {
            "id": "SO-002",
            "order_number": "SO-2024-002",
            "customer_id": "CUST-002",
            "customer_name": "CV. XYZ Trading",
            "order_date": "2024-01-19",
            "delivery_date": "2024-01-24",
            "status": "Processing",
            "total_amount": 28000000,
            "items": [
                {"product_id": "PRD-003", "product_name": "Keyboard Mechanical", "quantity": 10, "unit_price": 1200000, "total": 12000000},
                {"product_id": "PRD-004", "product_name": "Monitor 27\"", "quantity": 8, "unit_price": 2000000, "total": 16000000}
            ],
            "created_by": "Jane Sales",
            "notes": "Standard delivery",
            "created_at": "2024-01-19 14:15:00"
        }
    ]
    return orders

@api_router.post("/sales-orders", response_model=SalesOrder)
async def create_sales_order(order: SalesOrderCreate):
    """Create a new sales order"""
    new_order = SalesOrder(
        id=f"SO-{str(uuid.uuid4())[:8].upper()}",
        order_number=f"SO-2024-{str(uuid.uuid4())[:8].upper()}",
        customer_id=order.customer_id,
        customer_name=order.customer_name,
        order_date=order.order_date,
        delivery_date=order.delivery_date,
        status="Draft",
        total_amount=sum(item.get('total', 0) for item in order.items),
        items=order.items,
        created_by="Current User",
        notes=order.notes,
        created_at=datetime.utcnow().isoformat()
    )
    # In production, save to database
    return new_order

# Quotation Endpoints
@api_router.get("/quotations", response_model=List[Quotation])
async def get_quotations():
    """Get all quotations"""
    # Mock data for now - in production, this would come from database
    quotations = [
        {
            "id": "QUO-001",
            "quotation_number": "QUO-2024-001",
            "customer_id": "CUST-001",
            "customer_name": "PT. ABC Indonesia",
            "quotation_date": "2024-01-20",
            "valid_until": "2024-02-20",
            "status": "Sent",
            "total_amount": 45000000,
            "items": [
                {"product_id": "PRD-001", "product_name": "Laptop Gaming", "quantity": 2, "unit_price": 15000000, "total": 30000000},
                {"product_id": "PRD-002", "product_name": "Mouse Wireless", "quantity": 5, "unit_price": 250000, "total": 1250000}
            ],
            "created_by": "John Sales",
            "notes": "Valid for 30 days",
            "created_at": "2024-01-20 10:30:00",
            "sent_date": "2024-01-20 14:00:00"
        },
        {
            "id": "QUO-002",
            "quotation_number": "QUO-2024-002",
            "customer_id": "CUST-002",
            "customer_name": "CV. XYZ Trading",
            "quotation_date": "2024-01-19",
            "valid_until": "2024-02-19",
            "status": "Accepted",
            "total_amount": 28000000,
            "items": [
                {"product_id": "PRD-003", "product_name": "Keyboard Mechanical", "quantity": 10, "unit_price": 1200000, "total": 12000000},
                {"product_id": "PRD-004", "product_name": "Monitor 27\"", "quantity": 8, "unit_price": 2000000, "total": 16000000}
            ],
            "created_by": "Jane Sales",
            "notes": "Accepted by customer",
            "created_at": "2024-01-19 14:15:00",
            "sent_date": "2024-01-19 16:30:00",
            "accepted_date": "2024-01-21 09:15:00"
        }
    ]
    return quotations

@api_router.post("/quotations", response_model=Quotation)
async def create_quotation(quotation: QuotationCreate):
    """Create a new quotation"""
    new_quotation = Quotation(
        id=f"QUO-{str(uuid.uuid4())[:8].upper()}",
        quotation_number=f"QUO-2024-{str(uuid.uuid4())[:8].upper()}",
        customer_id=quotation.customer_id,
        customer_name=quotation.customer_name,
        quotation_date=quotation.quotation_date,
        valid_until=quotation.valid_until,
        status="Draft",
        total_amount=sum(item.get('total', 0) for item in quotation.items),
        items=quotation.items,
        created_by="Current User",
        notes=quotation.notes,
        created_at=datetime.utcnow().isoformat()
    )
    # In production, save to database
    return new_quotation

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
