from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class SupplierDB(Base):
    __tablename__ = "suppliers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact_info = Column(String, nullable=True)

class ItemDB(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String, nullable=True)
    min_stock = Column(Integer, default=1)
    expiration_date = Column(Date, nullable=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    barcode = Column(String, nullable=True)

class Supplier(BaseModel):
    id: Optional[int] = None
    name: str
    contact_info: Optional[str] = None

class Item(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    quantity: int
    price: float
    category: Optional[str] = None
    min_stock: Optional[int] = 1
    expiration_date: Optional[date] = None
    supplier_id: Optional[int] = None
    barcode: Optional[str] = None

class TransactionDB(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    change_quantity = Column(Integer, nullable=False)  # negative for sales
    timestamp = Column(DateTime, default=datetime.utcnow)
    reason = Column(String, nullable=False)  # e.g., "sale", "restock"

class Transaction(BaseModel):
    id: Optional[int] = None
    item_id: int
    change_quantity: int
    timestamp: Optional[datetime] = None
    reason: str

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[int] = None
    price: Optional[float] = None
    category: Optional[str] = None
    min_stock: Optional[int] = None
    expiration_date: Optional[date] = None
    supplier_id: Optional[int] = None
    barcode: Optional[str] = None

class SellRequest(BaseModel):
    quantity: int

class CustomerDB(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    contact_info = Column(String, nullable=True)  # keep for backward compatibility

class InvoiceDB(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    total_amount = Column(Float, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="pending")  # e.g., pending, paid, cancelled

class InvoiceLineDB(Base):
    __tablename__ = "invoice_lines"
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)

class Customer(BaseModel):
    id: Optional[int] = None
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    contact_info: Optional[str] = None

class Invoice(BaseModel):
    id: Optional[int] = None
    customer_id: Optional[int] = None
    total_amount: float
    date: Optional[datetime] = None
    status: Optional[str] = "pending"

class InvoiceLine(BaseModel):
    id: Optional[int] = None
    invoice_id: int
    item_id: int
    quantity: int
    price: float

class InvoiceCreate(BaseModel):
    customer_id: Optional[int] = None
    items: List[dict]  # list of {"item_id": int, "quantity": int}