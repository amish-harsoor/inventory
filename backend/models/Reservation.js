const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  locationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Locations',
      key: 'id'
    }
  },
  quantityReserved: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  referenceId: {
    type: DataTypes.STRING // e.g., Order ID
  },
  expirationTimestamp: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'fulfilled', 'cancelled'),
    defaultValue: 'active'
  }
});

module.exports = Reservation;