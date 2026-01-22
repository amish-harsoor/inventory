const express = require('express');
const router = express.Router();
const { StockMovement, Product, Location } = require('../models');

// POST /api/v1/movements/receive - Record inbound stock
router.post('/receive', async (req, res) => {
  try {
    const { productId, toLocationId, quantity, unitCost, referenceNumber, notes } = req.body;
    const movement = await StockMovement.create({
      transactionType: 'receive',
      productId,
      toLocationId,
      quantity,
      unitCost,
      referenceNumber,
      notes
    });
    // Update inventory
    let inventory = await require('../models').Inventory.findOne({
      where: { productId, locationId: toLocationId }
    });
    if (!inventory) {
      inventory = await require('../models').Inventory.create({ productId, locationId: toLocationId, quantityOnHand: 0 });
    }
    inventory.quantityOnHand += quantity;
    inventory.quantityAvailable = inventory.quantityOnHand - inventory.quantityReserved;
    await inventory.save();
    res.status(201).json(movement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/v1/movements/ship - Record outbound stock
router.post('/ship', async (req, res) => {
  try {
    const { productId, fromLocationId, quantity, referenceNumber, notes } = req.body;
    const inventory = await require('../models').Inventory.findOne({
      where: { productId, locationId: fromLocationId }
    });
    if (!inventory || inventory.quantityAvailable < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    const movement = await StockMovement.create({
      transactionType: 'ship',
      productId,
      fromLocationId,
      quantity: -quantity,
      referenceNumber,
      notes
    });
    inventory.quantityOnHand -= quantity;
    inventory.quantityAvailable = inventory.quantityOnHand - inventory.quantityReserved;
    await inventory.save();
    res.status(201).json(movement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/v1/movements/transfer - Transfer between locations
router.post('/transfer', async (req, res) => {
  try {
    const { productId, fromLocationId, toLocationId, quantity, notes } = req.body;
    const fromInventory = await require('../models').Inventory.findOne({
      where: { productId, locationId: fromLocationId }
    });
    if (!fromInventory || fromInventory.quantityAvailable < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    const movement = await StockMovement.create({
      transactionType: 'transfer',
      productId,
      fromLocationId,
      toLocationId,
      quantity,
      notes
    });
    fromInventory.quantityOnHand -= quantity;
    fromInventory.quantityAvailable = fromInventory.quantityOnHand - fromInventory.quantityReserved;
    await fromInventory.save();

    let toInventory = await require('../models').Inventory.findOne({
      where: { productId, locationId: toLocationId }
    });
    if (!toInventory) {
      toInventory = await require('../models').Inventory.create({ productId, locationId: toLocationId, quantityOnHand: 0 });
    }
    toInventory.quantityOnHand += quantity;
    toInventory.quantityAvailable = toInventory.quantityOnHand - toInventory.quantityReserved;
    await toInventory.save();
    res.status(201).json(movement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/v1/movements - Get movement history
router.get('/', async (req, res) => {
  try {
    const movements = await StockMovement.findAll({
      include: [Product, { model: Location, as: 'FromLocation' }, { model: Location, as: 'ToLocation' }],
      order: [['movementDate', 'DESC']]
    });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/movements/{id} - Get movement details
router.get('/:id', async (req, res) => {
  try {
    const movement = await StockMovement.findByPk(req.params.id, {
      include: [Product, { model: Location, as: 'FromLocation' }, { model: Location, as: 'ToLocation' }]
    });
    if (!movement) return res.status(404).json({ error: 'Movement not found' });
    res.json(movement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;