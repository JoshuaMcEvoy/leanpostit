const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

// loading the Users model.
const User = mongoose.model('users');

// serializing user to store in cookie.
passport.serializeUser((user, done) => {
  // this is the id that is in our database rather than the oauth id.
  done(null, user.id);
});

// take id from cookie to turn into mongoose model instance
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log('accessToken', accessToken);
      // console.log('refreshToken', refreshToken);
      // console.log('profile', profile);

      // checking the database to see if the user already exists, if not they will be added.
      User.findOne({ googleID: profile.id }).then((existingUser) => {
        if(existingUser){
          done(null, existingUser);
        }else{

          // creating an instance of the user class and saving the profile id
          new User({ googleID: profile.id })
            .save()
            // if user is saved then return the user.
            .then(user => done(null, user));
        }
      });
    }
  )
);
