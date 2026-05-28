const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  });

  res.send('User registered');
});

// LOGIN
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

// LOGOUT
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.send('Logged out');
  });
});

module.exports = router;