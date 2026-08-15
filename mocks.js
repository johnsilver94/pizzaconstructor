const models = require('./models');
const bcrypt = require('bcryptjs');

const pizzaNames = [
  'Margherita Classica',
  'Pepperoni Supreme',
  'Quattro Formaggi',
  'Diavola Piccante',
  'Capricciosa Deluxe',
  'Prosciutto e Funghi',
  'BBQ Chicken Fiesta',
  'Vegetariana Rustica'
];

const saladNames = [
  'Caesar Gourmet',
  'Greek Traditional',
  'Caprese Salad',
  'Tuna & Avocado Fresh'
];

const desertNames = [
  'Tiramisu Artigianale',
  'Chocolate Lava Cake',
  'Panna Cotta al Lampone',
  'Cheesecake New York'
];

const beverageNames = [
  'Coca-Cola Classic (500ml)',
  'San Pellegrino Sparkling (750ml)',
  'Fresh Orange Juice (400ml)',
  'Italian Craft Beer (330ml)'
];

const veganNames = [
  'Vegan Garden Pizza',
  'Avocado Crunch Bowl',
  'Vegan Berry Crumble'
];

const sampleIngredients = [
  { name: 'Mozzarella' },
  { name: 'Tomato Sauce' },
  { name: 'Basil' },
  { name: 'Pepperoni' },
  { name: 'Mushrooms' },
  { name: 'Black Olives' },
  { name: 'Oregano' },
  { name: 'Olive Oil' }
];

const sampleAllergens = [
  { name: 'Gluten' },
  { name: 'Lactose' }
];

async function seedData() {
  try {
    const existingCount = await models.Product.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} products.`);
      return;
    }

    console.log('Seeding initial PizzaConstructor products...');

    // Create or find a default test user
    let user = await models.User.findOne({ login: 'admin' });
    if (!user) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      user = await models.User.create({
        login: 'admin',
        email: 'admin@pizzaconstructor.com',
        password: passwordHash,
        avatar: '/img/userimg.png'
      });
      console.log('Created default admin user (login: admin, pass: admin123)');
    }

    const productsToCreate = [];

    pizzaNames.forEach((name, i) => {
      productsToCreate.push({
        createdBy: user._id,
        name,
        category: 'pizza',
        ingredients: sampleIngredients.slice(0, 4 + (i % 4)),
        alergents: sampleAllergens,
        size_price: [
          { size: '25cm (500gr)', price: 12 + i },
          { size: '30cm (650gr)', price: 16 + i },
          { size: '35cm (800gr)', price: 20 + i }
        ]
      });
    });

    saladNames.forEach((name, i) => {
      productsToCreate.push({
        createdBy: user._id,
        name,
        category: 'salad',
        ingredients: [{ name: 'Lettuce' }, { name: 'Cherry Tomatoes' }, { name: 'Cucumbers' }],
        alergents: [{ name: 'Lactose' }],
        size_price: [
          { size: 'Standard (300gr)', price: 8 + i }
        ]
      });
    });

    desertNames.forEach((name, i) => {
      productsToCreate.push({
        createdBy: user._id,
        name,
        category: 'desert',
        ingredients: [{ name: 'Mascarpone' }, { name: 'Cocoa' }, { name: 'Coffee' }],
        alergents: [{ name: 'Lactose' }, { name: 'Gluten' }],
        size_price: [
          { size: 'Standard (180gr)', price: 6 + i }
        ]
      });
    });

    beverageNames.forEach((name, i) => {
      productsToCreate.push({
        createdBy: user._id,
        name,
        category: 'beverages',
        ingredients: [{ name: 'Natural Extracts' }],
        alergents: [],
        size_price: [
          { size: '500ml', price: 3 + i }
        ]
      });
    });

    veganNames.forEach((name, i) => {
      productsToCreate.push({
        createdBy: user._id,
        name,
        category: 'vegan',
        ingredients: [{ name: 'Vegan Mozzarella' }, { name: 'Tomato Sauce' }, { name: 'Spinach' }, { name: 'Artichokes' }],
        alergents: [{ name: 'Gluten' }],
        size_price: [
          { size: '25cm (450gr)', price: 14 + i },
          { size: '30cm (600gr)', price: 18 + i }
        ]
      });
    });

    await models.Product.insertMany(productsToCreate);
    console.log(`Seeded ${productsToCreate.length} products successfully.`);
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

module.exports = seedData;
