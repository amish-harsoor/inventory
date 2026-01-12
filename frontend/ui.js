// UI state
let allItems = [];
let allSuppliers = [];
let allCustomers = [];

// DOM elements
const itemsList = document.getElementById('items-list');
const searchInput = document.getElementById('search-input');
const filterCategory = document.getElementById('filter-category');

// Initialize UI
function initUI() {
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('nav-items').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('items-section');
    });
    document.getElementById('nav-invoices').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('invoices-section');
    });
    document.getElementById('nav-suppliers').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('suppliers-section');
    });
    document.getElementById('nav-customers').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('customers-section');
    });

    // Modals
    document.getElementById('add-item-btn').addEventListener('click', () => {
        document.getElementById('add-item-modal').style.display = 'block';
    });
    document.getElementById('create-invoice-btn').addEventListener('click', () => {
        document.getElementById('create-invoice-modal').style.display = 'block';
    });
    document.getElementById('add-supplier-btn').addEventListener('click', () => {
        document.getElementById('add-supplier-modal').style.display = 'block';
    });
    document.getElementById('add-customer-btn').addEventListener('click', () => {
        document.getElementById('add-customer-modal').style.display = 'block';
    });

    // Close modals
    document.querySelectorAll('.close').forEach(close => {
        close.addEventListener('click', () => {
            close.closest('.modal').style.display = 'none';
        });
    });

    // Search and filter
    searchInput.addEventListener('input', filterItems);
    filterCategory.addEventListener('change', filterItems);

    // Forms
    document.getElementById('add-item-form').addEventListener('submit', handleAddItem);
    document.getElementById('create-invoice-form').addEventListener('submit', handleCreateInvoice);
    document.getElementById('add-supplier-form').addEventListener('submit', handleAddSupplier);
    document.getElementById('add-customer-form').addEventListener('submit', handleAddCustomer);
}

// Show section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    document.querySelector(`#nav-${sectionId.replace('-section', '')}`).classList.add('active');
}

// Load data
async function loadData() {
    try {
        [allItems, allSuppliers, allCustomers] = await Promise.all([
            fetchItems(),
            fetchSuppliers(),
            fetchCustomers()
        ]);
        renderItems(allItems);
        renderSuppliers(allSuppliers);
        renderCustomers(allCustomers);
        updateCategories();
        updateSelects();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data');
    }
}

// Render items table
function renderItems(items) {
    itemsList.innerHTML = '';
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.description || ''}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price}</td>
            <td>${item.category || ''}</td>
            <td class="actions">
                <button class="btn-secondary" onclick="handleSellItem(${item.id}, '${item.name}')"><i class="fas fa-shopping-cart"></i></button>
                <button class="btn-secondary" onclick="handleEditItem(${item.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-danger" onclick="handleDeleteItem(${item.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        itemsList.appendChild(row);
    });
}

// Render suppliers list
function renderSuppliers(suppliers) {
    const suppliersList = document.getElementById('suppliers-list');
    suppliersList.innerHTML = '';
    if (suppliers.length === 0) {
        suppliersList.innerHTML = '<p>No suppliers found.</p>';
        return;
    }
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Contact Info</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;
    const tbody = table.querySelector('tbody');
    suppliers.forEach(supplier => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${supplier.name}</td>
            <td>${supplier.contact_info || ''}</td>
        `;
        tbody.appendChild(row);
    });
    suppliersList.appendChild(table);
}

// Render customers list
function renderCustomers(customers) {
    const customersList = document.getElementById('customers-list');
    customersList.innerHTML = '';
    if (customers.length === 0) {
        customersList.innerHTML = '<p>No customers found.</p>';
        return;
    }
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;
    const tbody = table.querySelector('tbody');
    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.contact_info || ''}</td>
            <td>${customer.phone || ''}</td>
            <td>${customer.address || ''}</td>
        `;
        tbody.appendChild(row);
    });
    customersList.appendChild(table);
}

// Update categories filter
function updateCategories() {
    const categories = [...new Set(allItems.map(item => item.category).filter(cat => cat))];
    filterCategory.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        filterCategory.appendChild(option);
    });
}

// Filter items
function filterItems() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryFilter = filterCategory.value;
    const filtered = allItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                             (item.description && item.description.toLowerCase().includes(searchTerm));
        const matchesCategory = !categoryFilter || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    renderItems(filtered);
}

