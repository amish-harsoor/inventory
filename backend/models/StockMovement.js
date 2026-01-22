const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StockMovement = sequelize.define('StockMovement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transactionType: {
    type: DataTypes.ENUM('receive', 'ship', 'transfer', 'adjust'),
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  fromLocationId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Locations',
      key: 'id'
    }
  },
  toLocationId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Locations',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unitCost: {
    type: DataTypes.DECIMAL(10, 2)
  },
  referenceNumber: {
    type: DataTypes.STRING
  },
  movementDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  createdBy: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    defaultValue: 'completed'
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = StockMovement;