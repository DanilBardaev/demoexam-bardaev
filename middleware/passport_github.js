const GitHubStrategy = require("passport-github2").Strategy;

require("dotenv").config();

function passportFunctionGitHub(passport) {
  passport.serializeUser(function (user, done) {
    const newUser = {};
    (newUser.id = user.id),
      (newUser.email = user._json.email),
      (newUser.name = user.displayName),
    
      done(null, newUser);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:80/auth/github/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
      
          return done(null, profile);
        });
      }
    )
  );
}

module.exports = passportFunctionGitHub;