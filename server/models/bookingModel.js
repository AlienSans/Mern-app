const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  price: {
    type: Number,
    required: [true, "Booking must have a price"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  checkIn: { type: Date, required: [true, "Booking must have a date in"] },
  checkOut: { type: Date, required: [true, "Booking must have a date out"] },
  phone: {
    type: String,
    required: [true, "Booking must a have phone number"],
    trim: true,
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "vehicle",
    select: "name images address location",
  });

  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
