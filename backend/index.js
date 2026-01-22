const express = require('express');
const sequelize = require('./config/database');
require('./models'); // Load models and associations
const productRoutes = require('./routes/products');
const inventoryRoutes = require('./routes/inventory');
const locationRoutes = require('./routes/locations');
const movementRoutes = require('./routes/movements');
const reservationRoutes = require('./routes/reservations');
const alertRoutes = require('./routes/alerts');
const reportRoutes = require('./routes/reports');

const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Inventory Management System API');
});

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/movements', movementRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/reports', reportRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => console.error('Error syncing database:', err));