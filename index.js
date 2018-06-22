const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

// setting up cookie.
app.use(
  cookieSession({
    // The amount of time the cookie will be saved in milliseconds
    maxAge: 30 * 24 * 60 * 60 * 1000,
    // key to encrypt cookie
    keys: [keys.cookieKey]
  })
);

// telling passport to use cookies
app.use(passport.initialize());
app.use(passport.session());

// first require returns a function then the function is called with the app variable as an argument.
require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT);
