const express = require("express");
const cors = require("cors");
const connect = require("./configs/db");
const session = require("express-session");
const passport = require("./configs/passport");
const User = require("./models/user.model");

const { signup, signin } = require("./controllers/auth.controller");
const { body, validationResult } = require("express-validator");


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.options("*", cors());

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  //console.log("Serialize", user);
  //console.log("Serialize User:", token, userBookList, readingList);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  //console.log("De-Serialize", user);
  //console.log(token, userBookList, readingList);
  done(null, user);
});




//-------GOOGLE--------//
app.get("/auth/google/failure", (req, res) => {
  return res.send("Something went wrong!");
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);


app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/signIn",
    //successRedirect: 'http://localhost:3000/home'
  }),
  function (req, res) {
    //const {token, userBookList, readingList} = req.user;
    //return res.status(200).json({token, userBookList, readingList});
    // res.redirect("http://localhost:3000/home");
    return res.send("success")
  }
);

//Routes for Signup and Signin
app.get('/users', async (req, res) => {
  const users = await User.find().lean().exec();
  return res.status(200).send(users);
});


app.post(
  "/signUp",
  body("first_name")
    .notEmpty()
    .withMessage("first_name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email should be a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
    .withMessage("Invalid Password!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password should be 8-20 characters long"),
  async (req, res) => {
    const errors = validationResult(req);

    let finalErrors = null;
    if (!errors.isEmpty()) {
      finalErrors = errors.array().map((error) => {
        return {
          param: error.param,
          msg: error.msg,
        };
      });
      return res.status(201).send({ errors:finalErrors });
    }

    return signup(req, res);
  }
);

app.post(
  "/signIn",
  body("email").isEmail().withMessage("Enter a valid email address!"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Incorrect password format!"),
  async (req, res) => {
    const errors = validationResult(req);
    const hasErrors = !errors.isEmpty();

    if (hasErrors) {
      let finalErrors = errors.array().map((error) => {
        return {
          param: error.param,
          msg: error.msg,
        };
      });

      return res.status(201).send({ errors: finalErrors });
    }

    return signin(req, res);
  }
);

// app.use("/", signup);
// app.use("/", signin);
const userController = require("./controllers/user.controller");
const locations = require("./controllers/location.controller");
//Routes for Locations controller
app.use("/hotels", locations);
app.use("/users", userController);

const start = async () => {
  await connect();

  app.listen("5000", () => {
    console.log("Listeing on port 5000");
  });
};

module.exports = start;


