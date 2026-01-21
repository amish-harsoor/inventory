from flask import Flask, render_template, request, redirect, url_for
import requests
from datetime import datetime, timedelta

app = Flask(__name__)

API_BASE = 'http://localhost:8000/api'

@app.template_filter('localtime')
def localtime_filter(dt_str):
    if dt_str:
        dt = datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
        return (dt + timedelta(hours=5, minutes=30)).strftime('%d/%m/%Y %H:%M')
    return ''

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/items')
def items():
    try:
        response = requests.get(f'{API_BASE}/items')
        items = response.json()
    except:
        items = []
    return render_template('inventory.html', items=items)

@app.route('/add_item', methods=['GET', 'POST'])
def add_item():
    if request.method == 'POST':
        data = {
            'name': request.form['name'],
            'description': request.form['description'],
            'quantity': int(request.form['quantity']),
            'price': float(request.form['price']),
            'category': request.form['category'],
            'min_stock': int(request.form['min_stock']),
            'supplier_id': int(request.form['supplier_id']),
            'barcode': request.form['barcode']
        }
        requests.post(f'{API_BASE}/items', json=data)
        return redirect(url_for('items'))
    try:
        response = requests.get(f'{API_BASE}/suppliers')
        suppliers = response.json()
    except:
        suppliers = []
    return render_template('add_item.html', suppliers=suppliers)

@app.route('/edit_item/<int:item_id>', methods=['GET', 'POST'])
def edit_item(item_id):
    if request.method == 'POST':
        data = {
            'name': request.form['name'],
            'description': request.form['description'],
            'quantity': int(request.form['quantity']),
            'price': float(request.form['price']),
            'category': request.form['category'],
            'min_stock': int(request.form['min_stock']),
            'supplier_id': int(request.form['supplier_id']),
            'barcode': request.form['barcode']
        }
        requests.put(f'{API_BASE}/items/{item_id}', json=data)
        return redirect(url_for('items'))
    try:
        item_response = requests.get(f'{API_BASE}/items/{item_id}')
        item = item_response.json()
        suppliers_response = requests.get(f'{API_BASE}/suppliers')
        suppliers = suppliers_response.json()
    except:
        item = {}
        suppliers = []
    return render_template('edit_item.html', item=item, suppliers=suppliers)

@app.route('/delete_item/<int:item_id>')
def delete_item(item_id):
    requests.delete(f'{API_BASE}/items/{item_id}')
    return redirect(url_for('items'))

@app.route('/sell_item/<int:item_id>', methods=['POST'])
def sell_item(item_id):
    quantity = int(request.form['quantity'])
    response = requests.post(f'{API_BASE}/items/{item_id}/sell', json={'quantity': quantity})
    if response.status_code == 200:
        return redirect(url_for('items'))
    else:
        # Handle error, for now just redirect
        return redirect(url_for('items'))

@app.route('/suppliers')
def suppliers():
    try:
        response = requests.get(f'{API_BASE}/suppliers')
        suppliers = response.json()
    except:
        suppliers = []
    return render_template('suppliers.html', suppliers=suppliers)

@app.route('/add_supplier', methods=['GET', 'POST'])
def add_supplier():
    if request.method == 'POST':
        data = {
            'name': request.form['name'],
            'contact_info': request.form['contact_info']
        }
        requests.post(f'{API_BASE}/suppliers', json=data)
        return redirect(url_for('suppliers'))
    return render_template('add_supplier.html')

@app.route('/customers')
def customers():
    try:
        response = requests.get(f'{API_BASE}/customers')
        customers = response.json()
    except:
        customers = []
    return render_template('customers.html', customers=customers)

@app.route('/add_customer', methods=['GET', 'POST'])
def add_customer():
    if request.method == 'POST':
        data = {
            'name': request.form['name'],
            'phone': request.form['phone'],
            'address': request.form['address'],
            'contact_info': request.form.get('contact_info', '')
        }
        requests.post(f'{API_BASE}/customers', json=data)
        return redirect(url_for('customers'))
    return render_template('add_customer.html')

@app.route('/reports')
def reports():
    try:
        total_response = requests.get(f'{API_BASE}/reports/total-value')
        total = total_response.json()
        category_response = requests.get(f'{API_BASE}/reports/by-category')
        categories = category_response.json()
        sales_total_response = requests.get(f'{API_BASE}/reports/sales/total-revenue')
        sales_total = sales_total_response.json()
        sales_by_date_response = requests.get(f'{API_BASE}/reports/sales/revenue-by-date')
        sales_by_date = sales_by_date_response.json()
    except:
        total = {'total_value': 0}
        categories = {}
        sales_total = {'total_revenue': 0}
        sales_by_date = []
    return render_template('reports.html', total=total['total_value'], categories=categories, sales_total=sales_total['total_revenue'], sales_by_date=sales_by_date)

@app.route('/transactions')
def transactions():
    try:
        response = requests.get(f'{API_BASE}/transactions')
        transactions = response.json()
    except:
        transactions = []
    return render_template('transactions.html', transactions=transactions)

@app.route('/invoices')
def invoices():
    try:
        response = requests.get(f'{API_BASE}/invoices')
        invoices = response.json()
    except:
        invoices = []
    return render_template('invoices.html', invoices=invoices)

@app.route('/create_invoice', methods=['GET', 'POST'])
def create_invoice():
    if request.method == 'POST':
        customer_id = request.form.get('customer_id')
        if customer_id:
            customer_id = int(customer_id)
        items = []
        for key, value in request.form.items():
            if key.startswith('item_') and key.endswith('_quantity'):
                item_id = int(key.split('_')[1])
                quantity = int(value)
                if quantity > 0:
                    items.append({'item_id': item_id, 'quantity': quantity})
        data = {'customer_id': customer_id, 'items': items}
        requests.post(f'{API_BASE}/invoices', json=data)
        return redirect(url_for('invoices'))
    try:
        items_response = requests.get(f'{API_BASE}/items')
        items = items_response.json()
        customers_response = requests.get(f'{API_BASE}/customers')
        customers = customers_response.json()
    except:
        items = []
        customers = []
    return render_template('create_invoice.html', items=items, customers=customers)

@app.route('/invoice/<int:invoice_id>')
def view_invoice(invoice_id):
    try:
        response = requests.get(f'{API_BASE}/invoices/{invoice_id}')
        data = response.json()
    except:
        data = {}
    return render_template('invoice_detail.html', **data)

if __name__ == '__main__':
    app.run(debug=True)