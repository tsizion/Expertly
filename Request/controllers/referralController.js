const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Referral = require("../models/referralModel"); // Assuming you named the file referralModel.js

// Create a new referral
// Create a new referral
exports.Create = catchAsync(async (req, res, next) => {
  const {
    referrerName,
    referrerEmail,
    referrerPhone,
    studentName,
    studentEmail,
    studentPhone,
    studentAddress,
    needDescription,
    documents,
  } = req.body;

  // Validate request data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Ensure the user is authenticated and associate the referral with their ID
  if (!req.user) {
    return next(
      new AppError("You must be logged in to create a referral.", 401)
    );
  }

  // Create referral data object
  const referralData = {
    referrerName,
    referrerEmail,
    referrerPhone,
    studentName,
    studentEmail,
    studentPhone,
    studentAddress,
    needDescription,
    documents,
    createdBy: req.user._id, // Associate the referral with the logged-in user's ID
  };

  // Create the referral document in MongoDB
  const newReferral = await Referral.create(referralData);

  res.status(201).json({
    status: "success",
    data: {
      referral: newReferral,
    },
  });
});

// Read all referrals
exports.ReadAll = catchAsync(async (req, res, next) => {
  const referrals = await Referral.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: referrals.length,
    data: {
      referrals,
    },
  });
});

// Read a single referral by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const referral = await Referral.findById(req.params.id);

  if (!referral) {
    return next(new AppError("Referral not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      referral,
    },
  });
});

// Update referral details
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  // Validate request data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Find the referral by ID and update the specified fields
  const updatedReferral = await Referral.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedReferral) {
    return next(new AppError("Referral not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      referral: updatedReferral,
    },
  });
});

// Delete a referral by ID
exports.Delete = catchAsync(async (req, res, next) => {
  // Find the referral by ID
  const referral = await Referral.findById(req.params.id);

  if (!referral) {
    return next(new AppError("Referral not found", 404));
  }

  // Delete the referral
  await Referral.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: `Referral ${referral.referralCaseNumber} has been successfully deleted.`,
    data: null,
  });
});
