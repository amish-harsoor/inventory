const express = require('express');
const router = express.Router();
const { Reservation, Product, Location, Inventory } = require('../models');

// POST /api/v1/reservations - Create reservation
router.post('/', async (req, res) => {
  try {
    const { productId, locationId, quantityReserved, referenceId, expirationTimestamp } = req.body;
    const inventory = await Inventory.findOne({
      where: { productId, locationId }
    });
    if (!inventory || inventory.quantityAvailable < quantityReserved) {
      return res.status(400).json({ error: 'Insufficient available stock' });
    }
    const reservation = await Reservation.create({
      productId,
      locationId,
      quantityReserved,
      referenceId,
      expirationTimestamp
    });
    inventory.quantityReserved += quantityReserved;
    inventory.quantityAvailable = inventory.quantityOnHand - inventory.quantityReserved;
    await inventory.save();
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/v1/reservations/{id} - Release reservation
router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    if (reservation.status === 'active') {
      const inventory = await Inventory.findOne({
        where: { productId: reservation.productId, locationId: reservation.locationId }
      });
      if (inventory) {
        inventory.quantityReserved -= reservation.quantityReserved;
        inventory.quantityAvailable = inventory.quantityOnHand - inventory.quantityReserved;
        await inventory.save();
      }
      reservation.status = 'cancelled';
      await reservation.save();
    }
    res.json({ message: 'Reservation released' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/v1/reservations/{id}/fulfill - Fulfill reservation
router.put('/:id/fulfill', async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    if (reservation.status === 'active') {
      const inventory = await Inventory.findOne({
        where: { productId: reservation.productId, locationId: reservation.locationId }
      });
      if (inventory) {
        inventory.quantityOnHand -= reservation.quantityReserved;
        inventory.quantityReserved -= reservation.quantityReserved;
        inventory.quantityAvailable = inventory.quantityOnHand - inventory.quantityReserved;
        await inventory.save();
      }
      reservation.status = 'fulfilled';
      await reservation.save();
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/reservations - List reservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [Product, Location],
      order: [['createdAt', 'DESC']]
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;