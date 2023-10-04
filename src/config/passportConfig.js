import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userModel from "../dao/models/userModel.js";
import UserService from "../dao/services/user/userService.js";
import { createHash, isValidPassword } from "../utils/functions.js";

const User = new UserService();
const localStratergy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new localStratergy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          let user = await User.findOne({ email: username });
          if (user) {
            console.log('User already exists');
            return done(null, false);
          }
          const newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: username,
            age: req.body.age,
            password: createHash(password),
          };
          let result = await User.createUser(newUser);
          return done(null, result);
        } catch (error) {
          return done('Error al registrar usuario: ' + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStratergy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            console.log("User does not exist");
            return done(null, false);
          }
          const passwordIsValid = isValidPassword(user, password);
          if (!passwordIsValid) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
            console.error(error)
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.SECRET_ID,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });
          if (!user) {
            let email = profile._json.email || `default${profile.id}@email.com`;
            user = await User.findOne({ email: email });
            if (!user) {
              let newUser = {
                githubId: profile.id,
                first_name: profile._json.name.split(" ")[0],
                last_name: profile._json.name.split(" ")[1],
                email: email,
                password: "",
              };
              let result = await User.createUser(newUser);
              done(null, result);
            } else {
              done(null, user);
            }
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
