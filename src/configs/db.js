const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
  return mongoose.connect(
    `mongodb+srv://airbnb:${process.env.PASSWORD}@cluster0.h8dbn.mongodb.net/airbnb?retryWrites=true&w=majority`
  );
};

module.exports = connect;
