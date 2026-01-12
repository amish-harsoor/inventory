from fastapi import APIRouter, HTTPException, Depends, Body
from typing import List
from app.models import Item, ItemUpdate, Supplier, SupplierDB, ItemDB, Transaction, TransactionDB, SellRequest, Customer, CustomerDB, Invoice, InvoiceDB, InvoiceLine, InvoiceLineDB, InvoiceCreate
from datetime import date, timedelta
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db

router = APIRouter()

# Supplier endpoints (database-backed)
@router.get("/suppliers", response_model=List[Supplier])
async def get_suppliers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SupplierDB))
    suppliers_db = result.scalars().all()
    return [Supplier(id=s.id, name=s.name, contact_info=s.contact_info) for s in suppliers_db]


@router.get("/suppliers/{supplier_id}", response_model=Supplier)
async def get_supplier(supplier_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SupplierDB).where(SupplierDB.id == supplier_id))
    supplier_db = result.scalars().first()
    if not supplier_db:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return Supplier(id=supplier_db.id, name=supplier_db.name, contact_info=supplier_db.contact_info)


@router.post("/suppliers", response_model=Supplier)
async def create_supplier(supplier: Supplier, db: AsyncSession = Depends(get_db)):
    supplier_db = SupplierDB(name=supplier.name, contact_info=supplier.contact_info)
    db.add(supplier_db)
    await db.commit()
    await db.refresh(supplier_db)
    return Supplier(id=supplier_db.id, name=supplier_db.name, contact_info=supplier_db.contact_info)


@router.put("/suppliers/{supplier_id}", response_model=Supplier)
async def update_supplier(supplier_id: int, supplier_update: Supplier, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SupplierDB).where(SupplierDB.id == supplier_id))
    supplier_db = result.scalars().first()
    if not supplier_db:
        raise HTTPException(status_code=404, detail="Supplier not found")
    supplier_db.name = supplier_update.name
    supplier_db.contact_info = supplier_update.contact_info
    db.add(supplier_db)
    await db.commit()
    await db.refresh(supplier_db)
    return Supplier(id=supplier_db.id, name=supplier_db.name, contact_info=supplier_db.contact_info)


@router.delete("/suppliers/{supplier_id}")
async def delete_supplier(supplier_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SupplierDB).where(SupplierDB.id == supplier_id))
    supplier_db = result.scalars().first()
    if not supplier_db:
        raise HTTPException(status_code=404, detail="Supplier not found")
    await db.delete(supplier_db)
    await db.commit()
    return {"message": "Supplier deleted"}

# Customer endpoints
@router.get("/customers", response_model=List[Customer])
async def get_customers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CustomerDB))
    customers_db = result.scalars().all()
    return [Customer(id=c.id, name=c.name, phone=c.phone, address=c.address, contact_info=c.contact_info) for c in customers_db]

@router.get("/customers/{customer_id}", response_model=Customer)
async def get_customer(customer_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CustomerDB).where(CustomerDB.id == customer_id))
    customer_db = result.scalars().first()
    if not customer_db:
        raise HTTPException(status_code=404, detail="Customer not found")
    return Customer(id=customer_db.id, name=customer_db.name, phone=customer_db.phone, address=customer_db.address, contact_info=customer_db.contact_info)

@router.post("/customers", response_model=Customer)
async def create_customer(customer: Customer, db: AsyncSession = Depends(get_db)):
    customer_db = CustomerDB(name=customer.name, phone=customer.phone, address=customer.address, contact_info=customer.contact_info)
    db.add(customer_db)
    await db.commit()
    await db.refresh(customer_db)
    return Customer(id=customer_db.id, name=customer_db.name, phone=customer_db.phone, address=customer_db.address, contact_info=customer_db.contact_info)

@router.put("/customers/{customer_id}", response_model=Customer)
async def update_customer(customer_id: int, customer_update: Customer, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CustomerDB).where(CustomerDB.id == customer_id))
    customer_db = result.scalars().first()
    if not customer_db:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer_db.name = customer_update.name
    customer_db.phone = customer_update.phone
    customer_db.address = customer_update.address
    customer_db.contact_info = customer_update.contact_info
    db.add(customer_db)
    await db.commit()
    await db.refresh(customer_db)
    return Customer(id=customer_db.id, name=customer_db.name, phone=customer_db.phone, address=customer_db.address, contact_info=customer_db.contact_info)

@router.delete("/customers/{customer_id}")
async def delete_customer(customer_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CustomerDB).where(CustomerDB.id == customer_id))
    customer_db = result.scalars().first()
    if not customer_db:
        raise HTTPException(status_code=404, detail="Customer not found")
    await db.delete(customer_db)
    await db.commit()
    return {"message": "Customer deleted"}

# Item endpoints (database-backed)
@router.get("/items", response_model=List[Item])
async def get_items(category: str = None, db: AsyncSession = Depends(get_db)):
    query = select(ItemDB)
    if category:
        query = query.where(ItemDB.category == category)
    result = await db.execute(query)
    items_db = result.scalars().all()
    return [Item(id=i.id, name=i.name, description=i.description, quantity=i.quantity, price=i.price, category=i.category, min_stock=i.min_stock, expiration_date=i.expiration_date, supplier_id=i.supplier_id, barcode=i.barcode) for i in items_db]

