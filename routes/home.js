/* eslint-disable no-useless-escape */
const express = require('express');
const router = express.Router();

async function home(req, res) {
  const id = req.session.userId;
  const login = req.session.userLogin;
  const ingrouporder = req.session.ingrouporder;
  const avatar = req.session.avatar;
  res.render('pages/index', {
    user: {
      id,
      login,
      ingrouporder,
      avatar
    }
  });
}

//routers
router.get('/', (req, res) => {
  home(req, res);
});

module.exports = router;
