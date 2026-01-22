const express = require('express');
const router = express.Router();
const { Inventory, Product, Location } = require('../models');

// GET /api/v1/inventory - Query inventory by filters
router.get('/', async (req, res) => {
  try {
    const inventories = await Inventory.findAll({
      include: [Product, Location]
    });
    res.json(inventories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/inventory/{productId}/{locationId} - Get specific inventory
router.get('/:productId/:locationId', async (req, res) => {
  try {
    const inventory = await Inventory.findOne({
      where: { productId: req.params.productId, locationId: req.params.locationId },
      include: [Product, Location]
    });
    if (!inventory) return res.status(404).json({ error: 'Inventory not found' });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/inventory/adjust - Adjust stock levels
router.post('/adjust', async (req, res) => {
  try {
    const { productId, locationId, adjustment } = req.body;
    let inventory = await Inventory.findOne({
      where: { productId, locationId }
    });
    if (!inventory) {
      inventory = await Inventory.create({ productId, locationId, quantityOnHand: 0 });
    }
    inventory.quantityOnHand += adjustment;
    inventory.quantityAvailable = inventory.quantityOnHand - inventory.quantityReserved;
    inventory.lastUpdated = new Date();
    await inventory.save();
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/v1/inventory/availability - Check product availability
router.get('/availability', async (req, res) => {
  try {
    const { productId, quantity } = req.query;
    const inventories = await Inventory.findAll({
      where: { productId },
      include: [Location]
    });
    const available = inventories.reduce((sum, inv) => sum + inv.quantityAvailable, 0);
    res.json({ productId, requestedQuantity: quantity, availableQuantity: available, isAvailable: available >= quantity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;