require("dotenv").config();
const passport = require("passport");
const { v4: uuidV4 } = require("uuid");
const { newToken } = require("../controllers/auth.controller");

var GoogleStrategy = require("passport-google-oauth2").Strategy;

const User = require("../models/user.model");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/google/callback",
            userProfileURL: "https://**www**.googleapis.com/oauth2/v3/userinfo",
            passReqToCallback: true,
        },
        async function (request, accessToken, refreshToken, profile, done) {
            const email = profile?._json?.email;

            let user;
            try {
                user = await User.findOne({ email }).lean().exec();

                if (!user) {
                    user = await User.create({
                        email: email,
                        password: uuidV4(),
                    });
                }
                
                const token = newToken(user);
                
                let new_user = {
                    userid: user._id,
                    token: token,
                };
                console.log(new_user);
                return done(null, new_user);
            } catch (err) {
                console.log("error:", err);
            }
        }
    )
);
module.exports = passport;