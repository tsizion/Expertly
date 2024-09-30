const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Campaign = require("../models/Campaign");
const Category = require("../models/category");
const User = require("../../campaign creators,/models/usermodel");

// Create a new campaign
exports.Create = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const { category, creator } = req.body;

  // Check if the category ID exists in the database
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(new AppError("Category not found", 404));
  }

  // Check if the creator ID exists in the database
  const creatorExists = await User.findById(creator);
  if (!creatorExists) {
    return next(new AppError("Creator not found", 404));
  }

  // If both IDs are valid, proceed to create the campaign
  const newCampaign = await Campaign.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      campaign: newCampaign,
    },
  });
});

// Read all campaigns
exports.ReadAll = catchAsync(async (req, res, next) => {
  const campaigns = await Campaign.find()
    .populate("creator")
    .populate("category")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: campaigns.length,
    data: {
      campaigns,
    },
  });
});

// Read a single campaign by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id)
    .populate("creator")
    .populate("category");

  if (!campaign) {
    return next(new AppError("Campaign not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      campaign,
    },
  });
});

// Update a campaign
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const updatedCampaign = await Campaign.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedCampaign) {
    return next(new AppError("Campaign not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      campaign: updatedCampaign,
    },
  });
});

// Delete a campaign by ID
exports.Delete = catchAsync(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return next(new AppError("Campaign not found", 404));
  }

  await Campaign.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: `Campaign successfully deleted`,
    data: null,
  });
});
