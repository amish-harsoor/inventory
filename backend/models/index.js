const Product = require('./Product');
const Location = require('./Location');
const Inventory = require('./Inventory');

// Associations
Product.hasMany(Inventory, { foreignKey: 'productId' });
Inventory.belongsTo(Product, { foreignKey: 'productId' });

Location.hasMany(Inventory, { foreignKey: 'locationId' });
Inventory.belongsTo(Location, { foreignKey: 'locationId' });

module.exports = { Product, Location, Inventory };