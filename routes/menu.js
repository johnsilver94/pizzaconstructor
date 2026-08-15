/* eslint-disable no-useless-escape */
const express = require('express');
const router = express.Router();
const models = require('../models');

const categoryAliases = {
  drink: 'beverages',
  drinks: 'beverages',
  beverage: 'beverages',
  beverages: 'beverages',
  dessert: 'desert',
  desserts: 'desert',
  desert: 'desert',
  deserts: 'desert',
  pizzas: 'pizza',
  pizza: 'pizza',
  salads: 'salad',
  salad: 'salad',
  vegan: 'vegan'
};

async function renderMenu(req, res, next) {
  const id = req.session ? req.session.userId : null;
  const login = req.session ? req.session.userLogin : null;
  const ingrouporder = req.session ? req.session.ingrouporder : false;
  const avatar = req.session ? req.session.avatar : '/img/userimg.png';

  const rawCategory = (req.params.category || req.query.category || 'pizza').toLowerCase();
  const category = categoryAliases[rawCategory] || rawCategory;

  try {
    let products = await models.Product.find({ category });
    if (!products || products.length === 0) {
      products = await models.Product.find({});
    }
    res.render('pages/menu', {
      products,
      category,
      user: {
        id,
        login,
        ingrouporder,
        avatar
      }
    });
  } catch (error) {
    next(error);
  }
}

// routes
router.get('/', renderMenu);
router.get('/:category', renderMenu);

module.exports = router;
