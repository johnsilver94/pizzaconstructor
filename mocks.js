const faker = require('faker');

const models = require('./models');

const owner = '5c34445f1930e7266cd5d69d';

const ing = [];
const alerg = [];

for (var i = 0; i < 20; i++) ing.push({ name: faker.lorem.word() });
for (var j = 0; j < 5; j++) alerg.push({ name: faker.lorem.word() });

module.exports = () => {
  models.Product.remove()
    .then(() => {
      Array.from({ length: 20 }).forEach(() => {
        models.Product.create({
          createdBy: owner,
          name: faker.lorem.words(3),
          category: 'pizza',
          ingredients: ing,
          alergents: alerg,
          size_price: [
            { size: '25cm (500gr)', price: faker.random.number(100) },
            { size: '30cm (650gr)', price: faker.random.number(100) },
            { size: '35cm (800gr)', price: faker.random.number(100) }
          ]
        })
          .then(console.log)
          .catch(console.log);
      });
    })
    .catch(console.log);
};
