const Vehicle = require("../models/vehicleModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getBookingId = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.params.id }).populate(
    "vehicle"
  );

  if (!bookings) {
    return next(new AppError("No bookings found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get data currently booked vehicle
  const vehicle = await Vehicle.findById(req.params.vehicleId);
  const user = await User.findById(req.params.userId);

  const dataBooking = req.body;
  // Checkout session
  const parameter = {
    transaction_details: {
      order_id: "YOUR-ORDERID-123456",
      gross_amount: vehicle.price,
    },
    customer_details: {
      user,
    },
    vehicle,
    dataBooking,
  };

  res.status(200).json({
    status: "success",
    redirectUrl: `/checkout-session/${vehicle.id}`,
    data: {
      parameter,
    },
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const newBooking = await Booking.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      newBooking,
    },
  });
});
