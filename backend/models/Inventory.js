const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inventory = sequelize.define('Inventory', {
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
  quantityOnHand: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  quantityReserved: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  quantityAvailable: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reorderPoint: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reorderQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Inventory;