const express = require("express");
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/checkout-session/:vehicleId/:userId",
  authController.protect,
  bookingController.getCheckoutSession
);

module.exports = router;
