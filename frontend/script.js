const API_BASE = 'http://localhost:3000/api/v1';

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