const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Donation = require("../models/donationModel");
const Donor = require("../../donors/models/donorModel");
const Campaign = require("../../Campaign/models/Campaign");

// Create a new donation
exports.Create = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const { donor, campaign } = req.body;

  // Check if the donor ID exists
  const donorExists = await Donor.findById(donor);
  if (!donorExists) {
    return next(new AppError("Donor not found", 404));
  }

  // Check if the campaign ID exists
  const campaignExists = await Campaign.findById(campaign);
  if (!campaignExists) {
    return next(new AppError("Campaign not found", 404));
  }

  // Create the donation
  const newDonation = await Donation.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      donation: newDonation,
    },
  });
});

// Read all donations
exports.ReadAll = catchAsync(async (req, res, next) => {
  const donations = await Donation.find()
    .populate("donor campaign")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: donations.length,
    data: {
      donations,
    },
  });
});

// Read a single donation by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const donation = await Donation.findById(req.params.id).populate(
    "donor campaign"
  );

  if (!donation) {
    return next(new AppError("Donation not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      donation,
    },
  });
});

// Update a donation
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const updatedDonation = await Donation.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  }).populate("donor campaign");

  if (!updatedDonation) {
    return next(new AppError("Donation not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      donation: updatedDonation,
    },
  });
});

// Delete a donation by ID
exports.Delete = catchAsync(async (req, res, next) => {
  const donation = await Donation.findById(req.params.id);

  if (!donation) {
    return next(new AppError("Donation not found", 404));
  }

  await Donation.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Donation successfully deleted",
    data: null,
  });
});
