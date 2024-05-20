const VKontakteStrategy = require("passport-vkontakte").Strategy;

require("dotenv").config();

function passportFunctionVK(passport) {
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
    new VKontakteStrategy(
      {
        clientID: process.env.VK_CLIENT_ID,
        clientSecret: process.env.VK_CLIENT_SECRET,
        callbackURL: "http://localhost/auth/vkontakte/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
       
          return done(null, profile);
        });
      }
    )
  );
}

module.exports = passportFunctionVK;