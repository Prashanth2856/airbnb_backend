const express = require("express");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config();
const router = express.Router();

//New Token Function
const newToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET_KEY);
};

//------- GET "/users" --------
router.get("/users", async (req, res) => {
  const user = await User.find().lean().exec();
  return res.send(user);
});

//name, email, password
//--------- Registering the User ----------
router.post(
  "/signup",
  body("first_name").notEmpty().withMessage("Firstname is required"),
  body("last_name").notEmpty().withMessage("Lastname is required"),
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Email is required and should be a valid email"),
  body("password").notEmpty().withMessage("Password field cannot be empty"),
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
      return res.status(400).json({ Errors: finalErrors });
    }
    let user;
    try {
      // First we check if the user with same email already exists
      user = await User.findOne({ email: req.body.email });

      // If "Yes" or if user exists already then we throw an error "Email already exists"
      if (user)
        return res.status(400).send({ message: "Email already exists" });

      // Else we will create the user with email and password
      user = await User.create(req.body);

      //We will create a token using newToken() in line 7
      const token = newToken(user);

      //We will send the token to the frontend
      return res.status(200).send({ user, token });
    } catch (err) {
      return res.status(500).json({
        status: "Failed",
        message: "Sorry for inconvenience please try later",
      });
    }
  }
);

//--------- Login with the email and password we used while registering --------
router.post(
  "/signin",
  body("email")
    .notEmpty()
    .withMessage("Email should not be empty and should be valid email"),
  body("password").notEmpty().withMessage("Password field cannot be empty"),
  async (req, res) => {
    try {
      // First we will check if user with same email already exists
      let user = await User.findOne({ email: req.body.email });

      // If not exists then we throw an error
      if (!user) {
        return res
          .status(400)
          .send({ message: "Please check your email and password" });
      }

      // If user with email exists then we match the password
      let match = user.checkPassword(req.body.password);

      // If password is not match then throw an error
      if (!match) {
        return res
          .status(400)
          .send({ message: "Please check your email and password" });
      }

      // If password matches we will create a new token for that user
      const token = newToken(user);

      // We will send the token to the frontend
      return res.status(200).send({ user, token });
    } catch (err) {
      return res
        .status(501)
        .send({ message: "Sorry fot inconvenience please try again later" });
    }
  }
);

module.exports = router;
