const express = require("express");
const vehicleController = require("../controllers/vehicleController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/upload", vehicleController.uploadTourImages);

router
  .route("/")
  .get(authController.protect, vehicleController.getAllVehicle)
  .post(vehicleController.createVehicle);

router
  .route("/:id")
  .get(vehicleController.getVehicle)
  .patch(vehicleController.updateVehicle)
  .delete(vehicleController.deleteVehicle);

router.route("/user/:id").get(vehicleController.getVehicleByUser);
module.exports = router;
