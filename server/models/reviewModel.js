const mongoose = require("mongoose");
const Vehicle = require("./vehicleModel");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review can not empty"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  vehicle: {
    type: mongoose.Schema.ObjectId,
    ref: "Vehicle",
    required: [true, "Review must belong to a vehicle"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Review must belong to a user"],
  },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "vehicle",
    select: "name type",
  }).populate({
    path: "user",
    select: "name",
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (vehicleId) {
  const stats = await this.aggregate([
    {
      $match: { vehicle: vehicleId },
    },
    {
      $group: {
        _id: "$vehicle",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Vehicle.findByIdAndUpdate(vehicleId, {
      ratingAverage: stats[0].avgRating,
      ratingQuantity: stats[0].nRating,
    });
  } else {
    await Vehicle.findByIdAndUpdate(vehicleId, {
      ratingAverage: 4.5,
      ratingQuantity: 0,
    });
  }
};

reviewSchema.index({ vehicle: 1, user: 1 }, { unique: true });

reviewSchema.post("save", function () {
  // this poinst to current review
  this.constructor.calcAverageRatings(this.vehicle);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, because query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
