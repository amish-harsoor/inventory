const API_BASE = 'http://localhost:3000/api/v1';

// Auto-load dashboard data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadAlerts();
    loadInventorySummary();
});

// Load Locations
async function loadLocations() {
    try {
        const response = await fetch(`${API_BASE}/locations`);
        const locations = await response.json();
        const tbody = document.querySelector('#locationsTable tbody');
        tbody.innerHTML = '';
        locations.forEach(location => {
            const row = `<tr>
                <td>${location.id}</td>
                <td>${location.warehouseId || ''}</td>
                <td>${location.locationType}</td>
                <td>${location.address}</td>
                <td>${location.capacity || ''}</td>
                <td>${location.active}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading locations:', error);
    }
}

// Add Location
document.getElementById('locationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        warehouseId: document.getElementById('warehouseId').value,
        locationType: document.getElementById('locationType').value,
        address: document.getElementById('address').value,
        capacity: parseInt(document.getElementById('capacity').value) || null
    };
    try {
        const response = await fetch(`${API_BASE}/locations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            loadLocations();
            document.getElementById('locationForm').reset();
        } else {
            console.error('Error adding location');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Load Products
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const products = await response.json();
        const tbody = document.querySelector('#productsTable tbody');
        tbody.innerHTML = '';
        products.forEach(product => {
            const row = `<tr>
                <td>${product.id}</td>
                <td>${product.sku}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.active}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Add Product
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        sku: document.getElementById('sku').value,
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        unitOfMeasure: document.getElementById('unitOfMeasure').value
    };
    try {
        const response = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            loadProducts();
            document.getElementById('productForm').reset();
        } else {
            console.error('Error adding product');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Load Inventory
async function loadInventory() {
    try {
        const response = await fetch(`${API_BASE}/inventory`);
        const inventories = await response.json();
        const tbody = document.querySelector('#inventoryTable tbody');
        tbody.innerHTML = '';
        inventories.forEach(inv => {
            const row = `<tr>
                <td>${inv.Product ? inv.Product.name : 'N/A'}</td>
                <td>${inv.Location ? inv.Location.address : 'N/A'}</td>
                <td>${inv.quantityOnHand}</td>
                <td>${inv.quantityReserved}</td>
                <td>${inv.quantityAvailable}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading inventory:', error);
    }
}

// Adjust Stock
document.getElementById('adjustForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        productId: parseInt(document.getElementById('adjProductId').value),
        locationId: parseInt(document.getElementById('adjLocationId').value),
        adjustment: parseInt(document.getElementById('adjustment').value)
    };
    try {
        const response = await fetch(`${API_BASE}/inventory/adjust`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            loadInventory();
            document.getElementById('adjustForm').reset();
        } else {
            console.error('Error adjusting stock');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Load Movements
async function loadMovements() {
    try {
        const response = await fetch(`${API_BASE}/movements`);
        const movements = await response.json();
        const tbody = document.querySelector('#movementsTable tbody');
        tbody.innerHTML = '';
        movements.forEach(movement => {
            const row = `<tr>
                <td>${movement.transactionType}</td>
                <td>${movement.Product ? movement.Product.name : 'N/A'}</td>
                <td>${movement.FromLocation ? movement.FromLocation.address : ''}</td>
                <td>${movement.ToLocation ? movement.ToLocation.address : ''}</td>
                <td>${movement.quantity}</td>
                <td>${new Date(movement.movementDate).toLocaleDateString()}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading movements:', error);
    }
}

// Receive Stock
document.getElementById('receiveForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        productId: parseInt(document.getElementById('recProductId').value),
        toLocationId: parseInt(document.getElementById('recLocationId').value),
        quantity: parseInt(document.getElementById('recQuantity').value),
        referenceNumber: document.getElementById('recReference').value
    };
    try {
        const response = await fetch(`${API_BASE}/movements/receive`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            loadMovements();
            loadInventory();
            document.getElementById('receiveForm').reset();
        } else {
            console.error('Error receiving stock');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Ship Stock
document.getElementById('shipForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        productId: parseInt(document.getElementById('shipProductId').value),
        fromLocationId: parseInt(document.getElementById('shipLocationId').value),
        quantity: parseInt(document.getElementById('shipQuantity').value),
        referenceNumber: document.getElementById('shipReference').value
    };
    try {
        const response = await fetch(`${API_BASE}/movements/ship`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            loadMovements();
            loadInventory();
            document.getElementById('shipForm').reset();
        } else {
            console.error('Error shipping stock');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Transfer Stock
document.getElementById('transferForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        productId: parseInt(document.getElementById('transProductId').value),
        fromLocationId: parseInt(document.getElementById('transFromId').value),
        toLocationId: parseInt(document.getElementById('transToId').value),
        quantity: parseInt(document.getElementById('transQuantity').value)
    };
    try {
        const response = await fetch(`${API_BASE}/movements/transfer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            loadMovements();
            loadInventory();
            document.getElementById('transferForm').reset();
        } else {
            console.error('Error transferring stock');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Load Reservations
async function loadReservations() {
    try {
        const response = await fetch(`${API_BASE}/reservations`);
        const reservations = await response.json();
        const tbody = document.querySelector('#reservationsTable tbody');
        tbody.innerHTML = '';
        reservations.forEach(reservation => {
            const row = `<tr>
                <td>${reservation.Product ? reservation.Product.name : 'N/A'}</td>
                <td>${reservation.Location ? reservation.Location.address : 'N/A'}</td>
                <td>${reservation.quantityReserved}</td>
                <td>${reservation.referenceId || ''}</td>
                <td>${reservation.status}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading reservations:', error);
    }
}

// Create Reservation
document.getElementById('reservationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        productId: parseInt(document.getElementById('resProductId').value),
        locationId: parseInt(document.getElementById('resLocationId').value),
        quantityReserved: parseInt(document.getElementById('resQuantity').value),
        referenceId: document.getElementById('resReference').value
    };
    try {
        const response = await fetch(`${API_BASE}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            loadReservations();
            loadInventory();
            document.getElementById('reservationForm').reset();
        } else {
            console.error('Error creating reservation');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Load Alerts
async function loadAlerts() {
    try {
        const response = await fetch(`${API_BASE}/alerts/low-stock`);
        const alerts = await response.json();
        const div = document.getElementById('alerts');
        div.innerHTML = '';
        if (alerts.length === 0) {
            div.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> All items are sufficiently stocked!</div>';
        } else {
            alerts.forEach(alert => {
                div.innerHTML += `<div class="alert alert-warning"><i class="fas fa-exclamation-triangle"></i> <strong>${alert.Product.name}</strong> at ${alert.Location.address}: ${alert.quantityOnHand} on hand (Reorder point: ${alert.reorderPoint})</div>`;
            });
        }
    } catch (error) {
        console.error('Error loading alerts:', error);
        document.getElementById('alerts').innerHTML = '<div class="alert alert-danger"><i class="fas fa-exclamation-circle"></i> Error loading alerts.</div>';
    }
}

// Load Inventory Summary
async function loadInventorySummary() {
    try {
        const response = await fetch(`${API_BASE}/reports/inventory-summary`);
        const summary = await response.json();
        const div = document.getElementById('inventorySummary');
        if (summary.length === 0) {
            div.innerHTML = '<p class="text-muted">No inventory data available.</p>';
        } else {
            div.innerHTML = '<table class="table table-sm table-hover"><thead><tr><th>Product</th><th>Location</th><th>On Hand</th><th>Reserved</th><th>Available</th></tr></thead><tbody>';
            summary.forEach(item => {
                div.innerHTML += `<tr><td>${item.Product.name}</td><td>${item.Location.address}</td><td>${item.quantityOnHand}</td><td>${item.quantityReserved}</td><td>${item.quantityAvailable}</td></tr>`;
            });
            div.innerHTML += '</tbody></table>';
        }
    } catch (error) {
        console.error('Error loading inventory summary:', error);
        document.getElementById('inventorySummary').innerHTML = '<div class="alert alert-danger"><i class="fas fa-exclamation-circle"></i> Error loading summary.</div>';
    }
}

// Load Stock Movement Report
async function loadStockMovementReport() {
    try {
        const response = await fetch(`${API_BASE}/reports/stock-movement`);
        const report = await response.json();
        const div = document.getElementById('stockMovementReport');
        if (report.length === 0) {
            div.innerHTML = '<p class="text-muted">No movement data available.</p>';
        } else {
            div.innerHTML = '<table class="table table-striped"><thead><tr><th>Type</th><th>Product</th><th>Quantity</th><th>Date</th></tr></thead><tbody>';
            report.forEach(item => {
                div.innerHTML += `<tr><td>${item.transactionType}</td><td>${item.Product.name}</td><td>${item.quantity}</td><td>${new Date(item.movementDate).toLocaleDateString()}</td></tr>`;
            });
            div.innerHTML += '</tbody></table>';
        }
    } catch (error) {
        console.error('Error loading stock movement report:', error);
        document.getElementById('stockMovementReport').innerHTML = '<div class="alert alert-danger"><i class="fas fa-exclamation-circle"></i> Error loading report.</div>';
    }
};