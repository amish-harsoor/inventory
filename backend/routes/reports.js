const express = require('express');
const router = express.Router();
const { Inventory, Product, Location, StockMovement } = require('../models');
const { Op } = require('sequelize');

// GET /api/v1/reports/inventory-summary - Current inventory summary
router.get('/inventory-summary', async (req, res) => {
  try {
    const summary = await Inventory.findAll({
      include: [Product, Location],
      attributes: [
        'quantityOnHand',
        'quantityReserved',
        'quantityAvailable',
        [require('sequelize').fn('SUM', require('sequelize').col('quantityOnHand')), 'totalOnHand']
      ],
      group: ['Inventory.id', 'Product.id', 'Location.id']
    });
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/reports/stock-movement - Stock movement report
router.get('/stock-movement', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};
    if (startDate && endDate) {
      where.movementDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    const movements = await StockMovement.findAll({
      where,
      include: [Product, { model: Location, as: 'FromLocation' }, { model: Location, as: 'ToLocation' }],
      order: [['movementDate', 'DESC']]
    });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/reports/valuation - Inventory valuation (simplified, assuming unit cost from movements)
router.get('/valuation', async (req, res) => {
  try {
    // This is simplified; in real app, would have cost in inventory or product
    const inventories = await Inventory.findAll({
      include: [Product, Location]
    });
    const valuation = inventories.map(inv => ({
      product: inv.Product.name,
      location: inv.Location.address,
      quantity: inv.quantityOnHand,
      // Placeholder for valuation
      value: inv.quantityOnHand * 10 // Assume $10 per unit
    }));
    res.json(valuation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;