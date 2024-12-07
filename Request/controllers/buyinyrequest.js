const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const BuyingRequest = require("../models/buyingModel");
const Farmer = require("../../Farmer/models/farmerModel"); // Assuming the Farmer model exists
const Item = require("../../Item/models/item2"); // Assuming the Item model exists

// Create a new buying request
exports.Create = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const { buyer, item, quantity, exchangeType } = req.body;

  // Check if buyer (Farmer) exists
  const buyerExists = await Farmer.findById(buyer);
  if (!buyerExists) {
    return next(new AppError("Buyer not found", 404));
  }

  // Check if item exists

  // Create the buying request
  const newBuyingRequest = await BuyingRequest.create({
    buyer,
    item,
    quantity,
    exchangeType,
  });

  res.status(201).json({
    status: "success",
    data: {
      buyingRequest: newBuyingRequest,
    },
  });
});

// Update a buying request
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Check if buyer exists if `buyer` is being updated
  if (updateFields.buyer) {
    const buyerExists = await Farmer.findById(updateFields.buyer);
    if (!buyerExists) {
      return next(new AppError("Buyer not found", 404));
    }
  }

  // Check if item exists if `item` is being updated

  const updatedBuyingRequest = await BuyingRequest.findByIdAndUpdate(
    id,
    updateFields,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedBuyingRequest) {
    return next(new AppError("Buying request not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      buyingRequest: updatedBuyingRequest,
    },
  });
});

// Read all buying requests
exports.ReadAll = catchAsync(async (req, res, next) => {
  const buyingRequests = await BuyingRequest.find()
    .populate("buyer", "name phoneNumber") // Populate buyer details
    .populate("item", "name priceInBirr"); // Populate item details

  res.status(200).json({
    status: "success",
    results: buyingRequests.length,
    data: {
      buyingRequests,
    },
  });
});

// Read a single buying request by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const buyingRequest = await BuyingRequest.findById(req.params.id)
    .populate("buyer", "name phoneNumber")
    .populate("item", "name priceInBirr");

  if (!buyingRequest) {
    return next(new AppError("Buying request not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      buyingRequest,
    },
  });
});

// Accept a buying request
exports.AcceptRequest = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Find the request by ID and update its status to "Accepted"
  const updatedRequest = await BuyingRequest.findByIdAndUpdate(
    id,
    { status: "Accepted", updatedAt: Date.now() },
    {
      new: true, // Return the updated document
      runValidators: true, // Ensure schema validation rules are applied
    }
  );

  if (!updatedRequest) {
    return next(new AppError("Buying request not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Buying request has been accepted",
    data: {
      buyingRequest: updatedRequest,
    },
  });
});
// Get only pending buying requests
exports.GetPendingRequests = catchAsync(async (req, res, next) => {
  const pendingRequests = await BuyingRequest.find({
    status: "Pending",
  }).populate("buyer");

  res.status(200).json({
    status: "success",
    results: pendingRequests.length,
    data: {
      pendingRequests,
    },
  });
});

// Delete a buying request
exports.Delete = catchAsync(async (req, res, next) => {
  const buyingRequest = await BuyingRequest.findById(req.params.id);

  if (!buyingRequest) {
    return next(new AppError("Buying request not found", 404));
  }

  await BuyingRequest.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Buying request successfully deleted",
    data: null,
  });
});
