const GoogleStrategy = require("passport-google-oauth2").Strategy;

require("dotenv").config();

function passportFunctionGoogle(passport) {
  passport.serializeUser(function (user, done) {
    const newUser = {};
    (newUser.id = user.id),
      (newUser.email = user.emails[0].value),
      (newUser.name = user.displayName),
      //   (newUser.age = user.birthday ? date.now() - user.birthday : 0),
      done(null, newUser);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:80/auth/google/callback",
        passReqToCallback: true,
      },
      function (request, accessToken, refreshToken, profile, done) {
     
        return done(null, profile);
      }
    )
  );
}

module.exports = passportFunctionGoogle;