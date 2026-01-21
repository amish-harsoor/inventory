from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine
from app.models import Base, ItemDB, SupplierDB, TransactionDB, CustomerDB, InvoiceDB, InvoiceLineDB
from app.routers.inventory import router as inventory_router
from datetime import date, timedelta
from sqlalchemy import func, select
from app.database import async_session

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Populate with dummy data if empty
    async with async_session() as session:
        result = await session.execute(select(func.count()).select_from(ItemDB))
        count = result.scalar()
        if count == 0:
            # Add suppliers
            suppliers_data = [
                {"name": "Spice Traders India", "contact_info": "spices@india.com"},
                {"name": "Grain Suppliers Pvt Ltd", "contact_info": "grains@suppliers.com"},
                {"name": "Dairy Farms India", "contact_info": "dairy@farms.com"},
                {"name": "Fresh Vegetables Co", "contact_info": "veggies@fresh.com"}
            ]
            suppliers = [SupplierDB(**data) for data in suppliers_data]
            session.add_all(suppliers)
            await session.flush()
            supplier_ids = [s.id for s in suppliers]

            # Add items
            items_data = [
                {"name": "Basmati Rice", "description": "Premium long grain basmati rice", "quantity": 100, "price": 120.0, "category": "Grains", "min_stock": 20, "supplier_id": supplier_ids[1], "barcode": "123456789001"},
                {"name": "Toor Dal", "description": "Split pigeon peas", "quantity": 50, "price": 80.0, "category": "Pulses", "min_stock": 15, "supplier_id": supplier_ids[1], "barcode": "123456789002"},
                {"name": "Moong Dal", "description": "Split yellow lentils", "quantity": 40, "price": 90.0, "category": "Pulses", "min_stock": 12, "supplier_id": supplier_ids[1], "barcode": "123456789003"},
                {"name": "Urad Dal", "description": "Black gram lentils", "quantity": 30, "price": 100.0, "category": "Pulses", "min_stock": 10, "supplier_id": supplier_ids[1], "barcode": "123456789004"},
                {"name": "Chana Dal", "description": "Split chickpeas", "quantity": 35, "price": 75.0, "category": "Pulses", "min_stock": 15, "supplier_id": supplier_ids[1], "barcode": "123456789005"},
                {"name": "Masoor Dal", "description": "Red lentils", "quantity": 45, "price": 85.0, "category": "Pulses", "min_stock": 18, "supplier_id": supplier_ids[1], "barcode": "123456789006"},
                {"name": "Wheat Flour", "description": "Whole wheat flour", "quantity": 80, "price": 40.0, "category": "Flour", "min_stock": 25, "supplier_id": supplier_ids[1], "barcode": "123456789007"},
                {"name": "Besan", "description": "Gram flour", "quantity": 25, "price": 60.0, "category": "Flour", "min_stock": 10, "supplier_id": supplier_ids[1], "barcode": "123456789008"},
                {"name": "Sugar", "description": "White sugar", "quantity": 200, "price": 45.0, "category": "Sugar", "min_stock": 50, "supplier_id": supplier_ids[1], "barcode": "123456789009"},
                {"name": "Salt", "description": "Iodized salt", "quantity": 150, "price": 20.0, "category": "Salt", "min_stock": 30, "supplier_id": supplier_ids[1], "barcode": "123456789010"},
                {"name": "Turmeric Powder", "description": "Ground turmeric", "quantity": 20, "price": 50.0, "category": "Spices", "min_stock": 5, "supplier_id": supplier_ids[0], "barcode": "123456789011"},
                {"name": "Red Chili Powder", "description": "Hot red chili powder", "quantity": 15, "price": 70.0, "category": "Spices", "min_stock": 8, "supplier_id": supplier_ids[0], "barcode": "123456789012"},
                {"name": "Coriander Powder", "description": "Ground coriander", "quantity": 18, "price": 55.0, "category": "Spices", "min_stock": 6, "supplier_id": supplier_ids[0], "barcode": "123456789013"},
                {"name": "Cumin Seeds", "description": "Whole cumin seeds", "quantity": 12, "price": 80.0, "category": "Spices", "min_stock": 4, "supplier_id": supplier_ids[0], "barcode": "123456789014"},
                {"name": "Mustard Seeds", "description": "Yellow mustard seeds", "quantity": 10, "price": 65.0, "category": "Spices", "min_stock": 3, "supplier_id": supplier_ids[0], "barcode": "123456789015"},
                {"name": "Garam Masala", "description": "Mixed spice blend", "quantity": 8, "price": 120.0, "category": "Spices", "min_stock": 2, "supplier_id": supplier_ids[0], "barcode": "123456789016"},
                {"name": "Tea", "description": "Black tea leaves", "quantity": 60, "price": 150.0, "category": "Beverages", "min_stock": 15, "supplier_id": supplier_ids[1], "barcode": "123456789017"},
                {"name": "Coffee", "description": "Ground coffee", "quantity": 40, "price": 200.0, "category": "Beverages", "min_stock": 10, "supplier_id": supplier_ids[1], "barcode": "123456789018"},
                {"name": "Milk", "description": "Fresh cow milk", "quantity": 50, "price": 60.0, "category": "Dairy", "min_stock": 20, "supplier_id": supplier_ids[2], "expiration_date": date.today() + timedelta(days=7), "barcode": "123456789019"},
                {"name": "Yogurt", "description": "Plain yogurt", "quantity": 30, "price": 40.0, "category": "Dairy", "min_stock": 10, "supplier_id": supplier_ids[2], "expiration_date": date.today() + timedelta(days=10), "barcode": "123456789020"},
                {"name": "Paneer", "description": "Fresh cottage cheese", "quantity": 20, "price": 180.0, "category": "Dairy", "min_stock": 5, "supplier_id": supplier_ids[2], "expiration_date": date.today() + timedelta(days=5), "barcode": "123456789021"},
                {"name": "Ghee", "description": "Clarified butter", "quantity": 25, "price": 400.0, "category": "Dairy", "min_stock": 8, "supplier_id": supplier_ids[2], "barcode": "123456789022"},
                {"name": "Cooking Oil", "description": "Refined vegetable oil", "quantity": 100, "price": 120.0, "category": "Oil", "min_stock": 30, "supplier_id": supplier_ids[1], "barcode": "123456789023"},
                {"name": "Onions", "description": "Red onions", "quantity": 200, "price": 30.0, "category": "Vegetables", "min_stock": 50, "supplier_id": supplier_ids[3], "expiration_date": date.today() + timedelta(days=14), "barcode": "123456789024"},
                {"name": "Potatoes", "description": "Fresh potatoes", "quantity": 150, "price": 25.0, "category": "Vegetables", "min_stock": 40, "supplier_id": supplier_ids[3], "expiration_date": date.today() + timedelta(days=21), "barcode": "123456789025"}
            ]
            items = [ItemDB(**data) for data in items_data]
            session.add_all(items)

            # Add customers
            customers_data = [
                {"name": "John Doe", "contact_info": "john@example.com", "phone": "1234567890", "address": "123 Main St"},
                {"name": "Jane Smith", "contact_info": "jane@example.com", "phone": "0987654321", "address": "456 Elm St"},
                {"name": "Bob Johnson", "contact_info": "bob@example.com", "phone": "5555555555", "address": "789 Oak St"}
            ]
            customers = [CustomerDB(**data) for data in customers_data]
            session.add_all(customers)
            await session.flush()
            customer_ids = [c.id for c in customers]

            # Add invoices
            invoices_data = [
                {"customer_id": customer_ids[0], "total_amount": 500.0, "date": date.today(), "status": "paid"},
                {"customer_id": customer_ids[1], "total_amount": 750.0, "date": date.today(), "status": "pending"}
            ]
            invoices = [InvoiceDB(**data) for data in invoices_data]
            session.add_all(invoices)
            await session.flush()
            invoice_ids = [i.id for i in invoices]

            # Add invoice lines
            invoice_lines_data = [
                {"invoice_id": invoice_ids[0], "item_id": 1, "quantity": 2, "price": 120.0},  # Basmati Rice
                {"invoice_id": invoice_ids[1], "item_id": 2, "quantity": 1, "price": 80.0}   # Toor Dal
            ]
            invoice_lines = [InvoiceLineDB(**data) for data in invoice_lines_data]
            session.add_all(invoice_lines)

            await session.commit()

    yield

app = FastAPI(lifespan=lifespan, title="Inventory Management API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(inventory_router, prefix="/api", tags=["inventory"])

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")