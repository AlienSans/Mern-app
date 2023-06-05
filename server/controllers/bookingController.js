const Vehicle = require("../models/vehicleModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

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