@router.get("/items/{item_id}", response_model=Item)
async def get_item(item_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ItemDB).where(ItemDB.id == item_id))
    item_db = result.scalars().first()
    if not item_db:
        raise HTTPException(status_code=404, detail="Item not found")
    return Item(id=item_db.id, name=item_db.name, description=item_db.description, quantity=item_db.quantity, price=item_db.price, category=item_db.category, min_stock=item_db.min_stock, expiration_date=item_db.expiration_date, supplier_id=item_db.supplier_id, barcode=item_db.barcode)

@router.post("/items", response_model=Item)
async def create_item(item: Item, db: AsyncSession = Depends(get_db)):
    item_db = ItemDB(name=item.name, description=item.description, quantity=item.quantity, price=item.price, category=item.category, min_stock=item.min_stock, expiration_date=item.expiration_date, supplier_id=item.supplier_id, barcode=item.barcode)
    db.add(item_db)
    await db.commit()
    await db.refresh(item_db)
    return Item(id=item_db.id, name=item_db.name, description=item_db.description, quantity=item_db.quantity, price=item_db.price, category=item_db.category, min_stock=item_db.min_stock, expiration_date=item_db.expiration_date, supplier_id=item_db.supplier_id, barcode=item_db.barcode)

@router.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: int, item_update: ItemUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ItemDB).where(ItemDB.id == item_id))
    item_db = result.scalars().first()
    if not item_db:
        raise HTTPException(status_code=404, detail="Item not found")
    if item_update.name is not None:
        item_db.name = item_update.name
    if item_update.description is not None:
        item_db.description = item_update.description
    if item_update.quantity is not None:
        item_db.quantity = item_update.quantity
    if item_update.price is not None:
        item_db.price = item_update.price
    if item_update.category is not None:
        item_db.category = item_update.category
    if item_update.min_stock is not None:
        item_db.min_stock = item_update.min_stock
    if item_update.expiration_date is not None:
        item_db.expiration_date = item_update.expiration_date
    if item_update.supplier_id is not None:
        item_db.supplier_id = item_update.supplier_id
    if item_update.barcode is not None:
        item_db.barcode = item_update.barcode
    db.add(item_db)
    await db.commit()
    await db.refresh(item_db)
    return Item(id=item_db.id, name=item_db.name, description=item_db.description, quantity=item_db.quantity, price=item_db.price, category=item_db.category, min_stock=item_db.min_stock, expiration_date=item_db.expiration_date, supplier_id=item_db.supplier_id, barcode=item_db.barcode)

@router.delete("/items/{item_id}")
async def delete_item(item_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ItemDB).where(ItemDB.id == item_id))
    item_db = result.scalars().first()
    if not item_db:
        raise HTTPException(status_code=404, detail="Item not found")
    await db.delete(item_db)
    await db.commit()
    return {"message": "Item deleted"}

# New endpoints
@router.get("/items/low-stock", response_model=List[Item])
async def get_low_stock_items(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ItemDB).where(ItemDB.quantity <= ItemDB.min_stock))
    items_db = result.scalars().all()
    return [Item(id=i.id, name=i.name, description=i.description, quantity=i.quantity, price=i.price, category=i.category, min_stock=i.min_stock, expiration_date=i.expiration_date, supplier_id=i.supplier_id, barcode=i.barcode) for i in items_db]

@router.get("/items/expiring-soon", response_model=List[Item])
async def get_expiring_soon_items(db: AsyncSession = Depends(get_db)):
    today = date.today()
    soon = today + timedelta(days=7)
    result = await db.execute(select(ItemDB).where(ItemDB.expiration_date <= soon).where(ItemDB.expiration_date.isnot(None)))
    items_db = result.scalars().all()
    return [Item(id=i.id, name=i.name, description=i.description, quantity=i.quantity, price=i.price, category=i.category, min_stock=i.min_stock, expiration_date=i.expiration_date, supplier_id=i.supplier_id, barcode=i.barcode) for i in items_db]

