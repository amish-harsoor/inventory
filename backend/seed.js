const sequelize = require('./config/database');
require('./models');

const { Product, Location, Inventory } = require('./models');

async function seed() {
  try {
    // Create sample locations
    const location1 = await Location.create({
      warehouseId: 'WH001',
      locationType: 'warehouse',
      address: '123 Main St, City A',
      capacity: 1000
    });
    const location2 = await Location.create({
      warehouseId: 'WH002',
      locationType: 'store',
      address: '456 Elm St, City B',
      capacity: 500
    });

    // Create sample products
    const product1 = await Product.create({
      sku: 'PROD001',
      name: 'Widget A',
      description: 'A useful widget',
      category: 'Widgets',
      unitOfMeasure: 'pcs'
    });
    const product2 = await Product.create({
      sku: 'PROD002',
      name: 'Gadget B',
      description: 'An advanced gadget',
      category: 'Gadgets',
      unitOfMeasure: 'pcs'
    });

    // Create sample inventory
    await Inventory.create({
      productId: product1.id,
      locationId: location1.id,
      quantityOnHand: 100,
      reorderPoint: 20,
      reorderQuantity: 50
    });
    await Inventory.create({
      productId: product2.id,
      locationId: location1.id,
      quantityOnHand: 50,
      reorderPoint: 10,
      reorderQuantity: 25
    });
    await Inventory.create({
      productId: product1.id,
      locationId: location2.id,
      quantityOnHand: 30,
      reorderPoint: 15,
      reorderQuantity: 30
    });

    console.log('Sample data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    sequelize.close();
  }
}

seed();