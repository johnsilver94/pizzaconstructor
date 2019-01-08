/* eslint-disable no-useless-escape */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const models = require('../models');

// POST is register
router.post('/register', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const email = req.body.email;

  console.log(email);

  if (!login || !email || !password || !passwordConfirm) {
    const fields = [];
    if (!login) fields.push('username');
    if (!password) fields.push('password');
    if (!email) fields.push('email');
    if (!passwordConfirm) fields.push('passwordConfirm');

    res.json({
      ok: false,
      error: 'All fields need to be filled!',
      fields: ['username', 'email', 'password', 'passwordConfirm']
    });
  } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
    res.json({
      ok: false,
      error: 'Only latin letters and numbers!',
      fields: ['username']
    });
  } else if (login.length < 3 || login.length > 16) {
    res.json({
      ok: false,
      error: 'Login length must be between 3 and 16 symbols!',
      fields: ['username']
    });
  } else if (password !== passwordConfirm) {
    res.json({
      ok: false,
      error: 'Passwords do not match!',
      fields: ['password', 'passwordConfirm']
    });
  } else if (password.length < 5) {
    res.json({
      ok: false,
      error: 'The minimum password length is 5 characters!',
      fields: ['password']
    });
  } else if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    res.json({ ok: false, error: 'Wrong email format', fields: ['email'] });
  } else {
    models.User.findOne({
      login
    }).then(user => {
      if (!user) {
        bcrypt.hash(password, null, null, (err, hash) => {
          models.User.create({
            login,
            email,
            password: hash
          })
            .then(user => {
              console.log(user);
              res.json({
                ok: true
              });
            })
            .catch(err => {
              console.log(err);
              res.json({
                ok: false,
                error: 'Error, try later!'
              });
            });
        });
      } else {
        res.json({
          ok: false,
          error: 'Login is busy!',
          fields: ['username']
        });
      }
    });
  }
});

router.post('/login', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  if (!login || !password) {
    const fields = [];
    if (!login) fields.push('loginusername');
    if (!password) fields.push('loginpassword');

    res.json({
      ok: false,
      error: 'All fields need to be filled!',
      fields: ['loginusername', 'loginpassword']
    });
  } else {
    models.User.findOne({
      login
    })
      .then(user => {
        if (!user) {
          res.json({
            ok: false,
            error: 'Wrong login!',
            fields: ['loginusername']
          });
        } else {
          bcrypt.compare(password, user.password, function(err, result) {
            if (!result) {
              res.json({
                ok: false,
                error: 'Wrong password!',
                fields: ['loginpassword']
              });
            } else {
              req.session.userId = user.id;
              req.session.userLogin = user.login;
              req.session.ingrouporder = user.ingrouporder;
              req.session.avatar = user.avatar;
              res.json({
                ok: true
              });
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.json({
          ok: false,
          error: 'Error, try later!'
        });
      });
  }
});

//logout
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});
module.exports = router;
