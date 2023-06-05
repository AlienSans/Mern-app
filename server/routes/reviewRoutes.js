const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(reviewController.getAllReview)
  .post(authController.protect, reviewController.createReview);

router.route("/:vehicle").get(reviewController.getReviewsVehicle);

module.exports = router;
