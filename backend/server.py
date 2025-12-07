from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
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

# Import database and auth utilities
from database import (
    create_document, get_document, get_documents, 
    update_document, delete_document, count_documents, find_one_document, db
)
from auth import (
    verify_password, get_password_hash, create_access_token, 
    verify_token, get_current_user
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection (kept for backward compatibility)
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'zone_db')
client = AsyncIOMotorClient(mongo_url)

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
    
    try:
        # Search in database using regex (case insensitive)
        from bson.regex import Regex
        filter_dict = {
            "$or": [
                {"name": Regex(q, "i")},
                {"email": Regex(q, "i")}
            ]
        }
        customers_data = await get_documents("customers", filter_dict, limit=10)
        
        # Format for autocomplete
        results = []
        for cust in customers_data:
            results.append({
                "id": cust.get("id", ""),
                "name": cust.get("name", ""),
                "email": cust.get("email", "")
            })
        
        return results
    except Exception as e:
        logging.error(f"Error searching customers: {str(e)}")
        return []

@api_router.get("/products/search")
async def search_products(q: str = ""):
    """Search products for autocomplete"""
    if not q:
        return []
    
    try:
        # Search in database using regex (case insensitive)
        from bson.regex import Regex
        filter_dict = {
            "$or": [
                {"name": Regex(q, "i")},
                {"sku": Regex(q, "i")}
            ]
        }
        products_data = await get_documents("products", filter_dict, limit=10)
        
        # Format for autocomplete
        results = []
        for prod in products_data:
            results.append({
                "id": prod.get("id", ""),
                "name": prod.get("name", ""),
                "sku": prod.get("sku", ""),
                "price": prod.get("price", 0)
            })
        
        return results
    except Exception as e:
        logging.error(f"Error searching products: {str(e)}")
        return []

@api_router.get("/vendors/search")
async def search_vendors(q: str = ""):
    """Search vendors for autocomplete"""
    if not q:
        return []
    
    try:
        # Search in database using regex (case insensitive)
        from bson.regex import Regex
        filter_dict = {
            "$or": [
                {"name": Regex(q, "i")},
                {"email": Regex(q, "i")},
                {"contact_person": Regex(q, "i")}
            ]
        }
        vendors_data = await get_documents("vendors", filter_dict, limit=10)
        
        # Format for autocomplete
        results = []
        for vend in vendors_data:
            results.append({
                "id": vend.get("id", ""),
                "name": vend.get("name", ""),
                "contact": vend.get("email", "") or vend.get("contact_person", "")
            })
        
        return results
    except Exception as e:
        logging.error(f"Error searching vendors: {str(e)}")
        return []

