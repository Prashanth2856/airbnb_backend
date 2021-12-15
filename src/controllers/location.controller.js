const express = require("express");

var locations = require("../models/locations.model");
const Hotels = locations.Hotels;
const Restaurants = locations.Restaurants;
const Attractions = locations.Attractions;

const router = express.Router();


//GET - All Hotels
router.get("/", async (req, res) => {
  const hotels = await Hotels.find().lean().exec();
  return res.status(200).send(hotels);
});

//--------------------------------- Hyderabad DATA --------------------------

// -------------------------------- HOTELS ----------------------------------
// POST --- Hotels
router.post("/Hyderabad", async (req, res) => {
  const hotels = await Hotels.create(req.body);
  return res.status(200).send(hotels);
});

// GET --- Hotels
router.get("/Hyderabad", async (req, res) => {
  const hotels = await Hotels.find({ location: "Hyderabad" }).lean().exec();
  return res.status(200).send(hotels);
});

// GET --- Specific Hotel with ID
router.get("/Hyderabad/:id", async (req, res) => {
  const hotels = await Hotels.findById(req.params.id).lean().exec();
  return res.status(200).send(hotels);
});


// -------------------------- Mumbai Data -----------------------------

// -------------------------------- HOTELS ----------------------------------
// POST --- Hotels --------
router.post("/Mumbai", async (req, res) => {
  const MumbaiHotels = await Hotels.create(req.body);
  return res.status(200).send(MumbaiHotels);
});

// GET --- Hotels --------
router.get("/Mumbai", async (req, res) => {
  const MumbaiHotels = await Hotels.find({ location: "Mumbai" })
    .lean()
    .exec();
  return res.status(200).send(MumbaiHotels);
});

// GET --- Specific Hotel with ID --------------------------------------------
router.get("/Mumbai/:id", async (req, res) => {
  const MumbaiHotels = await Hotels.findById(req.params.id).lean().exec();
  return res.status(200).send(MumbaiHotels);
});

// -------------------------- Bangalore Data -----------------------------

// -------------------------------- HOTELS ----------------------------------
// POST --- Hotels
router.post("/Bangalore", async (req, res) => {
  const BangaloreHotels = await Hotels.create(req.body);
  return res.status(200).send(BangaloreHotels);
});

// GET --- Hotels
router.get("/Bangalore", async (req, res) => {
  const BangaloreHotels = await Hotels.find({ location: "Bangalore" })
    .lean()
    .exec();
  return res.status(200).send(BangaloreHotels);
});

// GET --- Specific Hotel with ID --------------------------------------------
router.get("/Bangalore/:id", async (req, res) => {
  // const BangaloreHotels = await Hotels.findById(req.params.id).lean().exec();
  // return res.status(200).send(BangaloreHotels);
  const my_id = req.params.id;
  const temp = await Hotels.find({ location_id: "608386" }).lean().exec();
  res.send({ data: temp });
});


module.exports = router;
