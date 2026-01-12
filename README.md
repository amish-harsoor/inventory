# Inventory Management API

A comprehensive FastAPI-based inventory management system designed for retail operations like supermarkets and stores. Features persistent data storage, sales tracking, purchase order management, and advanced inventory controls.

## Features

- **Item Management**: CRUD operations for inventory items with categories, expiration dates, and barcodes
- **Supplier Management**: Track suppliers and link them to items
- **Sales Tracking**: Record sales transactions that automatically update inventory levels
- **Purchase Orders**: Manage restocking orders with status tracking
- **Low Stock Alerts**: Identify items below minimum stock levels
- **Expiration Monitoring**: Track items expiring soon
- **Inventory Reports**: Generate reports on total value and category breakdowns
- **Database Persistence**: SQLite database with SQLAlchemy for data persistence
- **Asynchronous Operations**: High-performance async endpoints
- **Auto-generated API Docs**: Interactive documentation at `/docs`

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
- `GET /api/items` - List all items (optional `?category=<category>` filter)
- `GET /api/items/{id}` - Get specific item
- `POST /api/items` - Create new item
- `PUT /api/items/{id}` - Update item
- `DELETE /api/items/{id}` - Delete item

### Suppliers
- `GET /api/suppliers` - List all suppliers
- `GET /api/suppliers/{id}` - Get specific supplier
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/{id}` - Update supplier
- `DELETE /api/suppliers/{id}` - Delete supplier

### Sales
- `GET /api/sales` - List all sales
- `POST /api/sales` - Record a new sale (updates inventory)

### Purchase Orders
- `GET /api/purchase-orders` - List all purchase orders
- `POST /api/purchase-orders` - Create new purchase order
- `PUT /api/purchase-orders/{id}` - Update purchase order (mark as received to update inventory)

### Alerts & Reports
- `GET /api/items/low-stock` - Get items below minimum stock
- `GET /api/items/expiring-soon` - Get items expiring within 7 days
- `GET /api/reports/total-value` - Get total inventory value
- `GET /api/reports/by-category` - Get inventory value by category

## Data Models

### Item
```json
{
  "id": 1,
  "name": "Milk",
  "description": "Fresh whole milk",
  "quantity": 50,
  "price": 2.99,
  "category": "Dairy",
  "min_stock": 10,
  "expiration_date": "2024-12-31",
  "supplier_id": 1,
  "barcode": "123456789012"
}
```

### Supplier
```json
{
  "id": 1,
  "name": "Dairy Farms Inc",
  "contact_info": "contact@dairyfarms.com"
}
```

### Sale
```json
{
  "id": 1,
  "item_id": 1,
  "quantity_sold": 5,
  "sale_date": "2024-12-30",
  "total_price": 14.95
}
```

### Purchase Order
```json
{
  "id": 1,
  "supplier_id": 1,
  "item_id": 1,
  "quantity": 100,
  "order_date": "2024-12-30",
  "status": "pending"
}
```

## Usage Examples

### Create an Item
```bash
curl -X POST "http://localhost:8000/api/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apple",
    "quantity": 100,
    "price": 0.50,
    "category": "Produce",
    "min_stock": 20,
    "barcode": "987654321098"
  }'
```

### Record a Sale
```bash
curl -X POST "http://localhost:8000/api/sales" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": 1,
    "quantity_sold": 10,
    "sale_date": "2024-12-30",
    "total_price": 5.00
  }'
```

### Check Low Stock Items
```bash
curl "http://localhost:8000/api/items/low-stock"
```

## Database

The application uses SQLite with SQLAlchemy. The database file `inventory.db` is created automatically on first run. Tables are created using SQLAlchemy's metadata.

## Development

- Uses FastAPI for the web framework
- Pydantic for data validation
- SQLAlchemy for ORM
- Uvicorn as ASGI server

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