// Update selects
function updateSelects() {
    updateSupplierSelects();
    updateCustomerSelects();
    updateItemSelects();
}

function updateSupplierSelects() {
    const selects = document.querySelectorAll('#supplier-id');
    selects.forEach(select => {
        select.innerHTML = '<option value="">Select Supplier</option>';
        allSuppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = supplier.name;
            select.appendChild(option);
        });
    });
}

function updateCustomerSelects() {
    const selects = document.querySelectorAll('#customer-id');
    selects.forEach(select => {
        select.innerHTML = '<option value="">Select Customer</option>';
        allCustomers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.name;
            select.appendChild(option);
        });
    });
}

function updateItemSelects() {
    const selects = document.querySelectorAll('#item-id');
    selects.forEach(select => {
        select.innerHTML = '<option value="">Select Item</option>';
        allItems.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            select.appendChild(option);
        });
    });
}

// Form handlers
async function handleAddItem(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name').trim();
    const quantity = parseInt(formData.get('quantity'));
    const price = parseFloat(formData.get('price'));

    if (!name) {
        alert('Name is required');
        return;
    }
    if (isNaN(quantity) || quantity < 0) {
        alert('Quantity must be a positive number');
        return;
    }
    if (isNaN(price) || price <= 0) {
        alert('Price must be a positive number');
        return;
    }

    const item = {
        name,
        description: formData.get('description').trim(),
        quantity,
        price,
        category: formData.get('category').trim(),
        min_stock: parseInt(formData.get('min_stock')) || 1,
        supplier_id: formData.get('supplier_id') ? parseInt(formData.get('supplier_id')) : null,
        barcode: formData.get('barcode').trim()
    };

    try {
        await createItem(item);
        await loadData();
        e.target.reset();
        document.getElementById('add-item-modal').style.display = 'none';
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Error adding item');
    }
}

async function handleCreateInvoice(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const itemId = parseInt(formData.get('item_id'));
    const quantity = parseInt(formData.get('invoice_quantity'));

    if (!itemId) {
        alert('Please select an item');
        return;
    }
    if (isNaN(quantity) || quantity <= 0) {
        alert('Quantity must be a positive number');
        return;
    }

    const invoice = {
        customer_id: formData.get('customer_id') ? parseInt(formData.get('customer_id')) : null,
        items: [{ item_id: itemId, quantity }]
    };

    try {
        await createInvoice(invoice);
        await loadData();
        e.target.reset();
        document.getElementById('create-invoice-modal').style.display = 'none';
        alert('Invoice created successfully');
    } catch (error) {
        console.error('Error creating invoice:', error);
        alert('Error creating invoice');
    }
}

async function handleAddSupplier(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name').trim();
    const contact_info = formData.get('contact_info').trim();

    if (!name) {
        alert('Name is required');
        return;
    }

    const supplier = {
        name,
        contact_info
    };

    try {
        await createSupplier(supplier);
        await loadData();
        e.target.reset();
        document.getElementById('add-supplier-modal').style.display = 'none';
    } catch (error) {
        console.error('Error adding supplier:', error);
        alert('Error adding supplier');
    }
}

async function handleAddCustomer(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name').trim();

    if (!name) {
        alert('Name is required');
        return;
    }

    const customer = {
        name,
        phone: formData.get('phone').trim(),
        address: formData.get('address').trim(),
        contact_info: formData.get('email').trim()
    };

    try {
        await createCustomer(customer);
        await loadData();
        e.target.reset();
        document.getElementById('add-customer-modal').style.display = 'none';
    } catch (error) {
        console.error('Error adding customer:', error);
        alert('Error adding customer');
    }
}

// Action handlers
async function handleSellItem(itemId, itemName) {
    const quantity = prompt(`Enter quantity to sell for ${itemName}:`);
    if (quantity && quantity > 0) {
        try {
            await sellItem(itemId, parseInt(quantity));
            await loadData();
        } catch (error) {
            console.error('Error selling item:', error);
            alert(error.message);
        }
    }
}

async function handleEditItem(itemId) {
    const newQuantity = prompt('Enter new quantity:');
    if (newQuantity !== null) {
        try {
            await updateItem(itemId, { quantity: parseInt(newQuantity) });
            await loadData();
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Error updating item');
        }
    }
}

async function handleDeleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            await deleteItem(itemId);
            await loadData();
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item');
        }
    }
}