// UI state
let allItems = [];
let allSuppliers = [];
let allCustomers = [];
let allInvoices = [];

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
    document.getElementById('edit-item-form').addEventListener('submit', handleEditItemForm);
    document.getElementById('create-invoice-form').addEventListener('submit', handleCreateInvoice);
    document.getElementById('add-invoice-item-btn').addEventListener('click', addInvoiceItem);
    document.getElementById('add-supplier-form').addEventListener('submit', handleAddSupplier);
    document.getElementById('edit-supplier-form').addEventListener('submit', handleEditSupplierForm);
    document.getElementById('add-customer-form').addEventListener('submit', handleAddCustomer);
    document.getElementById('edit-customer-form').addEventListener('submit', handleEditCustomerForm);
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
        [allItems, allSuppliers, allCustomers, allInvoices] = await Promise.all([
            fetchItems(),
            fetchSuppliers(),
            fetchCustomers(),
            fetchInvoices()
        ]);
        renderItems(allItems);
        renderSuppliers(allSuppliers);
        renderCustomers(allCustomers);
        renderInvoices(allInvoices);
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
        suppliersList.innerHTML = '<tr><td colspan="3">No suppliers found.</td></tr>';
        return;
    }
    suppliers.forEach(supplier => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${supplier.name}</td>
            <td>${supplier.contact_info || ''}</td>
            <td class="actions">
                <button class="btn-secondary" onclick="handleEditSupplier(${supplier.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-danger" onclick="handleDeleteSupplier(${supplier.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        suppliersList.appendChild(row);
    });
}

// Render customers list
function renderCustomers(customers) {
    const customersList = document.getElementById('customers-list');
    customersList.innerHTML = '';
    if (customers.length === 0) {
        customersList.innerHTML = '<tr><td colspan="5">No customers found.</td></tr>';
        return;
    }
    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.contact_info || ''}</td>
            <td>${customer.phone || ''}</td>
            <td>${customer.address || ''}</td>
            <td class="actions">
                <button class="btn-secondary" onclick="handleEditCustomer(${customer.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-danger" onclick="handleDeleteCustomer(${customer.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        customersList.appendChild(row);
    });
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

function renderInvoices(invoices) {
    const invoicesList = document.getElementById('invoices-list');
    invoicesList.innerHTML = '';
    if (invoices.length === 0) {
        invoicesList.innerHTML = '<tr><td colspan="5">No invoices found.</td></tr>';
        return;
    }
    invoices.forEach(invoice => {
        const row = document.createElement('tr');
        const customer = allCustomers.find(c => c.id === invoice.customer_id);
        row.innerHTML = `
            <td>${invoice.id}</td>
            <td>${customer ? customer.name : 'N/A'}</td>
            <td>₹${invoice.total_amount.toFixed(2)}</td>
            <td>${new Date(invoice.date).toLocaleDateString()}</td>
            <td>${invoice.status}</td>
        `;
        invoicesList.appendChild(row);
    });
}

async function handleCreateInvoice(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const customerId = formData.get('customer_id') ? parseInt(formData.get('customer_id')) : null;
    const items = [];
    const itemElements = document.querySelectorAll('.invoice-item');
    itemElements.forEach((item, index) => {
        const itemId = parseInt(formData.get(`item_id_${index + 1}`));
        const quantity = parseInt(formData.get(`invoice_quantity_${index + 1}`));
        if (itemId && quantity > 0) {
            items.push({ item_id: itemId, quantity });
        }
    });

    if (items.length === 0) {
        alert('Please add at least one item to the invoice.');
        return;
    }

    const invoice = {
        customer_id: customerId,
        items
    };

    try {
        await createInvoice(invoice);
        await loadData();
        e.target.reset();
        document.getElementById('invoice-items-container').innerHTML = `
            <div class="invoice-item">
                <div class="form-group">
                    <label for="item_id_1">Item</label>
                    <select id="item_id_1" name="item_id_1" class="invoice-item-select" required>
                        <option value="">Select Item</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="invoice_quantity_1">Quantity</label>
                    <input type="number" id="invoice_quantity_1" name="invoice_quantity_1" class="invoice-item-quantity" required>
                </div>
            </div>
        `;
        updateItemSelects();
        document.getElementById('create-invoice-modal').style.display = 'none';
        alert('Invoice created successfully');
    } catch (error) {
        console.error('Error creating invoice:', error);
        alert('Error creating invoice');
    }
}

