const express = require('express');
const router = express.Router();
const { Message } = require('../models');

// Middleware to protect routes
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

router.get('/new-message', isLoggedIn, (req, res) => {
  res.render('new-message', { errors: [] });
});

router.post('/new-message', isLoggedIn, async (req, res) => {
  const { title, text } = req.body;
  await Message.create({
    title,
    text,
    userId: req.user.id,
  });
  res.redirect('/');

  
});

router.post('/delete-message/:id', async (req, res) => {
  await Message.destroy({ where: { id: req.params.id } });
  res.redirect('/');
});

module.exports = router;