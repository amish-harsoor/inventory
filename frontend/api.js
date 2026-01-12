const API_BASE = 'http://localhost:8000/api';

// API functions
async function fetchItems() {
    const response = await fetch(`${API_BASE}/items`);
    if (!response.ok) throw new Error('Failed to fetch items');
    return await response.json();
}

async function fetchSuppliers() {
    const response = await fetch(`${API_BASE}/suppliers`);
    if (!response.ok) throw new Error('Failed to fetch suppliers');
    return await response.json();
}

async function fetchCustomers() {
    const response = await fetch(`${API_BASE}/customers`);
    if (!response.ok) throw new Error('Failed to fetch customers');
    return await response.json();
}

async function createItem(item) {
    const response = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    });
    if (!response.ok) throw new Error('Failed to create item');
    return await response.json();
}

async function updateItem(itemId, updates) {
    const response = await fetch(`${API_BASE}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update item');
    return await response.json();
}

async function deleteItem(itemId) {
    const response = await fetch(`${API_BASE}/items/${itemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete item');
}

async function sellItem(itemId, quantity) {
    const response = await fetch(`${API_BASE}/items/${itemId}/sell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to sell item');
    }
    return await response.json();
}

async function createInvoice(invoice) {
    const response = await fetch(`${API_BASE}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice)
    });
    if (!response.ok) throw new Error('Failed to create invoice');
    return await response.json();
}

async function createSupplier(supplier) {
    const response = await fetch(`${API_BASE}/suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplier)
    });
    if (!response.ok) throw new Error('Failed to create supplier');
    return await response.json();
}

async function createCustomer(customer) {
    const response = await fetch(`${API_BASE}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
    });
    if (!response.ok) throw new Error('Failed to create customer');
    return await response.json();
}