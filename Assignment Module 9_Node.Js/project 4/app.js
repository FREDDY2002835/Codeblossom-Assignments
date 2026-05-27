require('dotenv').config();
require('./config/passport');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const { syncDB } = require('./models');

const messagesRouter = require('./routes/messages');
const authRouter = require('./routes/auth');

const app = express();

// View engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
app.use('/', authRouter);
app.use('/', messagesRouter);

app.get('/', async (req, res) => {
  const { Message, User } = require('./models');
  const messages = await Message.findAll({ include: User });
  res.render('index', { user: req.user, messages });
});

const PORT = process.env.PORT || 3000;

syncDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

module.exports = app;