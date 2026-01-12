# Inventory Management API

A comprehensive FastAPI-based inventory management system designed for retail operations like supermarkets and stores. Features persistent data storage, sales tracking, customer and invoice management, and advanced inventory controls.

## Features

- **Item Management**: CRUD operations for inventory items with categories, expiration dates, and barcodes.
- **Supplier Management**: Track suppliers and link them to items.
- **Customer Management**: CRUD operations for customers.
- **Invoice Management**: Create and track customer invoices.
- **Sales Tracking**: Record sales transactions that automatically update inventory levels.
- **Low Stock Alerts**: Identify items below minimum stock levels.
- **Expiration Monitoring**: Track items expiring soon.
- **Inventory & Sales Reports**: Generate reports on inventory value and sales revenue.
- **Database Persistence**: SQLite database with SQLAlchemy for data persistence.
- **Asynchronous Operations**: High-performance async endpoints.
- **Auto-generated API Docs**: Interactive documentation at `/docs`.

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd inventory
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

Start the server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

- API documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

## API Endpoints

### Items
- `GET /api/items` - List all items (optional `?category=<category>` filter).
- `GET /api/items/{id}` - Get a specific item.
- `POST /api/items` - Create a new item.
- `PUT /api/items/{id}` - Update an item.
- `DELETE /api/items/{id}` - Delete an item.
- `POST /api/items/{item_id}/sell` - Record a simple sale of an item.

### Suppliers
- `GET /api/suppliers` - List all suppliers.
- `GET /api/suppliers/{id}` - Get a specific supplier.
- `POST /api/suppliers` - Create a new supplier.
- `PUT /api/suppliers/{id}` - Update a supplier.
- `DELETE /api/suppliers/{id}` - Delete a supplier.

### Customers
- `GET /api/customers` - List all customers.
- `GET /api/customers/{id}` - Get a specific customer.
- `POST /api/customers` - Create a new customer.
- `PUT /api/customers/{id}` - Update a customer.
- `DELETE /api/customers/{id}` - Delete a customer.

### Invoices
- `GET /api/invoices` - List all invoices.
- `GET /api/invoices/{id}` - Get a specific invoice with its line items.
- `POST /api/invoices` - Create a new invoice from one or more items.
- `PUT /api/invoices/{id}/status` - Update the status of an invoice.

### Transactions
- `GET /api/transactions` - List all inventory transactions (sales, restocks, etc.).

### Alerts & Reports
- `GET /api/items/low-stock` - Get items below their minimum stock level.
- `GET /api/items/expiring-soon` - Get items expiring within the next 7 days.
- `GET /api/reports/total-value` - Get the total value of all inventory.
- `GET /api/reports/by-category` - Get the total inventory value broken down by category.
- `GET /api/reports/sales/total-revenue` - Get the total revenue from all sales.
- `GET /api/reports/sales/revenue-by-date` - Get sales revenue grouped by month.

## Data Models

### Item
```json
{
  "id": 1,
  "name": "Basmati Rice",
  "description": "Premium long grain basmati rice",
  "quantity": 100,
  "price": 120.0,
  "category": "Grains",
  "min_stock": 20,
  "expiration_date": null,
  "supplier_id": 2,
  "barcode": "123456789001"
}
```

### Supplier
```json
{
  "id": 1,
  "name": "Spice Traders India",
  "contact_info": "spices@india.com"
}
```

### Customer
```json
{
  "id": 1,
  "name": "John Doe",
  "phone": "123-456-7890",
  "address": "123 Main St",
  "contact_info": "john.doe@example.com"
}
```

### Invoice
```json
{
  "id": 1,
  "customer_id": 1,
  "total_amount": 240.0,
  "date": "2024-07-30T12:00:00Z",
  "status": "pending"
}
```

### Transaction
```json
{
  "id": 1,
  "item_id": 1,
  "change_quantity": -2,
  "timestamp": "2024-07-30T12:00:00Z",
  "reason": "sale"
}
```

## Usage Examples

### Create a Customer
```bash
curl -X POST "http://localhost:8000/api/customers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "phone": "555-555-5555",
    "address": "456 Oak Ave",
    "contact_info": "jane.smith@example.com"
  }'
```

### Create an Invoice
```bash
curl -X POST "http://localhost:8000/api/invoices" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      { "item_id": 1, "quantity": 2 },
      { "item_id": 2, "quantity": 5 }
    ]
  }'
```

### Check Low Stock Items
```bash
curl "http://localhost:8000/api/items/low-stock"
```

## Database

The application uses SQLite with SQLAlchemy. The database file `inventory.db` is created automatically on the first run. Tables are created using SQLAlchemy's metadata.

## Development

- FastAPI for the web framework
- Pydantic for data validation
- SQLAlchemy for ORM
- Uvicorn as the ASGI server

## Future Enhancements

- User authentication and role-based access
- Multi-location/store support
- Real-time notifications
- Advanced analytics and reporting
- POS system integration
- Batch and lot tracking
- Audit logging

## License

MIT License
