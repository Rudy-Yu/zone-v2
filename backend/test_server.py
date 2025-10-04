from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Test server is running"}

@app.get("/api/customers")
async def get_customers():
    return [
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
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
