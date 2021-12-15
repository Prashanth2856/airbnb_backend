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
const signup = async (req, res) => {
  let user;
  try {
    user = await User.findOne({ email: req.body.email });

    if (user) {
      let errors = [{
        param: 'email',
        msg: 'Account already exists!'
      }]
      return res.status(200).send({ errors: JSON.stringify(errors) });
    }
    user = await User.create(req.body);

    const token = newToken(user);

    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(200).send({ message: "Something went wrong! Sorry for inconvinience!" });
  }
}

const signin = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      let errors = [{
        param: 'email',
        msg: 'Check your email and password!'
      }]
      return res.status(200).send({ errors:errors });
    }
    let match = user.checkPassword(req.body.password);
    if (!match) {
      let errors = [{
        param: 'password',
        msg: 'Incorrect password!'
      }]
      return res.status(200).send({ errors: errors });
    }
    const token = newToken(user);
    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(200).send({ message: "Something went wrong! Sorry for inconvinience!" });
  }
}
module.exports = { signup, signin, newToken };

