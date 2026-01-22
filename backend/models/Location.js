const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  warehouseId: {
    type: DataTypes.STRING
  },
  locationType: {
    type: DataTypes.ENUM('warehouse', 'store', 'transit'),
    defaultValue: 'warehouse'
  },
  address: {
    type: DataTypes.TEXT
  },
  capacity: {
    type: DataTypes.INTEGER
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Location;