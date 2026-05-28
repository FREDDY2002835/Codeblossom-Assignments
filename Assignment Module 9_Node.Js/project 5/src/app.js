require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');

const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./config/prisma');

const authRoutes = require('./routes/authRoutes');

const app = express();

// 1. Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 2. Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000
    })
  })
);

// 3. Passport
app.use(passport.initialize());
app.use(passport.session());

// 4. ROUTES (👉 ADD IT HERE)
app.use('/', authRoutes);

// 5. Test route
app.get('/', (req, res) => {
  res.send('Auth system ready 🚀');
});

const folderRoutes = require('./routes/folderRoutes');

app.use('/folders', folderRoutes);

const fileRoutes = require('./routes/fileRoutes');

app.use('/files', fileRoutes);

// 6. Export
module.exports = app;