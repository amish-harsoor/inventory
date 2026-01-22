const express = require('express');
const sequelize = require('./config/database');
require('./models'); // Load models and associations
const productRoutes = require('./routes/products');
const inventoryRoutes = require('./routes/inventory');

const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Inventory Management System API');
});

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/inventory', inventoryRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => console.error('Error syncing database:', err));