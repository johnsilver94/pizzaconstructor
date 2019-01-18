/* eslint-disable no-useless-escape */
const express = require('express');
const router = express.Router();
const models = require('../models');

async function home(req, res) {
  const id = req.session.userId;
  const login = req.session.userLogin;
  const ingrouporder = req.session.ingrouporder;
  const avatar = req.session.avatar;

  try {
    let products = await models.Product.find({
      category: 'pizza'
    });
    res.render('pages/menu', {
      products,
      user: {
        id,
        login,
        ingrouporder,
        avatar
      }
    });
  } catch (error) {
    throw new Error('Server Error');
  }
}

//routers
router.get('/', (req, res) => {
  home(req, res);
});

module.exports = router;
