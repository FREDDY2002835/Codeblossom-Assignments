const passport = require('passport');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');

router.get('/sign-up', (req, res) => {
  res.render('sign-up', { errors: [] });
});

router.post('/sign-up', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match');
    return true;
  }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('sign-up', { errors: errors.array() });
  }

  const { firstName, lastName, email, password, isAdmin } = req.body;
const hashedPassword = await bcrypt.hash(password, 10);
await User.create({ 
  firstName, 
  lastName, 
  email, 
  password: hashedPassword,
  isAdmin: isAdmin === 'true',
});
res.redirect('/login');
});

router.get('/join-club', (req, res) => {
  res.render('join-club', { error: null });
});

router.post('/join-club', async (req, res) => {
  if (req.body.passcode === process.env.CLUB_PASSCODE) {
    await User.update({ isMember: true }, { where: { id: req.user.id } });
    res.redirect('/');
  } else {
    res.render('join-club', { error: 'Wrong passcode!' });
  }
});

router.get('/login', (req, res) => {
  res.render('login', { error: req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;