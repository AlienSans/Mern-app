const Payment = require("../models/paymentModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllPayment = catchAsync(async (req, res, next) => {
  const payments = await Payment.find();

  res.status(200).json({
    status: "success",
    results: payments.length,
    data: {
      payments,
    },
  });
});

exports.getPaymentById = catchAsync(async (req, res, next) => {
  const payments = await Payment.find({ user: req.params.userId });

  res.status(200).json({
    status: "success",
    results: payments.length,
    data: {
      payments,
    },
  });
});

exports.createPayment = catchAsync(async (req, res, next) => {
  const newPayment = await Payment.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      newPayment,
    },
  });
});
