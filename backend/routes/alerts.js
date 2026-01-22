const express = require('express');
const router = express.Router();
const { Inventory, Product, Location } = require('../models');

// GET /api/v1/alerts/low-stock - Get low stock items
router.get('/low-stock', async (req, res) => {
  try {
    const inventories = await Inventory.findAll({
      include: [Product, Location],
      where: {
        quantityOnHand: {
          [require('sequelize').Op.lte]: require('sequelize').col('reorderPoint')
        }
      }
    });
    res.json(inventories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/alerts - Get active alerts (for now, just low stock)
router.get('/', async (req, res) => {
  try {
    const lowStock = await Inventory.findAll({
      include: [Product, Location],
      where: {
        quantityOnHand: {
          [require('sequelize').Op.lte]: require('sequelize').col('reorderPoint')
        }
      }
    });
    res.json({ lowStock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;