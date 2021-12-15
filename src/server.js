const express = require("express");
const cors = require("cors");
const connect = require("./configs/db");

const signup = require("./controllers/auth.controller");
const signin = require("./controllers/auth.controller");

const locations = require("./controllers/location.controller");

const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());

//Routes for Signup and Signin
app.use("/", signup);
app.use("/", signin);

//Routes for Locations controller
app.use("/hotels", locations);

const start = async () => {
  await connect();

  app.listen("3333", () => {
    console.log("Listeing on port 3333");
  });
};

module.exports = start;
