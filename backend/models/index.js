const Product = require('./Product');
const Location = require('./Location');
const Inventory = require('./Inventory');
const StockMovement = require('./StockMovement');
const Reservation = require('./Reservation');

// Associations
Product.hasMany(Inventory, { foreignKey: 'productId' });
Inventory.belongsTo(Product, { foreignKey: 'productId' });

Location.hasMany(Inventory, { foreignKey: 'locationId' });
Inventory.belongsTo(Location, { foreignKey: 'locationId' });

Product.hasMany(StockMovement, { foreignKey: 'productId' });
StockMovement.belongsTo(Product, { foreignKey: 'productId' });

Location.hasMany(StockMovement, { foreignKey: 'fromLocationId', as: 'FromLocation' });
Location.hasMany(StockMovement, { foreignKey: 'toLocationId', as: 'ToLocation' });
StockMovement.belongsTo(Location, { foreignKey: 'fromLocationId', as: 'FromLocation' });
StockMovement.belongsTo(Location, { foreignKey: 'toLocationId', as: 'ToLocation' });

Product.hasMany(Reservation, { foreignKey: 'productId' });
Reservation.belongsTo(Product, { foreignKey: 'productId' });

Location.hasMany(Reservation, { foreignKey: 'locationId' });
Reservation.belongsTo(Location, { foreignKey: 'locationId' });

module.exports = { Product, Location, Inventory, StockMovement, Reservation };