const express = require("express");
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/:id", bookingController.getBookingByUser);
router.get("/user/:id", bookingController.getBookingById);

router.post(
  "/checkout-session/:vehicleId/:userId",
  authController.protect,
  bookingController.getCheckoutSession
);

router.post("/", bookingController.createBooking);

module.exports = router;
