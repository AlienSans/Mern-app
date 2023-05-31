const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  type: String,
  address: String,
  feature: [String],
  photos: [String],
  description: String,
  checkIn: Number,
  checkOut: Number,
  maxGuests: Number,
  extraInfo: String,
  price: Number,
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
