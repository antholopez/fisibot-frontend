const passport = require("passport");
const axios = require("axios");
const { Strategy: LocalStrategy } = require("passport-local");


passport.serializeUser((user, done) => {
  console.log("user serializeUser", user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("user deserializeUser", user);
  done(null, user);
});

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        console.log("passport use: ", email, password);
        const URL_SERVER = "http://localhost:3000/authentication/login";
        const body = {
          emailOrCode: email,
          password,
        };

        const getUser = await axios.post(URL_SERVER, body);
        console.log("getUser: ", getUser);

        const user = getUser.data;
        return done(null, user);
      } catch (error) {
        console.log("error: ", error.message);
        const statusCode = error?.response?.status || 500;
        if (statusCode === 401) {
          return done(null, false, {
            msg: error?.response?.data?.message || "Ocurrio un error",
          });
        }
        return done(error);
      }
    }
  )
);

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};