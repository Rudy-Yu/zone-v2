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


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


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
