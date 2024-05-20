const YandexStrategy = require("passport-yandex").Strategy;
const User = require("../models/user");

require("dotenv").config();

function passportFunction(passport) {
  
  passport.serializeUser(function (user, done) {
    // console.log(user);
    if (user && user.id) {
        const newUser = {
            id: user.id,
            email: user.email,
            name: user.displayName,
            age: user.birthday ? Date.now() - user.birthday : 0
        };
        done(null, newUser);
    } else {
        
        done(new Error('User object does not contain id property'), null);
    }
});

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
  passport.use(
    new YandexStrategy(
      {
        clientID: process.env.YANDEX_CLIENT_ID,
        clientSecret: process.env.YANDEX_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:80/auth/yandex/callback",
      },
      function (appToken, refreshToken, profile, done) {
       
        process.nextTick(function () {
      
      
          return done(null, profile);
        });
      }
    )
  );
}

module.exports = passportFunction;
