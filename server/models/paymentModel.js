const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: [true, "Payment must a have vehicle"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Payment must have a user"],
  },
  orderId: {
    type: "String",
    required: [true, "Payment must have order id"],
  },
  email: {
    type: String,
    required: [true, "Payment must have a email"],
  },
  name: {
    type: String,
    required: [true, "Payment must have a name"],
  },
  price: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
  card: {
    type: String,
    required: [true, "Payment must have a card number"],
  },
  expired: {
    type: String,
    required: [true, "Payment must have a expired date"],
  },
  cvv: {
    type: String,
    required: [true, "Payment must have a cvv"],
  },
});

const Payment = mongoose.model("payment", paymentSchema);

module.exports = Payment;
