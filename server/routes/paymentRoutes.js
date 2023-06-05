const express = require("express");
const paymentController = require("../controllers/paymentController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(paymentController.getAllPayment)
  .post(paymentController.createPayment);

router.route("/:user").get(paymentController.getPaymentById);

module.exports = router;
