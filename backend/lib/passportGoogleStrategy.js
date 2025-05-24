const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../db/User");
const authKeys = require("./authKeys");
const dotenv = require("dotenv");
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: authKeys.googleClientID,
      clientSecret: authKeys.googleClientSecret,
      callbackURL: `${process.env.BACKEND_URI}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Try to find an existing user with this Google ID
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // Create a new user if one doesn't exist
          user = new User({
            email: profile.emails[0].value,
            googleId: profile.id,
            // add any other fields as needed
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;