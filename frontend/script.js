const API_BASE = 'http://localhost:8000/api';

// Load items on page load
document.addEventListener('DOMContentLoaded', () => {
    loadItems();
    loadSuppliers();
    loadCustomers();
});

// Load items
async function loadItems() {
    try {
        const response = await fetch(`${API_BASE}/items`);
        const items = await response.json();
        const itemsList = document.getElementById('items-list');
        itemsList.innerHTML = '';
        const itemSelect = document.getElementById('item-id');
        itemSelect.innerHTML = '<option value="">Select Item</option>';
        items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${item.name}</strong> - Qty: ${item.quantity}, Price: ₹${item.price}
                <button onclick="sellItem(${item.id}, '${item.name}')">Sell</button>
                <button onclick="editItem(${item.id})">Edit</button>
                <button onclick="deleteItem(${item.id})">Delete</button>
            `;
            itemsList.appendChild(li);
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            itemSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading items:', error);
    }
}

// Load suppliers
async function loadSuppliers() {
    try {
        const response = await fetch(`${API_BASE}/suppliers`);
        const suppliers = await response.json();
        const supplierSelect = document.getElementById('supplier-id');
        supplierSelect.innerHTML = '<option value="">Select Supplier</option>';
        suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = supplier.name;
            supplierSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading suppliers:', error);
    }
}

// Load customers
async function loadCustomers() {
    try {
        const response = await fetch(`${API_BASE}/customers`);
        const customers = await response.json();
        const customerSelect = document.getElementById('customer-id');
        customerSelect.innerHTML = '<option value="">Select Customer</option>';
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.name;
            customerSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

// Add item
document.getElementById('add-item-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const item = {
        name: formData.get('name'),
        description: formData.get('description'),
        quantity: parseInt(formData.get('quantity')),
        price: parseFloat(formData.get('price')),
        category: formData.get('category'),
        min_stock: parseInt(formData.get('min_stock')) || 1,
        supplier_id: formData.get('supplier_id') ? parseInt(formData.get('supplier_id')) : null,
        barcode: formData.get('barcode')
    };
    try {
        const response = await fetch(`${API_BASE}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        if (response.ok) {
            loadItems();
            e.target.reset();
        } else {
            alert('Error adding item');
        }
    } catch (error) {
        console.error('Error adding item:', error);
    }
});

// Sell item
async function sellItem(itemId, itemName) {
    const quantity = prompt(`Enter quantity to sell for ${itemName}:`);
    if (quantity && quantity > 0) {
        try {
            const response = await fetch(`${API_BASE}/items/${itemId}/sell`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: parseInt(quantity) })
            });
            if (response.ok) {
                loadItems();
            } else {
                const error = await response.json();
                alert(error.detail);
            }
        } catch (error) {
            console.error('Error selling item:', error);
        }
    }
}

// Edit item (simplified)
async function editItem(itemId) {
    // For simplicity, just prompt for new quantity
    const newQuantity = prompt('Enter new quantity:');
    if (newQuantity !== null) {
        try {
            const response = await fetch(`${API_BASE}/items/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: parseInt(newQuantity) })
            });
            if (response.ok) {
                loadItems();
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    }
}

// Delete item
async function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            const response = await fetch(`${API_BASE}/items/${itemId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadItems();
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }
}

// Create invoice
document.getElementById('create-invoice-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const items = [];
    // For simplicity, assume one item
    const itemId = parseInt(formData.get('item_id'));
    const quantity = parseInt(formData.get('invoice_quantity'));
    if (itemId && quantity) {
        items.push({ item_id: itemId, quantity });
    }
    const invoice = {
        customer_id: formData.get('customer_id') ? parseInt(formData.get('customer_id')) : null,
        items
    };
    try {
        const response = await fetch(`${API_BASE}/invoices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invoice)
        });
        if (response.ok) {
            loadItems();
            e.target.reset();
            alert('Invoice created');
        } else {
            alert('Error creating invoice');
        }
    } catch (error) {
        console.error('Error creating invoice:', error);
    }
});