const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    guests: { type: Number, required: true },
    location: { type: String, required: true },
    facility: [
      {
        facility: { type: String },
      },
    ],
    rating: { type: Number, required: true },
    reviews: { type: Number, required: true },
    rate: { type: Number, required: true },
    image: [{ type: String, required: true }]
  }
  ,
  {
    versionKey: false,
  }
);
const Hotels = mongoose.model("hotels", hotelSchema);
module.exports = { Hotels };
