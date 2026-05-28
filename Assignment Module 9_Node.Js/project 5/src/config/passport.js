const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const prisma = require('./prisma');

// LOGIN STRATEGY
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) return done(null, false, { message: 'User not found' });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) return done(null, false, { message: 'Wrong password' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// SESSION: store user id
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// SESSION: restore user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;