@api_router.get("/customers/{customer_id}")
async def get_customer_by_id(customer_id: str):
    """Get customer details for auto-fill"""
    try:
        customer = await get_document("customers", customer_id)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        # Return in format expected by frontend
        return {
            "id": customer.get("id", ""),
            "name": customer.get("name", ""),
            "contactPerson": customer.get("contact_person", ""),
            "email": customer.get("email", ""),
            "phone": customer.get("phone", ""),
            "address": customer.get("address", ""),
            "city": customer.get("city", ""),
            "type": customer.get("type", "Corporate"),
            "creditLimit": customer.get("credit_limit", 0)
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching customer: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching customer: {str(e)}")

@api_router.get("/products/{product_id}")
async def get_product_by_id(product_id: str):
    """Get product details for auto-fill"""
    try:
        product = await get_document("products", product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Return in format expected by frontend
        return {
            "id": product.get("id", ""),
            "name": product.get("name", ""),
            "sku": product.get("sku", ""),
            "price": product.get("price", 0),
            "description": product.get("description", ""),
            "category": product.get("category", ""),
            "stock": product.get("stock", 0)
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching product: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching product: {str(e)}")

# Sales API Endpoints

# Customer Endpoints
@api_router.get("/customers", response_model=List[Customer])
async def get_customers():
    """Get all customers"""
    try:
        customers_data = await get_documents("customers", sort=[("created_at", -1)])
        
        # Convert to Customer model format
        customers = []
        for cust in customers_data:
            customers.append({
                "id": cust.get("id", ""),
                "name": cust.get("name", ""),
                "contact_person": cust.get("contact_person", ""),
                "email": cust.get("email", ""),
                "phone": cust.get("phone", ""),
                "address": cust.get("address", ""),
                "city": cust.get("city", ""),
                "type": cust.get("type", "Corporate"),
                "status": cust.get("status", "Active"),
                "credit_limit": cust.get("credit_limit", 0),
                "total_purchases": cust.get("total_purchases", 0),
                "last_purchase": cust.get("last_purchase"),
                "created_at": cust.get("created_at", datetime.utcnow()).isoformat() if isinstance(cust.get("created_at"), datetime) else cust.get("created_at", "")
            })
        
        return customers
    except Exception as e:
        logging.error(f"Error fetching customers: {str(e)}")
        # Fallback to empty list on error
        return []

@api_router.post("/customers", response_model=Customer)
async def create_customer(customer: CustomerCreate):
    """Create a new customer"""
    try:
        # Check if email already exists
        existing = await find_one_document("customers", {"email": customer.email})
        if existing:
            raise HTTPException(status_code=400, detail="Customer with this email already exists")
        
        # Prepare customer data
        customer_data = {
            "name": customer.name,
            "contact_person": customer.contact_person,
            "email": customer.email,
            "phone": customer.phone,
            "address": customer.address,
            "city": customer.city,
            "type": customer.type,
            "status": "Active",
            "credit_limit": customer.credit_limit,
            "total_purchases": 0,
            "last_purchase": None
        }
        
        # Save to database
        created_customer = await create_document("customers", customer_data)
        
        # Return in Customer model format
        return Customer(
            id=created_customer.get("id", ""),
            name=created_customer.get("name", ""),
            contact_person=created_customer.get("contact_person", ""),
            email=created_customer.get("email", ""),
            phone=created_customer.get("phone", ""),
            address=created_customer.get("address", ""),
            city=created_customer.get("city", ""),
            type=created_customer.get("type", "Corporate"),
            status=created_customer.get("status", "Active"),
            credit_limit=created_customer.get("credit_limit", 0),
            total_purchases=created_customer.get("total_purchases", 0),
            last_purchase=created_customer.get("last_purchase"),
            created_at=created_customer.get("created_at", datetime.utcnow()).isoformat() if isinstance(created_customer.get("created_at"), datetime) else created_customer.get("created_at", "")
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error creating customer: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating customer: {str(e)}")

@api_router.get("/customers/{customer_id}", response_model=Customer)
async def get_customer(customer_id: str):
    """Get customer by ID"""
    try:
        customer = await get_document("customers", customer_id)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        # Return in Customer model format
        return Customer(
            id=customer.get("id", ""),
            name=customer.get("name", ""),
            contact_person=customer.get("contact_person", ""),
            email=customer.get("email", ""),
            phone=customer.get("phone", ""),
            address=customer.get("address", ""),
            city=customer.get("city", ""),
            type=customer.get("type", "Corporate"),
            status=customer.get("status", "Active"),
            credit_limit=customer.get("credit_limit", 0),
            total_purchases=customer.get("total_purchases", 0),
            last_purchase=customer.get("last_purchase"),
            created_at=customer.get("created_at", datetime.utcnow()).isoformat() if isinstance(customer.get("created_at"), datetime) else customer.get("created_at", "")
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching customer: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching customer: {str(e)}")

@api_router.put("/customers/{customer_id}", response_model=Customer)
async def update_customer(customer_id: str, customer: CustomerCreate):
    """Update customer"""
    try:
        # Check if customer exists
        existing = await get_document("customers", customer_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        # Check if email is being changed and if new email already exists
        if customer.email != existing.get("email"):
            email_check = await find_one_document("customers", {"email": customer.email})
            if email_check and email_check.get("id") != customer_id:
                raise HTTPException(status_code=400, detail="Customer with this email already exists")
        
        # Prepare update data
        update_data = {
            "name": customer.name,
            "contact_person": customer.contact_person,
            "email": customer.email,
            "phone": customer.phone,
            "address": customer.address,
            "city": customer.city,
            "type": customer.type,
            "credit_limit": customer.credit_limit
        }
        
        # Update in database
        updated_customer = await update_document("customers", customer_id, update_data)
        if not updated_customer:
            raise HTTPException(status_code=500, detail="Failed to update customer")
        
        # Return in Customer model format
        return Customer(
            id=updated_customer.get("id", ""),
            name=updated_customer.get("name", ""),
            contact_person=updated_customer.get("contact_person", ""),
            email=updated_customer.get("email", ""),
            phone=updated_customer.get("phone", ""),
            address=updated_customer.get("address", ""),
            city=updated_customer.get("city", ""),
            type=updated_customer.get("type", "Corporate"),
            status=updated_customer.get("status", "Active"),
            credit_limit=updated_customer.get("credit_limit", 0),
            total_purchases=updated_customer.get("total_purchases", 0),
            last_purchase=updated_customer.get("last_purchase"),
            created_at=updated_customer.get("created_at", datetime.utcnow()).isoformat() if isinstance(updated_customer.get("created_at"), datetime) else updated_customer.get("created_at", "")
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating customer: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating customer: {str(e)}")

@api_router.delete("/customers/{customer_id}")
async def delete_customer(customer_id: str):
    """Delete customer"""
    try:
        # Check if customer exists
        existing = await get_document("customers", customer_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        # Check if customer has any sales orders or invoices
        sales_orders = await count_documents("sales_orders", {"customer_id": customer_id})
        sales_invoices = await count_documents("sales_invoices", {"customer_id": customer_id})
        
        if sales_orders > 0 or sales_invoices > 0:
            raise HTTPException(
                status_code=400, 
                detail="Cannot delete customer with existing sales orders or invoices"
            )
        
        # Delete from database
        deleted = await delete_document("customers", customer_id)
        if not deleted:
            raise HTTPException(status_code=500, detail="Failed to delete customer")
        
        return {"message": "Customer deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deleting customer: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting customer: {str(e)}")

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

# PDF Generation Endpoints
pdf_generator = PDFGenerator()

@api_router.get("/sales-invoices/{invoice_id}/pdf")
async def generate_invoice_pdf(invoice_id: str):
    """Generate PDF for sales invoice"""
    try:
        # Get invoice data (mock for now)
        invoice_data = {
            "id": invoice_id,
            "customer_id": "CUST-001",
            "customer_name": "PT. ABC Indonesia",
            "invoice_date": "2024-01-20",
            "due_date": "2024-02-19",
            "amount": 15000000,
            "status": "Paid",
            "items": [
                {"product_id": "PRD-001", "product_name": "Laptop Gaming", "quantity": 1, "unit_price": 15000000, "total": 15000000}
            ]
        }
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            pdf_path = pdf_generator.generate_invoice_pdf(invoice_data, tmp_file.name)
            
            # Return file path for download
            return {"pdf_path": pdf_path, "filename": f"invoice_{invoice_id}.pdf"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

@api_router.get("/sales-orders/{order_id}/pdf")
async def generate_order_pdf(order_id: str):
    """Generate PDF for sales order"""
    try:
        # Get order data (mock for now)
        order_data = {
            "id": order_id,
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
            "notes": "Priority delivery required"
        }
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            pdf_path = pdf_generator.generate_order_pdf(order_data, tmp_file.name)
            
            # Return file path for download
            return {"pdf_path": pdf_path, "filename": f"order_{order_id}.pdf"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

@api_router.get("/quotations/{quotation_id}/pdf")
async def generate_quotation_pdf(quotation_id: str):
    """Generate PDF for quotation"""
    try:
        # Get quotation data (mock for now)
        quotation_data = {
            "id": quotation_id,
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
            "notes": "Valid for 30 days"
        }
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            pdf_path = pdf_generator.generate_quotation_pdf(quotation_data, tmp_file.name)
            
            # Return file path for download
            return {"pdf_path": pdf_path, "filename": f"quotation_{quotation_id}.pdf"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

# =============================
# Purchase Module Models
# =============================

class Vendor(BaseModel):
    id: str
    name: str
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    status: str = "Active"
    created_at: str


class VendorCreate(BaseModel):
    name: str
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None


class PurchaseInvoice(BaseModel):
    id: str
    invoice_number: str
    vendor_id: str
    vendor_name: str
    invoice_date: str
    due_date: str
    amount: float
    paid_amount: float
    status: str
    description: Optional[str] = ""
    created_at: str


class PurchaseInvoiceCreate(BaseModel):
    invoice_number: str
    vendor_id: str
    vendor_name: str
    invoice_date: str
    due_date: str
    amount: float
    paid_amount: float = 0
    status: str = "Pending"
    description: Optional[str] = ""


class PurchaseOrder(BaseModel):
    id: str
    order_number: str
    vendor_id: str
    vendor_name: str
    order_date: str
    delivery_date: str
    status: str
    total_amount: float
    items: List[Dict]
    created_by: str
    notes: Optional[str] = ""
    created_at: str


class PurchaseOrderCreate(BaseModel):
    vendor_id: str
    vendor_name: str
    order_date: str
    delivery_date: str
    items: List[Dict]
    notes: Optional[str] = ""


# =============================
# Product Module Models
# =============================

class Product(BaseModel):
    id: str
    name: str
    sku: str
    description: str = ""
    category: str
    price: float
    cost: float
    stock: int
    min_stock: int
    max_stock: int
    status: str = "Active"
    created_at: str


class ProductCreate(BaseModel):
    name: str
    sku: str
    description: str = ""
    category: str
    price: float
    cost: float
    stock: int
    min_stock: int
    max_stock: int


# =============================
# Purchase Module Endpoints
# =============================

# Vendor Endpoints
@api_router.get("/vendors", response_model=List[Vendor])
async def get_vendors():
    """Get all vendors"""
    try:
        vendors_data = await get_documents("vendors", sort=[("created_at", -1)])
        
        # Convert to Vendor model format
        vendors = []
        for vend in vendors_data:
            vendors.append({
                "id": vend.get("id", ""),
                "name": vend.get("name", ""),
                "contact_person": vend.get("contact_person", ""),
                "email": vend.get("email", ""),
                "phone": vend.get("phone", ""),
                "address": vend.get("address", ""),
                "city": vend.get("city", ""),
                "status": vend.get("status", "Active"),
                "created_at": vend.get("created_at", datetime.utcnow()).isoformat() if isinstance(vend.get("created_at"), datetime) else vend.get("created_at", "")
            })
        
        return vendors
    except Exception as e:
        logging.error(f"Error fetching vendors: {str(e)}")
        return []


@api_router.post("/vendors", response_model=Vendor)
async def create_vendor(vendor: VendorCreate):
    """Create a new vendor"""
    try:
        # Check if email already exists (if provided)
        if vendor.email:
            existing = await find_one_document("vendors", {"email": vendor.email})
            if existing:
                raise HTTPException(status_code=400, detail="Vendor with this email already exists")
        
        # Prepare vendor data
        vendor_data = {
            "name": vendor.name,
            "contact_person": vendor.contact_person,
            "email": vendor.email,
            "phone": vendor.phone,
            "address": vendor.address,
            "city": vendor.city,
            "status": "Active"
        }
        
        # Save to database
        created_vendor = await create_document("vendors", vendor_data)
        
        # Return in Vendor model format
        return Vendor(
            id=created_vendor.get("id", ""),
            name=created_vendor.get("name", ""),
            contact_person=created_vendor.get("contact_person", ""),
            email=created_vendor.get("email", ""),
            phone=created_vendor.get("phone", ""),
            address=created_vendor.get("address", ""),
            city=created_vendor.get("city", ""),
            status=created_vendor.get("status", "Active"),
            created_at=created_vendor.get("created_at", datetime.utcnow()).isoformat() if isinstance(created_vendor.get("created_at"), datetime) else created_vendor.get("created_at", "")
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error creating vendor: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating vendor: {str(e)}")


@api_router.get("/vendors/{vendor_id}", response_model=Vendor)
async def get_vendor(vendor_id: str):
    """Get vendor by ID"""
    try:
        vendor = await get_document("vendors", vendor_id)
        if not vendor:
            raise HTTPException(status_code=404, detail="Vendor not found")
        
        # Return in Vendor model format
        return Vendor(
            id=vendor.get("id", ""),
            name=vendor.get("name", ""),
            contact_person=vendor.get("contact_person", ""),
            email=vendor.get("email", ""),
            phone=vendor.get("phone", ""),
            address=vendor.get("address", ""),
            city=vendor.get("city", ""),
            status=vendor.get("status", "Active"),
            created_at=vendor.get("created_at", datetime.utcnow()).isoformat() if isinstance(vendor.get("created_at"), datetime) else vendor.get("created_at", "")
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching vendor: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching vendor: {str(e)}")


@api_router.put("/vendors/{vendor_id}", response_model=Vendor)
async def update_vendor(vendor_id: str, vendor: VendorCreate):
    """Update vendor"""
    try:
        # Check if vendor exists
        existing = await get_document("vendors", vendor_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Vendor not found")
        
        # Check if email is being changed and if new email already exists
        if vendor.email and vendor.email != existing.get("email"):
            email_check = await find_one_document("vendors", {"email": vendor.email})
            if email_check and email_check.get("id") != vendor_id:
                raise HTTPException(status_code=400, detail="Vendor with this email already exists")
        
        # Prepare update data
        update_data = {
            "name": vendor.name,
            "contact_person": vendor.contact_person,
            "email": vendor.email,
            "phone": vendor.phone,
            "address": vendor.address,
            "city": vendor.city
        }
        
        # Update in database
        updated_vendor = await update_document("vendors", vendor_id, update_data)
        if not updated_vendor:
            raise HTTPException(status_code=500, detail="Failed to update vendor")
        
        # Return in Vendor model format
        return Vendor(
            id=updated_vendor.get("id", ""),
            name=updated_vendor.get("name", ""),
            contact_person=updated_vendor.get("contact_person", ""),
            email=updated_vendor.get("email", ""),
            phone=updated_vendor.get("phone", ""),
            address=updated_vendor.get("address", ""),
            city=updated_vendor.get("city", ""),
            status=updated_vendor.get("status", "Active"),
            created_at=updated_vendor.get("created_at", datetime.utcnow()).isoformat() if isinstance(updated_vendor.get("created_at"), datetime) else updated_vendor.get("created_at", "")
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating vendor: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating vendor: {str(e)}")


@api_router.delete("/vendors/{vendor_id}")
async def delete_vendor(vendor_id: str):
    """Delete vendor"""
    try:
        # Check if vendor exists
        existing = await get_document("vendors", vendor_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Vendor not found")
        
        # Check if vendor has any purchase orders or invoices
        purchase_orders = await count_documents("purchase_orders", {"vendor_id": vendor_id})
        purchase_invoices = await count_documents("purchase_invoices", {"vendor_id": vendor_id})
        
        if purchase_orders > 0 or purchase_invoices > 0:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete vendor with existing purchase orders or invoices"
            )
        
        # Delete from database
        deleted = await delete_document("vendors", vendor_id)
        if not deleted:
            raise HTTPException(status_code=500, detail="Failed to delete vendor")
        
        return {"message": "Vendor deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deleting vendor: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting vendor: {str(e)}")


# Purchase Invoice Endpoints
@api_router.get("/purchase-invoices", response_model=List[PurchaseInvoice])
async def get_purchase_invoices():
    invoices = [
        {
            "id": "PI-001",
            "invoice_number": "INV-2024-001",
            "vendor_id": "VEND-001",
            "vendor_name": "PT. Supplier ABC",
            "invoice_date": "2024-01-15",
            "due_date": "2024-02-15",
            "amount": 25000000,
            "paid_amount": 0,
            "status": "Pending",
            "description": "Purchase of raw materials",
            "created_at": "2024-01-15 10:00:00"
        },
        {
            "id": "PI-002",
            "invoice_number": "INV-2024-002",
            "vendor_id": "VEND-002",
            "vendor_name": "CV. Distributor XYZ",
            "invoice_date": "2024-01-16",
            "due_date": "2024-02-16",
            "amount": 15000000,
            "paid_amount": 15000000,
            "status": "Paid",
            "description": "Office supplies",
            "created_at": "2024-01-16 11:00:00"
        }
    ]
    return invoices


@api_router.post("/purchase-invoices", response_model=PurchaseInvoice)
async def create_purchase_invoice(pi: PurchaseInvoiceCreate):
    new_pi = PurchaseInvoice(
        id=f"PI-{str(uuid.uuid4())[:8].upper()}",
        invoice_number=pi.invoice_number,
        vendor_id=pi.vendor_id,
        vendor_name=pi.vendor_name,
        invoice_date=pi.invoice_date,
        due_date=pi.due_date,
        amount=pi.amount,
        paid_amount=pi.paid_amount,
        status=pi.status,
        description=pi.description,
        created_at=datetime.utcnow().isoformat(),
    )
    return new_pi


@api_router.get("/purchase-invoices/{invoice_id}", response_model=PurchaseInvoice)
async def get_purchase_invoice(invoice_id: str):
    example = {
        "id": "PI-001",
        "invoice_number": "INV-2024-001",
        "vendor_id": "VEND-001",
        "vendor_name": "PT. Supplier ABC",
        "invoice_date": "2024-01-15",
        "due_date": "2024-02-15",
        "amount": 25000000,
        "paid_amount": 0,
        "status": "Pending",
        "description": "Purchase of raw materials",
        "created_at": "2024-01-15 10:00:00"
    }
    if invoice_id != "PI-001":
        raise HTTPException(status_code=404, detail="Purchase invoice not found")
    return example


@api_router.put("/purchase-invoices/{invoice_id}", response_model=PurchaseInvoice)
async def update_purchase_invoice(invoice_id: str, pi: PurchaseInvoiceCreate):
    updated = PurchaseInvoice(
        id=invoice_id,
        invoice_number=pi.invoice_number,
        vendor_id=pi.vendor_id,
        vendor_name=pi.vendor_name,
        invoice_date=pi.invoice_date,
        due_date=pi.due_date,
        amount=pi.amount,
        paid_amount=pi.paid_amount,
        status=pi.status,
        description=pi.description,
        created_at=datetime.utcnow().isoformat(),
    )
    return updated


@api_router.delete("/purchase-invoices/{invoice_id}")
async def delete_purchase_invoice(invoice_id: str):
    return {"message": "Purchase invoice deleted"}


@api_router.get("/purchase-invoices/{invoice_id}/pdf")
async def generate_purchase_invoice_pdf(invoice_id: str):
    try:
        invoice_data = {
            "id": invoice_id,
            "customer_id": "VEND-001",  # reuse field in pdf format
            "customer_name": "PT. Supplier ABC",
            "invoice_date": "2024-01-15",
            "due_date": "2024-02-15",
            "amount": 25000000,
            "status": "Pending",
            "items": [
                {"product_id": "PRD-010", "product_name": "Bahan Baku A", "quantity": 10, "unit_price": 1000000, "total": 10000000}
            ],
        }
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            pdf_path = pdf_generator.generate_invoice_pdf(invoice_data, tmp_file.name)
            return {"pdf_path": pdf_path, "filename": f"purchase_invoice_{invoice_id}.pdf"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")


# Purchase Order Endpoints
@api_router.get("/purchase-orders", response_model=List[PurchaseOrder])
async def get_purchase_orders():
    orders = [
        {
            "id": "PO-001",
            "order_number": "PO-2024-001",
            "vendor_id": "VEND-001",
            "vendor_name": "PT. Supplier ABC",
            "order_date": "2024-01-10",
            "delivery_date": "2024-01-20",
            "status": "Confirmed",
            "total_amount": 41000000,
            "items": [
                {"product_id": "PRD-010", "product_name": "Bahan Baku A", "quantity": 10, "unit_price": 1000000, "total": 10000000},
                {"product_id": "PRD-011", "product_name": "Bahan Baku B", "quantity": 7, "unit_price": 3000000, "total": 21000000}
            ],
            "created_by": "Procurement",
            "notes": "Urgent",
            "created_at": "2024-01-10 09:00:00"
        }
    ]
    return orders


@api_router.post("/purchase-orders", response_model=PurchaseOrder)
async def create_purchase_order(order: PurchaseOrderCreate):
    new_order = PurchaseOrder(
        id=f"PO-{str(uuid.uuid4())[:8].upper()}",
        order_number=f"PO-2024-{str(uuid.uuid4())[:6].upper()}",
        vendor_id=order.vendor_id,
        vendor_name=order.vendor_name,
        order_date=order.order_date,
        delivery_date=order.delivery_date,
        status="Draft",
        total_amount=sum(item.get('total', 0) for item in order.items),
        items=order.items,
        created_by="Current User",
        notes=order.notes,
        created_at=datetime.utcnow().isoformat(),
    )
    return new_order


@api_router.get("/purchase-orders/{order_id}", response_model=PurchaseOrder)
async def get_purchase_order(order_id: str):
    example = {
        "id": "PO-001",
        "order_number": "PO-2024-001",
        "vendor_id": "VEND-001",
        "vendor_name": "PT. Supplier ABC",
        "order_date": "2024-01-10",
        "delivery_date": "2024-01-20",
        "status": "Confirmed",
        "total_amount": 41000000,
        "items": [
            {"product_id": "PRD-010", "product_name": "Bahan Baku A", "quantity": 10, "unit_price": 1000000, "total": 10000000},
            {"product_id": "PRD-011", "product_name": "Bahan Baku B", "quantity": 7, "unit_price": 3000000, "total": 21000000}
        ],
        "created_by": "Procurement",
        "notes": "Urgent",
        "created_at": "2024-01-10 09:00:00"
    }
    if order_id != "PO-001":
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return example


@api_router.put("/purchase-orders/{order_id}", response_model=PurchaseOrder)
async def update_purchase_order(order_id: str, order: PurchaseOrderCreate):
    updated = PurchaseOrder(
        id=order_id,
        order_number=f"PO-2024-{order_id}",
        vendor_id=order.vendor_id,
        vendor_name=order.vendor_name,
        order_date=order.order_date,
        delivery_date=order.delivery_date,
        status="Draft",
        total_amount=sum(item.get('total', 0) for item in order.items),
        items=order.items,
        created_by="Current User",
        notes=order.notes,
        created_at=datetime.utcnow().isoformat(),
    )
    return updated


@api_router.delete("/purchase-orders/{order_id}")
async def delete_purchase_order(order_id: str):
    return {"message": "Purchase order deleted"}


@api_router.get("/purchase-orders/{order_id}/pdf")
async def generate_purchase_order_pdf(order_id: str):
    try:
        order_data = {
            "id": order_id,
            "order_number": "PO-2024-001",
            "customer_id": "VEND-001",  # reuse pdf field
            "customer_name": "PT. Supplier ABC",
            "order_date": "2024-01-10",
            "delivery_date": "2024-01-20",
            "status": "Confirmed",
            "total_amount": 41000000,
            "items": [
                {"product_id": "PRD-010", "product_name": "Bahan Baku A", "quantity": 10, "unit_price": 1000000, "total": 10000000}
            ],
            "notes": "Urgent",
        }
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            pdf_path = pdf_generator.generate_order_pdf(order_data, tmp_file.name)
            return {"pdf_path": pdf_path, "filename": f"purchase_order_{order_id}.pdf"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")


# =============================
# Product Module Endpoints
# =============================

@api_router.get("/products", response_model=List[Product])
async def get_products():
    """Get all products"""
    try:
        products_data = await get_documents("products", sort=[("created_at", -1)])
        
        # Convert to Product model format
        products = []
        for prod in products_data:
            products.append({
                "id": prod.get("id", ""),
                "name": prod.get("name", ""),
                "sku": prod.get("sku", ""),
                "description": prod.get("description", ""),
                "category": prod.get("category", ""),
                "price": prod.get("price", 0.0),
                "cost": prod.get("cost", 0.0),
                "stock": prod.get("stock", 0),
                "min_stock": prod.get("min_stock", 0),
                "max_stock": prod.get("max_stock", 0),
                "status": prod.get("status", "Active"),
                "created_at": prod.get("created_at", datetime.utcnow()).isoformat() if isinstance(prod.get("created_at"), datetime) else prod.get("created_at", "")
            })
        
        return products
    except Exception as e:
        logging.error(f"Error fetching products: {str(e)}")
        return []


@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    """Create a new product"""
    try:
        # Check if SKU already exists
        existing = await find_one_document("products", {"sku": product.sku})
        if existing:
            raise HTTPException(status_code=400, detail="Product with this SKU already exists")
        
        # Prepare product data
        product_data = {
            "name": product.name,
            "sku": product.sku,
            "description": product.description,
            "category": product.category,
            "price": product.price,
            "cost": product.cost,
            "stock": product.stock,
            "min_stock": product.min_stock,
            "max_stock": product.max_stock,
            "status": "Active"
        }
        
        # Save to database
        created_product = await create_document("products", product_data)
        
        # Return in Product model format
        return Product(
            id=created_product.get("id", ""),
            name=created_product.get("name", ""),
            sku=created_product.get("sku", ""),
            description=created_product.get("description", ""),
            category=created_product.get("category", ""),
            price=created_product.get("price", 0.0),
            cost=created_product.get("cost", 0.0),
            stock=created_product.get("stock", 0),
            min_stock=created_product.get("min_stock", 0),
            max_stock=created_product.get("max_stock", 0),
            status=created_product.get("status", "Active"),
            created_at=created_product.get("created_at", datetime.utcnow()).isoformat() if isinstance(created_product.get("created_at"), datetime) else created_product.get("created_at", "")
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error creating product: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating product: {str(e)}")


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get product by ID"""
    try:
        product = await get_document("products", product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Return in Product model format
        return Product(
            id=product.get("id", ""),
            name=product.get("name", ""),
            sku=product.get("sku", ""),
            description=product.get("description", ""),
            category=product.get("category", ""),
            price=product.get("price", 0.0),
            cost=product.get("cost", 0.0),
            stock=product.get("stock", 0),
            min_stock=product.get("min_stock", 0),
            max_stock=product.get("max_stock", 0),
            status=product.get("status", "Active"),
            created_at=product.get("created_at", datetime.utcnow()).isoformat() if isinstance(product.get("created_at"), datetime) else product.get("created_at", "")
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching product: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching product: {str(e)}")


@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product: ProductCreate):
    """Update product"""
    try:
        # Check if product exists
        existing = await get_document("products", product_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Check if SKU is being changed and if new SKU already exists
        if product.sku != existing.get("sku"):
            sku_check = await find_one_document("products", {"sku": product.sku})
            if sku_check and sku_check.get("id") != product_id:
                raise HTTPException(status_code=400, detail="Product with this SKU already exists")
        
        # Prepare update data
        update_data = {
            "name": product.name,
            "sku": product.sku,
            "description": product.description,
            "category": product.category,
            "price": product.price,
            "cost": product.cost,
            "stock": product.stock,
            "min_stock": product.min_stock,
            "max_stock": product.max_stock
        }
        
        # Update in database
        updated_product = await update_document("products", product_id, update_data)
        if not updated_product:
            raise HTTPException(status_code=500, detail="Failed to update product")
        
        # Return in Product model format
        return Product(
            id=updated_product.get("id", ""),
            name=updated_product.get("name", ""),
            sku=updated_product.get("sku", ""),
            description=updated_product.get("description", ""),
            category=updated_product.get("category", ""),
            price=updated_product.get("price", 0.0),
            cost=updated_product.get("cost", 0.0),
            stock=updated_product.get("stock", 0),
            min_stock=updated_product.get("min_stock", 0),
            max_stock=updated_product.get("max_stock", 0),
            status=updated_product.get("status", "Active"),
            created_at=updated_product.get("created_at", datetime.utcnow()).isoformat() if isinstance(updated_product.get("created_at"), datetime) else updated_product.get("created_at", "")
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating product: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating product: {str(e)}")


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    """Delete product"""
    try:
        # Check if product exists
        existing = await get_document("products", product_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Check if product is used in any sales orders or invoices
        sales_orders = await count_documents("sales_orders", {"items.product_id": product_id})
        sales_invoices = await count_documents("sales_invoices", {"items.product_id": product_id})
        
        if sales_orders > 0 or sales_invoices > 0:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete product that is used in sales orders or invoices"
            )
        
        # Delete from database
        deleted = await delete_document("products", product_id)
        if not deleted:
            raise HTTPException(status_code=500, detail="Failed to delete product")
        
        return {"message": "Product deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deleting product: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting product: {str(e)}")


# =============================
# Stock Opname Module Models
# =============================

class StockOpname(BaseModel):
    id: str
    opname_number: str
    opname_date: str
    warehouse: str
    status: str  # Draft, In Progress, Completed, Cancelled
    total_items: int
    items_checked: int
    discrepancies: int
    variance_value: float
    items: List[Dict]
    conducted_by: str
    notes: Optional[str] = ""
    created_at: str


class StockOpnameCreate(BaseModel):
    opname_date: str
    warehouse: str
    items: List[Dict]
    notes: Optional[str] = ""


# =============================
# Stock Opname Module Endpoints
# =============================

@api_router.get("/stock-opnames", response_model=List[StockOpname])
async def get_stock_opnames():
    opnames = [
        {
            "id": "SO-001",
            "opname_number": "SO-2024-001",
            "opname_date": "2024-01-20",
            "warehouse": "Main Warehouse",
            "status": "Completed",
            "total_items": 150,
            "items_checked": 150,
            "discrepancies": 5,
            "variance_value": 2500000.0,
            "items": [
                {"product_id": "PRD-001", "product_name": "Laptop Gaming", "system_qty": 10, "actual_qty": 12, "variance": 2, "unit_price": 15000000, "variance_value": 30000000},
                {"product_id": "PRD-002", "product_name": "Mouse Wireless", "system_qty": 50, "actual_qty": 48, "variance": -2, "unit_price": 250000, "variance_value": -500000}
            ],
            "conducted_by": "John Inventory",
            "notes": "Monthly stock opname completed",
            "created_at": "2024-01-20 10:30:00"
        }
    ]
    return opnames


@api_router.post("/stock-opnames", response_model=StockOpname)
async def create_stock_opname(opname: StockOpnameCreate):
    new_opname = StockOpname(
        id=f"SO-{str(uuid.uuid4())[:8].upper()}",
        opname_number=f"SO-2024-{str(uuid.uuid4())[:6].upper()}",
        opname_date=opname.opname_date,
        warehouse=opname.warehouse,
        status="Draft",
        total_items=len(opname.items),
        items_checked=0,
        discrepancies=0,
        variance_value=0.0,
        items=opname.items,
        conducted_by="Current User",
        notes=opname.notes,
        created_at=datetime.utcnow().isoformat(),
    )
    return new_opname


@api_router.get("/stock-opnames/{opname_id}", response_model=StockOpname)
async def get_stock_opname(opname_id: str):
    example = {
        "id": "SO-001",
        "opname_number": "SO-2024-001",
        "opname_date": "2024-01-20",
        "warehouse": "Main Warehouse",
        "status": "Completed",
        "total_items": 150,
        "items_checked": 150,
        "discrepancies": 5,
        "variance_value": 2500000.0,
        "items": [
            {"product_id": "PRD-001", "product_name": "Laptop Gaming", "system_qty": 10, "actual_qty": 12, "variance": 2, "unit_price": 15000000, "variance_value": 30000000}
        ],
        "conducted_by": "John Inventory",
        "notes": "Monthly stock opname completed",
        "created_at": "2024-01-20 10:30:00"
    }
    if opname_id != "SO-001":
        raise HTTPException(status_code=404, detail="Stock opname not found")
    return example


@api_router.put("/stock-opnames/{opname_id}", response_model=StockOpname)
async def update_stock_opname(opname_id: str, opname: StockOpnameCreate):
    updated = StockOpname(
        id=opname_id,
        opname_number=f"SO-2024-{opname_id}",
        opname_date=opname.opname_date,
        warehouse=opname.warehouse,
        status="Draft",
        total_items=len(opname.items),
        items_checked=0,
        discrepancies=0,
        variance_value=0.0,
        items=opname.items,
        conducted_by="Current User",
        notes=opname.notes,
        created_at=datetime.utcnow().isoformat(),
    )
    return updated


@api_router.delete("/stock-opnames/{opname_id}")
async def delete_stock_opname(opname_id: str):
    return {"message": "Stock opname deleted"}


# =============================
# Stock Transfer Module Models
# =============================

class StockTransfer(BaseModel):
    id: str
    transfer_number: str
    transfer_date: str
    from_warehouse: str
    to_warehouse: str
    status: str  # Draft, Pending, In Progress, Completed, Cancelled
    total_items: int
    total_value: float
    items: List[Dict]
    reason: str
    requested_by: str
    approved_by: Optional[str] = None
    notes: Optional[str] = ""
    created_at: str


class StockTransferCreate(BaseModel):
    transfer_date: str
    from_warehouse: str
    to_warehouse: str
    items: List[Dict]
    reason: str
    notes: Optional[str] = ""


# =============================
# Stock Transfer Module Endpoints
# =============================

@api_router.get("/stock-transfers", response_model=List[StockTransfer])
async def get_stock_transfers():
    transfers = [
        {
            "id": "ST-001",
            "transfer_number": "ST-2024-001",
            "transfer_date": "2024-01-20",
            "from_warehouse": "Main Warehouse",
            "to_warehouse": "Secondary Warehouse",
            "status": "Completed",
            "total_items": 3,
            "total_value": 45000000.0,
            "items": [
                {"product_id": "PRD-001", "product_name": "Laptop Gaming", "quantity": 2, "unit_price": 15000000, "total": 30000000},
                {"product_id": "PRD-002", "product_name": "Mouse Wireless", "quantity": 10, "unit_price": 250000, "total": 2500000}
            ],
            "reason": "Stock redistribution",
            "requested_by": "John Inventory",
            "approved_by": "Jane Manager",
            "notes": "Transfer completed successfully",
            "created_at": "2024-01-20 10:30:00"
        }
    ]
    return transfers


@api_router.post("/stock-transfers", response_model=StockTransfer)
async def create_stock_transfer(transfer: StockTransferCreate):
    new_transfer = StockTransfer(
        id=f"ST-{str(uuid.uuid4())[:8].upper()}",
        transfer_number=f"ST-2024-{str(uuid.uuid4())[:6].upper()}",
        transfer_date=transfer.transfer_date,
        from_warehouse=transfer.from_warehouse,
        to_warehouse=transfer.to_warehouse,
        status="Draft",
        total_items=len(transfer.items),
        total_value=sum(item.get('total', 0) for item in transfer.items),
        items=transfer.items,
        reason=transfer.reason,
        requested_by="Current User",
        notes=transfer.notes,
        created_at=datetime.utcnow().isoformat(),
    )
    return new_transfer


@api_router.get("/stock-transfers/{transfer_id}", response_model=StockTransfer)
async def get_stock_transfer(transfer_id: str):
    example = {
        "id": "ST-001",
        "transfer_number": "ST-2024-001",
        "transfer_date": "2024-01-20",
        "from_warehouse": "Main Warehouse",
        "to_warehouse": "Secondary Warehouse",
        "status": "Completed",
        "total_items": 3,
        "total_value": 45000000.0,
        "items": [
            {"product_id": "PRD-001", "product_name": "Laptop Gaming", "quantity": 2, "unit_price": 15000000, "total": 30000000}
        ],
        "reason": "Stock redistribution",
        "requested_by": "John Inventory",
        "approved_by": "Jane Manager",
        "notes": "Transfer completed successfully",
        "created_at": "2024-01-20 10:30:00"
    }
    if transfer_id != "ST-001":
        raise HTTPException(status_code=404, detail="Stock transfer not found")
    return example


@api_router.put("/stock-transfers/{transfer_id}", response_model=StockTransfer)
async def update_stock_transfer(transfer_id: str, transfer: StockTransferCreate):
    updated = StockTransfer(
        id=transfer_id,
        transfer_number=f"ST-2024-{transfer_id}",
        transfer_date=transfer.transfer_date,
        from_warehouse=transfer.from_warehouse,
        to_warehouse=transfer.to_warehouse,
        status="Draft",
        total_items=len(transfer.items),
        total_value=sum(item.get('total', 0) for item in transfer.items),
        items=transfer.items,
        reason=transfer.reason,
        requested_by="Current User",
        notes=transfer.notes,
        created_at=datetime.utcnow().isoformat(),
    )
    return updated


@api_router.delete("/stock-transfers/{transfer_id}")
async def delete_stock_transfer(transfer_id: str):
    return {"message": "Stock transfer deleted"}


# =============================
# Production Order Module Models
# =============================

class ProductionOrder(BaseModel):
    id: str
    order_number: str
    product_id: str
    product_name: str
    order_date: str
    start_date: str
    due_date: str
    status: str  # Draft, Scheduled, In Production, Completed, Cancelled
    quantity: int
    completed_quantity: int
    workstation: str
    assigned_workers: List[str]
    bom: List[Dict]
    created_by: str
    notes: Optional[str] = ""
    created_at: str


class ProductionOrderCreate(BaseModel):
    product_id: str
    product_name: str
    order_date: str
    start_date: str
    due_date: str
    quantity: int
    workstation: str
    bom: List[Dict]
    notes: Optional[str] = ""


# =============================
# Production Order Module Endpoints
# =============================

@api_router.get("/production-orders", response_model=List[ProductionOrder])
async def get_production_orders():
    orders = [
        {
            "id": "PO-001",
            "order_number": "PO-2024-001",
            "product_id": "PRD-001",
            "product_name": "Laptop Gaming",
            "order_date": "2024-01-20",
            "start_date": "2024-01-22",
            "due_date": "2024-01-30",
            "status": "In Production",
            "quantity": 100,
            "completed_quantity": 45,
            "workstation": "Assembly Line A",
            "assigned_workers": ["John Worker", "Jane Worker", "Bob Worker"],
            "bom": [
                {"component_id": "COMP-001", "component_name": "CPU Intel i7", "quantity": 100, "unit_price": 5000000, "total": 500000000},
                {"component_id": "COMP-002", "component_name": "RAM 16GB", "quantity": 100, "unit_price": 1500000, "total": 150000000}
            ],
            "created_by": "Production Manager",
            "notes": "High priority order",
            "created_at": "2024-01-20 10:30:00"
        }
    ]
    return orders


@api_router.post("/production-orders", response_model=ProductionOrder)
async def create_production_order(order: ProductionOrderCreate):
    new_order = ProductionOrder(
        id=f"PO-{str(uuid.uuid4())[:8].upper()}",
        order_number=f"PO-2024-{str(uuid.uuid4())[:6].upper()}",
        product_id=order.product_id,
        product_name=order.product_name,
        order_date=order.order_date,
        start_date=order.start_date,
        due_date=order.due_date,
        status="Draft",
        quantity=order.quantity,
        completed_quantity=0,
        workstation=order.workstation,
        assigned_workers=[],
        bom=order.bom,
        created_by="Current User",
        notes=order.notes,
        created_at=datetime.utcnow().isoformat(),
    )
    return new_order


@api_router.get("/production-orders/{order_id}", response_model=ProductionOrder)
async def get_production_order(order_id: str):
    example = {
        "id": "PO-001",
        "order_number": "PO-2024-001",
        "product_id": "PRD-001",
        "product_name": "Laptop Gaming",
        "order_date": "2024-01-20",
        "start_date": "2024-01-22",
        "due_date": "2024-01-30",
        "status": "In Production",
        "quantity": 100,
        "completed_quantity": 45,
        "workstation": "Assembly Line A",
        "assigned_workers": ["John Worker", "Jane Worker"],
        "bom": [
            {"component_id": "COMP-001", "component_name": "CPU Intel i7", "quantity": 100, "unit_price": 5000000, "total": 500000000}
        ],
        "created_by": "Production Manager",
        "notes": "High priority order",
        "created_at": "2024-01-20 10:30:00"
    }
    if order_id != "PO-001":
        raise HTTPException(status_code=404, detail="Production order not found")
    return example


@api_router.put("/production-orders/{order_id}", response_model=ProductionOrder)
async def update_production_order(order_id: str, order: ProductionOrderCreate):
    updated = ProductionOrder(
        id=order_id,
        order_number=f"PO-2024-{order_id}",
        product_id=order.product_id,
        product_name=order.product_name,
        order_date=order.order_date,
        start_date=order.start_date,
        due_date=order.due_date,
        status="Draft",
        quantity=order.quantity,
        completed_quantity=0,
        workstation=order.workstation,
        assigned_workers=[],
        bom=order.bom,
        created_by="Current User",
        notes=order.notes,
        created_at=datetime.utcnow().isoformat(),
    )
    return updated


@api_router.delete("/production-orders/{order_id}")
async def delete_production_order(order_id: str):
    return {"message": "Production order deleted"}


# =============================
# Reports Module Endpoints
# =============================

@api_router.get("/reports")
async def get_reports():
    """Get summary report data"""
    report_data = {
        "sales": {
            "totalRevenue": 194258000.0,
            "totalOrders": 156,
            "averageOrderValue": 1245000.0,
            "growthRate": 12.5
        },
        "inventory": {
            "totalProducts": 1234,
            "lowStockItems": 23,
            "outOfStockItems": 5,
            "totalValue": 4500000000.0
        },
        "production": {
            "totalOrders": 45,
            "completedOrders": 32,
            "inProgressOrders": 13,
            "efficiency": 85.2
        }
    }
    return report_data


@api_router.get("/reports/sales")
async def get_sales_report():
    """Get detailed sales report"""
    return {
        "period": "2024-01",
        "totalRevenue": 194258000.0,
        "totalOrders": 156,
        "averageOrderValue": 1245000.0,
        "growthRate": 12.5,
        "topProducts": [
            {"name": "Laptop Gaming", "revenue": 45000000, "quantity": 30},
            {"name": "Mouse Wireless", "revenue": 25000000, "quantity": 100},
            {"name": "Keyboard Mechanical", "revenue": 18000000, "quantity": 15}
        ],
        "monthlyData": [
            {"month": "Jan", "revenue": 194258000},
            {"month": "Dec", "revenue": 172500000},
            {"month": "Nov", "revenue": 158000000}
        ]
    }


@api_router.get("/reports/inventory")
async def get_inventory_report():
    """Get detailed inventory report"""
    return {
        "totalProducts": 1234,
        "lowStockItems": 23,
        "outOfStockItems": 5,
        "totalValue": 4500000000.0,
        "categoryBreakdown": [
            {"category": "Elektronik", "count": 456, "value": 2500000000},
            {"category": "Aksesoris", "count": 678, "value": 1500000000},
            {"category": "Komputer", "count": 100, "value": 500000000}
        ],
        "topProducts": [
            {"name": "Laptop Gaming", "stock": 25, "value": 375000000},
            {"name": "Mouse Wireless", "stock": 150, "value": 37500000},
            {"name": "Keyboard Mechanical", "stock": 45, "value": 54000000}
        ]
    }


@api_router.get("/reports/production")
async def get_production_report():
    """Get detailed production report"""
    return {
        "totalOrders": 45,
        "completedOrders": 32,
        "inProgressOrders": 13,
        "efficiency": 85.2,
        "workstationStats": [
            {"workstation": "Assembly Line A", "orders": 20, "efficiency": 90.5},
            {"workstation": "Assembly Line B", "orders": 15, "efficiency": 82.3},
            {"workstation": "Quality Control", "orders": 10, "efficiency": 88.7}
        ],
        "monthlyData": [
            {"month": "Jan", "orders": 45, "completed": 32},
            {"month": "Dec", "orders": 38, "completed": 35},
            {"month": "Nov", "orders": 42, "completed": 40}
        ]
    }


# =============================
# Settings Module Endpoints
# =============================

@api_router.get("/settings")
async def get_settings():
    """Get all system settings"""
    settings = {
        "general": {
            "company_name": "ZONE v.2",
            "company_address": "Jl. Industri No. 123, Jakarta Pusat",
            "company_phone": "+62 21 1234 5678",
            "company_email": "info@zone.com",
            "company_website": "www.zone.com",
            "tax_number": "123456789012345",
            "currency": "IDR",
            "timezone": "Asia/Jakarta",
            "date_format": "DD/MM/YYYY",
            "time_format": "24h"
        },
        "database": {
            "db_host": "localhost",
            "db_port": "27017",
            "db_name": "zone_db",
            "backup_frequency": "daily",
            "last_backup": "2024-01-20 02:00:00",
            "auto_backup": True,
            "backup_retention": "30"
        },
        "email": {
            "smtp_host": "smtp.gmail.com",
            "smtp_port": "587",
            "smtp_username": "noreply@zone.com",
            "smtp_password": "********",
            "smtp_encryption": "TLS",
            "from_name": "ZONE System",
            "from_email": "noreply@zone.com"
        },
        "notifications": {
            "email_notifications": True,
            "sms_notifications": False,
            "push_notifications": True,
            "low_stock_alert": True,
            "payment_reminder": True,
            "order_status_update": True,
            "system_maintenance": True
        },
        "security": {
            "password_policy": "strong",
            "session_timeout": "30",
            "two_factor_auth": False,
            "ip_whitelist": "",
            "login_attempts": "5",
            "account_lockout": "15"
        },
        "appearance": {
            "theme": "light",
            "primary_color": "#3B82F6",
            "sidebar_collapsed": False,
            "language": "id",
            "font_size": "medium"
        }
    }
    return settings


@api_router.put("/settings")
async def update_settings(settings: dict):
    """Update system settings"""
    # In a real application, you would save these to a database
    # For now, we'll just return the updated settings
    return {"message": "Settings updated successfully", "settings": settings}


@api_router.post("/settings/backup")
async def create_backup():
    """Create a database backup"""
    # In a real application, you would create an actual backup
    return {"message": "Backup created successfully", "backup_file": "backup_2024-01-20_02-00-00.sql"}


@api_router.post("/settings/restore")
async def restore_backup(backup_file: str):
    """Restore from a backup file"""
    # In a real application, you would restore from the actual backup file
    return {"message": f"Database restored from {backup_file}"}


@api_router.get("/settings/health")
async def get_system_health():
    """Get system health status"""
    return {
        "status": "healthy",
        "database": "connected",
        "disk_space": "85%",
        "memory_usage": "67%",
        "cpu_usage": "23%",
        "uptime": "15 days, 3 hours, 45 minutes"
    }


# =============================
# User Management Module Models
# =============================

class User(BaseModel):
    id: str
    username: str
    email: str
    full_name: str
    role: str  # Admin, Manager, User
    status: str  # Active, Inactive, Suspended
    phone: Optional[str] = ""
    department: Optional[str] = ""
    last_login: Optional[str] = ""
    created_at: str


class UserCreate(BaseModel):
    username: str
    email: str
    full_name: str
    role: str
    phone: Optional[str] = ""
    department: Optional[str] = ""
    password: str


# =============================
# User Management Module Endpoints
# =============================

@api_router.get("/users", response_model=List[User])
async def get_users():
    """Get all users"""
    try:
        users_data = await get_documents("users", sort=[("created_at", -1)])
        
        # Convert to User model format (exclude password)
        users = []
        for user in users_data:
            users.append({
                "id": user.get("id", ""),
                "username": user.get("username", ""),
                "email": user.get("email", ""),
                "full_name": user.get("full_name", ""),
                "role": user.get("role", "User"),
                "status": user.get("status", "Active"),
                "phone": user.get("phone", ""),
                "department": user.get("department", ""),
                "last_login": user.get("last_login", datetime.utcnow()).isoformat() if isinstance(user.get("last_login"), datetime) else user.get("last_login", ""),
                "created_at": user.get("created_at", datetime.utcnow()).isoformat() if isinstance(user.get("created_at"), datetime) else user.get("created_at", "")
            })
        
        return users
    except Exception as e:
        logging.error(f"Error fetching users: {str(e)}")
        return []


@api_router.post("/users", response_model=User)
async def create_user(user: UserCreate):
    """Create a new user"""
    try:
        # Check if username or email already exists
        existing_username = await find_one_document("users", {"username": user.username})
        if existing_username:
            raise HTTPException(status_code=400, detail="Username already exists")
        
        existing_email = await find_one_document("users", {"email": user.email})
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already exists")
        
        # Hash password
        hashed_password = get_password_hash(user.password)
        
        # Prepare user data
        user_data = {
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "status": "Active",
            "phone": user.phone,
            "department": user.department,
            "password": hashed_password,
            "last_login": None
        }
        
        # Save to database
        created_user = await create_document("users", user_data)
        
        # Return in User model format (exclude password)
        return User(
            id=created_user.get("id", ""),
            username=created_user.get("username", ""),
            email=created_user.get("email", ""),
            full_name=created_user.get("full_name", ""),
            role=created_user.get("role", "User"),
            status=created_user.get("status", "Active"),
            phone=created_user.get("phone", ""),
            department=created_user.get("department", ""),
            last_login="",
            created_at=created_user.get("created_at", datetime.utcnow()).isoformat() if isinstance(created_user.get("created_at"), datetime) else created_user.get("created_at", "")
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")


@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Get user by ID"""
    try:
        user = await get_document("users", user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Return in User model format (exclude password)
        return User(
            id=user.get("id", ""),
            username=user.get("username", ""),
            email=user.get("email", ""),
            full_name=user.get("full_name", ""),
            role=user.get("role", "User"),
            status=user.get("status", "Active"),
            phone=user.get("phone", ""),
            department=user.get("department", ""),
            last_login=user.get("last_login", datetime.utcnow()).isoformat() if isinstance(user.get("last_login"), datetime) else user.get("last_login", ""),
            created_at=user.get("created_at", datetime.utcnow()).isoformat() if isinstance(user.get("created_at"), datetime) else user.get("created_at", "")
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")


@api_router.put("/users/{user_id}", response_model=User)
async def update_user(user_id: str, user: UserCreate):
    """Update user"""
    try:
        # Check if user exists
        existing = await get_document("users", user_id)
        if not existing:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if username is being changed and if new username already exists
        if user.username != existing.get("username"):
            username_check = await find_one_document("users", {"username": user.username})
            if username_check and username_check.get("id") != user_id:
                raise HTTPException(status_code=400, detail="Username already exists")
        
        # Check if email is being changed and if new email already exists
        if user.email != existing.get("email"):
            email_check = await find_one_document("users", {"email": user.email})
            if email_check and email_check.get("id") != user_id:
                raise HTTPException(status_code=400, detail="Email already exists")
        
        # Prepare update data
        update_data = {
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "phone": user.phone,
            "department": user.department
        }
        
        # Update password if provided
        if user.password:
            update_data["password"] = get_password_hash(user.password)
        
        # Update in database
        updated_user = await update_document("users", user_id, update_data)
        if not updated_user:
            raise HTTPException(status_code=500, detail="Failed to update user")
        
        # Return in User model format (exclude password)
        return User(
            id=updated_user.get("id", ""),
            username=updated_user.get("username", ""),
            email=updated_user.get("email", ""),
            full_name=updated_user.get("full_name", ""),
            role=updated_user.get("role", "User"),
            status=updated_user.get("status", "Active"),
            phone=updated_user.get("phone", ""),
            department=updated_user.get("department", ""),
            last_login=updated_user.get("last_login", datetime.utcnow()).isoformat() if isinstance(updated_user.get("last_login"), datetime) else updated_user.get("last_login", ""),
            created_at=updated_user.get("created_at", datetime.utcnow()).isoformat() if isinstance(updated_user.get("created_at"), datetime) else updated_user.get("created_at", "")
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")


@api_router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    """Delete user"""
    try:
        # Check if user exists
        existing = await get_document("users", user_id)
        if not existing:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Prevent deleting own account (optional check)
        # You can add this check if needed
        
        # Delete from database
        deleted = await delete_document("users", user_id)
        if not deleted:
            raise HTTPException(status_code=500, detail="Failed to delete user")
        
        return {"message": "User deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deleting user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting user: {str(e)}")


# =============================
# Manufacturing Module Endpoints
# =============================

@api_router.get("/manufacturing")
async def get_manufacturing_data():
    """Get manufacturing overview data"""
    return {
        "overview": {
            "totalOrders": 45,
            "completedOrders": 32,
            "inProgressOrders": 13,
            "efficiency": 85.2,
            "totalWorkstations": 8,
            "activeWorkstations": 6
        },
        "workstations": [
            {
                "id": "WS-001",
                "name": "Assembly Line A",
                "status": "Active",
                "currentOrder": "PO-2024-001",
                "efficiency": 90.5,
                "workers": 5,
                "capacity": 100
            },
            {
                "id": "WS-002",
                "name": "Assembly Line B",
                "status": "Active",
                "currentOrder": "PO-2024-002",
                "efficiency": 82.3,
                "workers": 4,
                "capacity": 80
            },
            {
                "id": "WS-003",
                "name": "Quality Control",
                "status": "Active",
                "currentOrder": "PO-2024-003",
                "efficiency": 88.7,
                "workers": 3,
                "capacity": 60
            }
        ],
        "schedules": [
            {
                "id": "SCH-001",
                "workstation": "Assembly Line A",
                "order": "PO-2024-001",
                "startTime": "08:00",
                "endTime": "16:00",
                "status": "In Progress"
            },
            {
                "id": "SCH-002",
                "workstation": "Assembly Line B",
                "order": "PO-2024-002",
                "startTime": "09:00",
                "endTime": "17:00",
                "status": "Scheduled"
            }
        ],
        "quality": {
            "totalInspections": 150,
            "passedInspections": 142,
            "failedInspections": 8,
            "qualityRate": 94.7
        }
    }


@api_router.get("/manufacturing/workstations")
async def get_workstations():
    """Get all workstations"""
    return [
        {
            "id": "WS-001",
            "name": "Assembly Line A",
            "status": "Active",
            "currentOrder": "PO-2024-001",
            "efficiency": 90.5,
            "workers": 5,
            "capacity": 100,
            "location": "Floor 1",
            "type": "Assembly"
        },
        {
            "id": "WS-002",
            "name": "Assembly Line B",
            "status": "Active",
            "currentOrder": "PO-2024-002",
            "efficiency": 82.3,
            "workers": 4,
            "capacity": 80,
            "location": "Floor 1",
            "type": "Assembly"
        }
    ]


@api_router.get("/manufacturing/schedules")
async def get_production_schedules():
    """Get production schedules"""
    return [
        {
            "id": "SCH-001",
            "workstation": "Assembly Line A",
            "order": "PO-2024-001",
            "startTime": "08:00",
            "endTime": "16:00",
            "status": "In Progress",
            "priority": "High",
            "assignedWorkers": ["John Worker", "Jane Worker"]
        },
        {
            "id": "SCH-002",
            "workstation": "Assembly Line B",
            "order": "PO-2024-002",
            "startTime": "09:00",
            "endTime": "17:00",
            "status": "Scheduled",
            "priority": "Medium",
            "assignedWorkers": ["Bob Worker", "Alice Worker"]
        }
    ]


@api_router.get("/manufacturing/quality")
async def get_quality_data():
    """Get quality control data"""
    return {
        "summary": {
            "totalInspections": 150,
            "passedInspections": 142,
            "failedInspections": 8,
            "qualityRate": 94.7
        },
        "recentInspections": [
            {
                "id": "QC-001",
                "order": "PO-2024-001",
                "workstation": "Assembly Line A",
                "inspector": "Quality Inspector 1",
                "result": "Passed",
                "timestamp": "2024-01-20 14:30:00",
                "notes": "All quality checks passed"
            },
            {
                "id": "QC-002",
                "order": "PO-2024-002",
                "workstation": "Assembly Line B",
                "inspector": "Quality Inspector 2",
                "result": "Failed",
                "timestamp": "2024-01-20 15:45:00",
                "notes": "Minor defect found in component"
            }
        ]
    }


# =============================
# Marketing Module Endpoints
# =============================

@api_router.get("/marketing")
async def get_marketing_data():
    """Get marketing overview data"""
    return {
        "overview": {
            "totalCampaigns": 12,
            "activeCampaigns": 5,
            "totalLeads": 1250,
            "convertedLeads": 187,
            "conversionRate": 15.0,
            "totalSpent": 25000000,
            "totalRevenue": 450000000,
            "roi": 1800.0
        },
        "campaigns": [
            {
                "id": "CAMP-001",
                "name": "Summer Sale 2024",
                "type": "Email Marketing",
                "status": "Active",
                "startDate": "2024-01-15",
                "endDate": "2024-02-15",
                "budget": 5000000,
                "spent": 3200000,
                "leads": 250,
                "conversions": 45,
                "roi": 280.0
            },
            {
                "id": "CAMP-002",
                "name": "Social Media Campaign",
                "type": "Social Media",
                "status": "Active",
                "startDate": "2024-01-20",
                "endDate": "2024-03-20",
                "budget": 8000000,
                "spent": 4500000,
                "leads": 400,
                "conversions": 60,
                "roi": 220.0
            },
            {
                "id": "CAMP-003",
                "name": "Google Ads Campaign",
                "type": "PPC",
                "status": "Completed",
                "startDate": "2024-01-01",
                "endDate": "2024-01-31",
                "budget": 3000000,
                "spent": 2800000,
                "leads": 180,
                "conversions": 32,
                "roi": 190.0
            }
        ],
        "leads": [
            {
                "id": "LEAD-001",
                "name": "John Doe",
                "email": "john@example.com",
                "phone": "+62 21 1234 5678",
                "source": "Website",
                "status": "Qualified",
                "campaign": "Summer Sale 2024",
                "created_at": "2024-01-20 10:30:00"
            },
            {
                "id": "LEAD-002",
                "name": "Jane Smith",
                "email": "jane@example.com",
                "phone": "+62 21 1234 5679",
                "source": "Social Media",
                "status": "New",
                "campaign": "Social Media Campaign",
                "created_at": "2024-01-19 15:45:00"
            },
            {
                "id": "LEAD-003",
                "name": "Bob Johnson",
                "email": "bob@example.com",
                "phone": "+62 21 1234 5680",
                "source": "Google Ads",
                "status": "Qualified",
                "campaign": "Google Ads Campaign",
                "created_at": "2024-01-18 09:15:00"
            }
        ],
        "analytics": {
            "websiteVisits": 15420,
            "socialMediaReach": 25000,
            "emailOpens": 8500,
            "clickThroughRate": 12.5
        }
    }


@api_router.get("/marketing/campaigns")
async def get_marketing_campaigns():
    """Get all marketing campaigns"""
    return [
        {
            "id": "CAMP-001",
            "name": "Summer Sale 2024",
            "type": "Email Marketing",
            "status": "Active",
            "startDate": "2024-01-15",
            "endDate": "2024-02-15",
            "budget": 5000000,
            "spent": 3200000,
            "leads": 250,
            "conversions": 45,
            "roi": 280.0,
            "description": "Summer promotion campaign targeting existing customers",
            "targetAudience": "Existing Customers",
            "channels": ["Email", "Website"]
        },
        {
            "id": "CAMP-002",
            "name": "Social Media Campaign",
            "type": "Social Media",
            "status": "Active",
            "startDate": "2024-01-20",
            "endDate": "2024-03-20",
            "budget": 8000000,
            "spent": 4500000,
            "leads": 400,
            "conversions": 60,
            "roi": 220.0,
            "description": "Social media campaign to increase brand awareness",
            "targetAudience": "Young Adults",
            "channels": ["Facebook", "Instagram", "Twitter"]
        }
    ]


@api_router.get("/marketing/leads")
async def get_marketing_leads():
    """Get all marketing leads"""
    return [
        {
            "id": "LEAD-001",
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+62 21 1234 5678",
            "source": "Website",
            "status": "Qualified",
            "campaign": "Summer Sale 2024",
            "company": "ABC Corp",
            "position": "Manager",
            "created_at": "2024-01-20 10:30:00",
            "lastContact": "2024-01-21 14:20:00"
        },
        {
            "id": "LEAD-002",
            "name": "Jane Smith",
            "email": "jane@example.com",
            "phone": "+62 21 1234 5679",
            "source": "Social Media",
            "status": "New",
            "campaign": "Social Media Campaign",
            "company": "XYZ Ltd",
            "position": "Director",
            "created_at": "2024-01-19 15:45:00",
            "lastContact": "2024-01-19 15:45:00"
        }
    ]


@api_router.get("/marketing/analytics")
async def get_marketing_analytics():
    """Get marketing analytics data"""
    return {
        "summary": {
            "websiteVisits": 15420,
            "socialMediaReach": 25000,
            "emailOpens": 8500,
            "clickThroughRate": 12.5
        },
        "trafficSources": [
            {"source": "Direct", "visits": 4500, "percentage": 29.2},
            {"source": "Social Media", "visits": 3800, "percentage": 24.6},
            {"source": "Google Ads", "visits": 3200, "percentage": 20.8},
            {"source": "Email", "visits": 2800, "percentage": 18.1},
            {"source": "Referral", "visits": 1120, "percentage": 7.3}
        ],
        "conversionFunnel": [
            {"stage": "Visitors", "count": 15420, "conversionRate": 100.0},
            {"stage": "Leads", "count": 1250, "conversionRate": 8.1},
            {"stage": "Qualified", "count": 450, "conversionRate": 2.9},
            {"stage": "Customers", "count": 187, "conversionRate": 1.2}
        ]
    }


# =============================
# General Journal Module Models
# =============================

class GeneralJournalEntry(BaseModel):
    id: str
    entry_number: str
    entry_date: str
    description: str
    debit_account: str
    credit_account: str
    debit_amount: float
    credit_amount: float
    reference: Optional[str] = ""
    status: str  # Draft, Posted, Reversed
    created_by: str
    created_at: str


class GeneralJournalEntryCreate(BaseModel):
    entry_date: str
    description: str
    debit_account: str
    credit_account: str
    debit_amount: float
    credit_amount: float
    reference: Optional[str] = ""


# =============================
# General Journal Module Endpoints
# =============================

@api_router.get("/general-journal", response_model=List[GeneralJournalEntry])
async def get_general_journal_entries():
    entries = [
        {
            "id": "JE-001",
            "entry_number": "JE-2024-001",
            "entry_date": "2024-01-20",
            "description": "Sales Revenue",
            "debit_account": "Cash",
            "credit_account": "Sales Revenue",
            "debit_amount": 15000000.0,
            "credit_amount": 15000000.0,
            "reference": "INV-001",
            "status": "Posted",
            "created_by": "Accountant",
            "created_at": "2024-01-20 10:30:00"
        },
        {
            "id": "JE-002",
            "entry_number": "JE-2024-002",
            "entry_date": "2024-01-20",
            "description": "Purchase of Inventory",
            "debit_account": "Inventory",
            "credit_account": "Accounts Payable",
            "debit_amount": 8000000.0,
            "credit_amount": 8000000.0,
            "reference": "PO-001",
            "status": "Posted",
            "created_by": "Accountant",
            "created_at": "2024-01-20 11:15:00"
        },
        {
            "id": "JE-003",
            "entry_number": "JE-2024-003",
            "entry_date": "2024-01-21",
            "description": "Office Supplies Expense",
            "debit_account": "Office Supplies Expense",
            "credit_account": "Cash",
            "debit_amount": 500000.0,
            "credit_amount": 500000.0,
            "reference": "EXP-001",
            "status": "Draft",
            "created_by": "Accountant",
            "created_at": "2024-01-21 09:00:00"
        }
    ]
    return entries


@api_router.post("/general-journal", response_model=GeneralJournalEntry)
async def create_general_journal_entry(entry: GeneralJournalEntryCreate):
    new_entry = GeneralJournalEntry(
        id=f"JE-{str(uuid.uuid4())[:8].upper()}",
        entry_number=f"JE-2024-{str(uuid.uuid4())[:6].upper()}",
        entry_date=entry.entry_date,
        description=entry.description,
        debit_account=entry.debit_account,
        credit_account=entry.credit_account,
        debit_amount=entry.debit_amount,
        credit_amount=entry.credit_amount,
        reference=entry.reference,
        status="Draft",
        created_by="Current User",
        created_at=datetime.utcnow().isoformat(),
    )
    return new_entry


@api_router.get("/general-journal/{entry_id}", response_model=GeneralJournalEntry)
async def get_general_journal_entry(entry_id: str):
    example = {
        "id": "JE-001",
        "entry_number": "JE-2024-001",
        "entry_date": "2024-01-20",
        "description": "Sales Revenue",
        "debit_account": "Cash",
        "credit_account": "Sales Revenue",
        "debit_amount": 15000000.0,
        "credit_amount": 15000000.0,
        "reference": "INV-001",
        "status": "Posted",
        "created_by": "Accountant",
        "created_at": "2024-01-20 10:30:00"
    }
    if entry_id != "JE-001":
        raise HTTPException(status_code=404, detail="Journal entry not found")
    return example


@api_router.put("/general-journal/{entry_id}", response_model=GeneralJournalEntry)
async def update_general_journal_entry(entry_id: str, entry: GeneralJournalEntryCreate):
    updated = GeneralJournalEntry(
        id=entry_id,
        entry_number=f"JE-2024-{entry_id}",
        entry_date=entry.entry_date,
        description=entry.description,
        debit_account=entry.debit_account,
        credit_account=entry.credit_account,
        debit_amount=entry.debit_amount,
        credit_amount=entry.credit_amount,
        reference=entry.reference,
        status="Draft",
        created_by="Current User",
        created_at=datetime.utcnow().isoformat(),
    )
    return updated


@api_router.delete("/general-journal/{entry_id}")
async def delete_general_journal_entry(entry_id: str):
    return {"message": "Journal entry deleted"}


# =============================
# Chart of Accounts Module Models
# =============================

class ChartOfAccount(BaseModel):
    id: str
    account_code: str
    account_name: str
    account_type: str  # Asset, Liability, Equity, Revenue, Expense
    parent_account: Optional[str] = None
    balance: float
    normal_balance: str  # Debit, Credit
    status: str  # Active, Inactive
    description: Optional[str] = ""
    created_at: str


class ChartOfAccountCreate(BaseModel):
    account_code: str
    account_name: str
    account_type: str
    parent_account: Optional[str] = None
    normal_balance: str
    description: Optional[str] = ""


# =============================
# Chart of Accounts Module Endpoints
# =============================

@api_router.get("/chart-of-accounts", response_model=List[ChartOfAccount])
async def get_chart_of_accounts():
    accounts = [
        {
            "id": "ACC-001",
            "account_code": "1000",
            "account_name": "Assets",
            "account_type": "Asset",
            "parent_account": None,
            "balance": 500000000.0,
            "normal_balance": "Debit",
            "status": "Active",
            "description": "All company assets",
            "created_at": "2024-01-01 00:00:00"
        },
        {
            "id": "ACC-002",
            "account_code": "1100",
            "account_name": "Current Assets",
            "account_type": "Asset",
            "parent_account": "Assets",
            "balance": 300000000.0,
            "normal_balance": "Debit",
            "status": "Active",
            "description": "Current assets including cash and inventory",
            "created_at": "2024-01-01 00:00:00"
        },
        {
            "id": "ACC-003",
            "account_code": "1110",
            "account_name": "Cash",
            "account_type": "Asset",
            "parent_account": "Current Assets",
            "balance": 150000000.0,
            "normal_balance": "Debit",
            "status": "Active",
            "description": "Cash and cash equivalents",
            "created_at": "2024-01-01 00:00:00"
        },
        {
            "id": "ACC-004",
            "account_code": "2000",
            "account_name": "Liabilities",
            "account_type": "Liability",
            "parent_account": None,
            "balance": 200000000.0,
            "normal_balance": "Credit",
            "status": "Active",
            "description": "All company liabilities",
            "created_at": "2024-01-01 00:00:00"
        },
        {
            "id": "ACC-005",
            "account_code": "3000",
            "account_name": "Equity",
            "account_type": "Equity",
            "parent_account": None,
            "balance": 300000000.0,
            "normal_balance": "Credit",
            "status": "Active",
            "description": "Shareholders equity",
            "created_at": "2024-01-01 00:00:00"
        },
        {
            "id": "ACC-006",
            "account_code": "4000",
            "account_name": "Revenue",
            "account_type": "Revenue",
            "parent_account": None,
            "balance": 450000000.0,
            "normal_balance": "Credit",
            "status": "Active",
            "description": "All revenue accounts",
            "created_at": "2024-01-01 00:00:00"
        },
        {
            "id": "ACC-007",
            "account_code": "5000",
            "account_name": "Expenses",
            "account_type": "Expense",
            "parent_account": None,
            "balance": 250000000.0,
            "normal_balance": "Debit",
            "status": "Active",
            "description": "All expense accounts",
            "created_at": "2024-01-01 00:00:00"
        }
    ]
    return accounts


@api_router.post("/chart-of-accounts", response_model=ChartOfAccount)
async def create_chart_of_account(account: ChartOfAccountCreate):
    new_account = ChartOfAccount(
        id=f"ACC-{str(uuid.uuid4())[:8].upper()}",
        account_code=account.account_code,
        account_name=account.account_name,
        account_type=account.account_type,
        parent_account=account.parent_account,
        balance=0.0,
        normal_balance=account.normal_balance,
        status="Active",
        description=account.description,
        created_at=datetime.utcnow().isoformat(),
    )
    return new_account


@api_router.get("/chart-of-accounts/{account_id}", response_model=ChartOfAccount)
async def get_chart_of_account(account_id: str):
    example = {
        "id": "ACC-001",
        "account_code": "1000",
        "account_name": "Assets",
        "account_type": "Asset",
        "parent_account": None,
        "balance": 500000000.0,
        "normal_balance": "Debit",
        "status": "Active",
        "description": "All company assets",
        "created_at": "2024-01-01 00:00:00"
    }
    if account_id != "ACC-001":
        raise HTTPException(status_code=404, detail="Account not found")
    return example


@api_router.put("/chart-of-accounts/{account_id}", response_model=ChartOfAccount)
async def update_chart_of_account(account_id: str, account: ChartOfAccountCreate):
    updated = ChartOfAccount(
        id=account_id,
        account_code=account.account_code,
        account_name=account.account_name,
        account_type=account.account_type,
        parent_account=account.parent_account,
        balance=0.0,
        normal_balance=account.normal_balance,
        status="Active",
        description=account.description,
        created_at=datetime.utcnow().isoformat(),
    )
    return updated


@api_router.delete("/chart-of-accounts/{account_id}")
async def delete_chart_of_account(account_id: str):
    return {"message": "Account deleted"}


# =============================
# Authentication Module Endpoints
# =============================

@api_router.post("/auth/login")
async def login(credentials: dict):
    """User login endpoint"""
    email = credentials.get("email", "")
    password = credentials.get("password", "")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    try:
        # Find user by email
        user = await find_one_document("users", {"email": email})
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Check if user is active
        if user.get("status") != "Active":
            raise HTTPException(status_code=403, detail="User account is inactive")
        
        # Verify password
        stored_password = user.get("password", "")
        if not stored_password:
            # If no password stored, check for demo users (backward compatibility)
            if email == "admin@zone.com" and password == "admin123":
                # Create default admin user if doesn't exist
                admin_data = {
                    "username": "admin",
                    "email": "admin@zone.com",
                    "full_name": "Administrator",
                    "role": "Admin",
                    "status": "Active",
                    "phone": "+62 21 1234 5678",
                    "department": "IT",
                    "password": get_password_hash("admin123")
                }
                await create_document("users", admin_data)
                user = await find_one_document("users", {"email": email})
            elif email == "manager@zone.com" and password == "manager123":
                manager_data = {
                    "username": "manager",
                    "email": "manager@zone.com",
                    "full_name": "Manager",
                    "role": "Manager",
                    "status": "Active",
                    "phone": "+62 21 1234 5679",
                    "department": "Management",
                    "password": get_password_hash("manager123")
                }
                await create_document("users", manager_data)
                user = await find_one_document("users", {"email": email})
            else:
                raise HTTPException(status_code=401, detail="Invalid credentials")
        else:
            # Verify password
            if not verify_password(password, stored_password):
                raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Update last login
        await update_document("users", user.get("id"), {"last_login": datetime.utcnow()})
        
        # Create access token
        access_token = create_access_token(data={"sub": user.get("email"), "user_id": user.get("id")})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.get("id", ""),
                "username": user.get("username", ""),
                "email": user.get("email", ""),
                "full_name": user.get("full_name", ""),
                "role": user.get("role", "User"),
                "status": user.get("status", "Active"),
                "phone": user.get("phone", ""),
                "department": user.get("department", "")
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error during login: {str(e)}")
        raise HTTPException(status_code=500, detail="Error during login")


@api_router.post("/auth/logout")
async def logout():
    """User logout endpoint"""
    return {"message": "Successfully logged out"}


@api_router.get("/auth/me")
async def get_current_user_info(authorization: str = Header(None)):
    """Get current user info"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        user = await get_document("users", user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "id": user.get("id", ""),
            "username": user.get("username", ""),
            "email": user.get("email", ""),
            "full_name": user.get("full_name", ""),
            "role": user.get("role", "User"),
            "status": user.get("status", "Active"),
            "phone": user.get("phone", ""),
            "department": user.get("department", ""),
            "last_login": user.get("last_login", datetime.utcnow()).isoformat() if isinstance(user.get("last_login"), datetime) else user.get("last_login", "")
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching user: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching user")


@api_router.post("/auth/refresh")
async def refresh_token():
    """Refresh access token"""
    return {
        "access_token": "new-demo-token-12345",
        "token_type": "bearer"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