@router.get("/reports/total-value")
async def get_total_inventory_value(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import func
    result = await db.execute(select(func.sum(ItemDB.price * ItemDB.quantity)))
    total = result.scalar() or 0
    return {"total_value": total}

@router.get("/reports/by-category")
async def get_inventory_by_category(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import func, case
    result = await db.execute(
        select(
            case((ItemDB.category.isnot(None), ItemDB.category), else_="Uncategorized").label("category"),
            func.sum(ItemDB.price * ItemDB.quantity).label("total_value")
        ).group_by(case((ItemDB.category.isnot(None), ItemDB.category), else_="Uncategorized"))
    )
    report = {row.category: row.total_value for row in result}
    return report

# Sales reports
@router.get("/reports/sales/total-revenue")
async def get_total_sales_revenue(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import func
    result = await db.execute(select(func.sum(InvoiceDB.total_amount)))
    total = result.scalar() or 0
    return {"total_revenue": total}

@router.get("/reports/sales/revenue-by-date")
async def get_sales_revenue_by_date(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import func, extract
    result = await db.execute(
        select(
            extract('year', InvoiceDB.date).label("year"),
            extract('month', InvoiceDB.date).label("month"),
            func.sum(InvoiceDB.total_amount).label("revenue")
        ).group_by(extract('year', InvoiceDB.date), extract('month', InvoiceDB.date))
    )
    report = [{"year": int(row.year), "month": int(row.month), "revenue": row.revenue} for row in result]
    return report

# Transaction endpoints
@router.get("/transactions", response_model=List[Transaction])
async def get_transactions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TransactionDB))
    transactions_db = result.scalars().all()
    return [Transaction(id=t.id, item_id=t.item_id, change_quantity=t.change_quantity, timestamp=t.timestamp, reason=t.reason) for t in transactions_db]

@router.post("/items/{item_id}/sell")
async def sell_item(item_id: int, sell_request: SellRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ItemDB).where(ItemDB.id == item_id))
    item_db = result.scalars().first()
    if not item_db:
        raise HTTPException(status_code=404, detail="Item not found")
    if item_db.quantity < sell_request.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    item_db.quantity -= sell_request.quantity
    transaction = TransactionDB(item_id=item_id, change_quantity=-sell_request.quantity, reason="sale")
    db.add(transaction)
    await db.commit()
    await db.refresh(item_db)
    return {"message": "Item sold successfully", "remaining_quantity": item_db.quantity}

# Invoice endpoints
@router.post("/invoices", response_model=Invoice)
async def create_invoice(invoice_create: InvoiceCreate, db: AsyncSession = Depends(get_db)):
    total = 0.0
    lines = []
    for item_data in invoice_create.items:
        item_id = item_data["item_id"]
        quantity = item_data["quantity"]
        result = await db.execute(select(ItemDB).where(ItemDB.id == item_id))
        item_db = result.scalars().first()
        if not item_db:
            raise HTTPException(status_code=404, detail=f"Item {item_id} not found")
        if item_db.quantity < quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for item {item_id}")
        price = item_db.price
        total += price * quantity
        lines.append(InvoiceLineDB(item_id=item_id, quantity=quantity, price=price))
        item_db.quantity -= quantity
        transaction = TransactionDB(item_id=item_id, change_quantity=-quantity, reason="sale")
        db.add(transaction)

    invoice_db = InvoiceDB(customer_id=invoice_create.customer_id, total_amount=total)
    db.add(invoice_db)
    await db.flush()
    for line in lines:
        line.invoice_id = invoice_db.id
        db.add(line)
    await db.commit()
    await db.refresh(invoice_db)
    return Invoice(id=invoice_db.id, customer_id=invoice_db.customer_id, total_amount=invoice_db.total_amount, date=invoice_db.date, status=invoice_db.status)

@router.get("/invoices", response_model=List[Invoice])
async def get_invoices(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(InvoiceDB))
    invoices_db = result.scalars().all()
    return [Invoice(id=i.id, customer_id=i.customer_id, total_amount=i.total_amount, date=i.date, status=i.status) for i in invoices_db]

@router.get("/invoices/{invoice_id}", response_model=dict)
async def get_invoice(invoice_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(InvoiceDB).where(InvoiceDB.id == invoice_id))
    invoice_db = result.scalars().first()
    if not invoice_db:
        raise HTTPException(status_code=404, detail="Invoice not found")
    lines_result = await db.execute(select(InvoiceLineDB).where(InvoiceLineDB.invoice_id == invoice_id))
    lines_db = lines_result.scalars().all()
    lines = []
    for l in lines_db:
        item_result = await db.execute(select(ItemDB).where(ItemDB.id == l.item_id))
        item = item_result.scalars().first()
        lines.append({
            'id': l.id,
            'invoice_id': l.invoice_id,
            'item_id': l.item_id,
            'item_name': item.name if item else 'Unknown',
            'quantity': l.quantity,
            'price': l.price
        })
    customer = None
    if invoice_db.customer_id:
        cust_result = await db.execute(select(CustomerDB).where(CustomerDB.id == invoice_db.customer_id))
        cust_db = cust_result.scalars().first()
        if cust_db:
            customer = Customer(id=cust_db.id, name=cust_db.name, phone=cust_db.phone, address=cust_db.address, contact_info=cust_db.contact_info)
    due_date = invoice_db.date + timedelta(days=30)
    return {
        "invoice": Invoice(id=invoice_db.id, customer_id=invoice_db.customer_id, total_amount=invoice_db.total_amount, date=invoice_db.date, status=invoice_db.status),
        "customer": customer,
        "lines": lines,
        "due_date": due_date
    }

@router.put("/invoices/{invoice_id}/status")
async def update_invoice_status(invoice_id: int, status: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(InvoiceDB).where(InvoiceDB.id == invoice_id))
    invoice_db = result.scalars().first()
    if not invoice_db:
        raise HTTPException(status_code=404, detail="Invoice not found")
    invoice_db.status = status
    db.add(invoice_db)
    await db.commit()
    return {"message": "Invoice status updated"}