const passport = require('passport');

module.exports = app => {
  // making first request to google to return the authentication code.
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );
  // grabbing the callback and using passport to authenticate.
  app.get(
    '/auth/google/callback',
    passport.authenticate('google')
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.send(req.user);
  });

  app.get('/api/current_user', (req, res) => {
    // returning the current user if they have successfully logged in to this path.
    res.send(req.user);
  })
};