function addInvoiceItem() {
    const container = document.getElementById('invoice-items-container');
    const newItemNum = container.children.length + 1;
    const newItem = document.createElement('div');
    newItem.classList.add('invoice-item');
    newItem.innerHTML = `
        <div class="form-group">
            <label for="item_id_${newItemNum}">Item</label>
            <select id="item_id_${newItemNum}" name="item_id_${newItemNum}" class="invoice-item-select" required>
                <option value="">Select Item</option>
            </select>
        </div>
        <div class="form-group">
            <label for="invoice_quantity_${newItemNum}">Quantity</label>
            <input type="number" id="invoice_quantity_${newItemNum}" name="invoice_quantity_${newItemNum}" class="invoice-item-quantity" required>
        </div>
    `;
    container.appendChild(newItem);
    updateItemSelects();
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

function handleEditSupplier(supplierId) {
    const supplier = allSuppliers.find(s => s.id === supplierId);
    if (supplier) {
        document.getElementById('edit_supplier_id').value = supplier.id;
        document.getElementById('edit_supplier_name').value = supplier.name;
        document.getElementById('edit_supplier_contact_info').value = supplier.contact_info;
        document.getElementById('edit-supplier-modal').style.display = 'block';
    }
}

async function handleEditSupplierForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const supplierId = parseInt(formData.get('id'));
    const name = formData.get('name').trim();
    const contact_info = formData.get('contact_info').trim();

    if (!name) {
        alert('Name is required');
        return;
    }

    const supplier = {
        id: supplierId,
        name,
        contact_info
    };

    try {
        await updateSupplier(supplierId, supplier);
        await loadData();
        document.getElementById('edit-supplier-modal').style.display = 'none';
    } catch (error) {
        console.error('Error updating supplier:', error);
        alert('Error updating supplier');
    }
}

async function handleDeleteSupplier(supplierId) {
    if (confirm('Are you sure you want to delete this supplier?')) {
        try {
            await deleteSupplier(supplierId);
            await loadData();
        } catch (error) {
            console.error('Error deleting supplier:', error);
            alert('Error deleting supplier');
        }
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

function handleEditCustomer(customerId) {
    const customer = allCustomers.find(c => c.id === customerId);
    if (customer) {
        document.getElementById('edit_customer_id').value = customer.id;
        document.getElementById('edit_customer_name').value = customer.name;
        document.getElementById('edit_customer_email').value = customer.contact_info;
        document.getElementById('edit_customer_phone').value = customer.phone;
        document.getElementById('edit_customer_address').value = customer.address;
        document.getElementById('edit-customer-modal').style.display = 'block';
    }
}

async function handleEditCustomerForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const customerId = parseInt(formData.get('id'));
    const name = formData.get('name').trim();

    if (!name) {
        alert('Name is required');
        return;
    }

    const customer = {
        id: customerId,
        name,
        phone: formData.get('phone').trim(),
        address: formData.get('address').trim(),
        contact_info: formData.get('email').trim()
    };

    try {
        await updateCustomer(customerId, customer);
        await loadData();
        document.getElementById('edit-customer-modal').style.display = 'none';
    } catch (error) {
        console.error('Error updating customer:', error);
        alert('Error updating customer');
    }
}

async function handleDeleteCustomer(customerId) {
    if (confirm('Are you sure you want to delete this customer?')) {
        try {
            await deleteCustomer(customerId);
            await loadData();
        } catch (error) {
            console.error('Error deleting customer:', error);
            alert('Error deleting customer');
        }
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
    const item = allItems.find(i => i.id === itemId);
    if (item) {
        document.getElementById('edit_item_id').value = item.id;
        document.getElementById('edit_name').value = item.name;
        document.getElementById('edit_description').value = item.description || '';
        document.getElementById('edit_quantity').value = item.quantity;
        document.getElementById('edit_price').value = item.price;
        document.getElementById('edit_category').value = item.category || '';
        document.getElementById('edit_min_stock').value = item.min_stock || '';
        document.getElementById('edit_supplier_id').value = item.supplier_id || '';
        document.getElementById('edit_barcode').value = item.barcode || '';
        document.getElementById('edit-item-modal').style.display = 'block';
    }
}

async function handleEditItemForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const itemId = parseInt(formData.get('id'));
    const item = {
        name: formData.get('name').trim(),
        description: formData.get('description').trim(),
        quantity: parseInt(formData.get('quantity')),
        price: parseFloat(formData.get('price')),
        category: formData.get('category').trim(),
        min_stock: parseInt(formData.get('min_stock')) || 1,
        supplier_id: formData.get('supplier_id') ? parseInt(formData.get('supplier_id')) : null,
        barcode: formData.get('barcode').trim()
    };

    try {
        await updateItem(itemId, item);
        await loadData();
        document.getElementById('edit-item-modal').style.display = 'none';
    } catch (error) {
        console.error('Error updating item:', error);
        alert('Error updating item');
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