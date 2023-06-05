const mongoose = require("mongoose");
// eslint-disable-next-line import/no-extraneous-dependencies
const slugify = require("slugify");

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A vehicle must belong a user or owner"],
    },
    name: {
      type: String,
      required: [true, "A vehicle must have a name"],
      unique: true,
      trim: true,
      maxLength: [40, "A vehicle name must have less or equal then 40 chara"],
      minLength: [10, "A vehicle name must have more or equal then 10 chara"],
    },
    type: {
      type: String,
      enum: ["car", "sports", "bus", "boat", "motorcycle", "plane", "bicycle"],
      required: [true, "Your vehicle must a have type of vehicle"],
      lowercase: true,
    },
    address: String,
    Location: String,
    feature: [String],
    images: [String],
    description: {
      type: String,
      trim: true,
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: val => Math.round(val * 10) / 10,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A vehicle must have a summary"],
    },
    price: {
      type: Number,
      required: [true, "A vehicle must have a price"],
    },
    createtAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

vehicleSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

vehicleSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "vehicle",
  localField: "_id",
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
