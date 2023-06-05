const multer = require("multer");
const Vehicle = require("../models/vehicleModel");
const APIFeatures = require("../utils/apiFeature");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image!, Please upload only images.", 404), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([{ name: "images", maxCount: 3 }]);

exports.getAllVehicle = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Vehicle.find().populate({ path: "reviews", strictPopulate: false }),
    req.query
  )
    .filter()
    .sort();
  const vehicles = await features.query;
  res.status(200).json({
    status: "success",
    results: vehicles.length,
    data: {
      vehicles,
    },
  });
});

exports.createVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      vehicle,
    },
  });
});

exports.getVehicleById = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.find({ owner: req.params.id });
  if (!vehicle) {
    return next(new AppError("No vehicle found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      vehicle,
    },
  });
});

exports.getVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(new AppError("No vehicle found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      vehicle,
    },
  });
});

exports.getVehicleByUser = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.find({ user: req.params.id });

  if (!vehicle) {
    return next(new AppError("No vehicle found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      vehicle,
    },
  });
});

exports.updateVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!vehicle) {
    return next(new AppError("No vehicle found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      vehicle,
    },
  });
});

exports.deleteVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

  if (!vehicle) {
    return next(new AppError("No vehicle found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
