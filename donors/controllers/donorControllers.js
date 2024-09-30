const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Donor = require("../models/donorModel");

// Create a new donor
exports.Create = catchAsync(async (req, res, next) => {
  const { FullName, email, phoneNumber, status, isAnonymous } = req.body;

  // Validate request data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Create donor data object
  const donorData = {
    FullName,
    email,
    phoneNumber,
    status,
    isAnonymous,
  };

  // Create the donor document in MongoDB
  const newDonor = await Donor.create(donorData);

  res.status(201).json({
    status: "success",
    data: {
      donor: newDonor,
    },
  });
});

// Read all donors
exports.ReadAll = catchAsync(async (req, res, next) => {
  const donors = await Donor.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: donors.length,
    data: {
      donors,
    },
  });
});

// Read a single donor by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const donor = await Donor.findById(req.params.id);

  if (!donor) {
    return next(new AppError("Donor not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      donor,
    },
  });
});

// Update donor details
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  // Validate request data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Find the donor by ID and update the specified fields
  const updatedDonor = await Donor.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedDonor) {
    return next(new AppError("Donor not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      donor: updatedDonor,
    },
  });
});

// Delete a donor by ID
exports.Delete = catchAsync(async (req, res, next) => {
  const donor = await Donor.findById(req.params.id);

  if (!donor) {
    return next(new AppError("Donor not found", 404));
  }

  // Delete the donor
  await Donor.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    message: "Donor successfully deleted",
    data: null,
  });
});
