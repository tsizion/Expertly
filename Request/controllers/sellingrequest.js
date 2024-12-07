const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const SellingRequest = require("../models/sellingrequest");

const Farmer = require("../../Farmer/models/farmerModel"); // Assuming Farmer model is here
// Get only pending selling requests
exports.GetPendingRequests = catchAsync(async (req, res, next) => {
  const pendingRequests = await SellingRequest.find({
    status: "Pending",
  }).populate("seller");

  res.status(200).json({
    status: "success",
    results: pendingRequests.length,
    data: {
      pendingRequests,
    },
  });
});

// Create a new selling request
exports.Create = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const { seller, itemName, quantity, exchangeType } = req.body;

  // Validate farmer (seller) existence
  const farmer = await Farmer.findById(seller);
  if (!farmer) {
    return next(new AppError("Farmer (seller) not found", 404));
  }

  // Create new selling request
  const newRequest = await SellingRequest.create({
    seller,
    itemName,
    quantity,
    exchangeType,
  });

  res.status(201).json({
    status: "success",
    data: {
      sellingRequest: newRequest,
    },
  });
});
// Accept a selling request
exports.AcceptRequest = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Find the request by ID and update its status to "Accepted"
  const updatedRequest = await SellingRequest.findByIdAndUpdate(
    id,
    { status: "Accepted", updatedAt: Date.now() },
    {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    }
  );

  if (!updatedRequest) {
    return next(new AppError("Selling request not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Selling request has been accepted",
    data: {
      sellingRequest: updatedRequest,
    },
  });
});

// Update a selling request
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { seller, ...updateFields } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // If seller is being updated, validate the farmer ID
  if (seller) {
    const farmer = await Farmer.findById(seller);
    if (!farmer) {
      return next(new AppError("Farmer (seller) not found", 404));
    }
    updateFields.seller = seller;
  }

  const updatedSellingRequest = await SellingRequest.findByIdAndUpdate(
    id,
    updateFields,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedSellingRequest) {
    return next(new AppError("Selling request not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      sellingRequest: updatedSellingRequest,
    },
  });
});

// Read all selling requests
exports.ReadAll = catchAsync(async (req, res, next) => {
  const sellingRequests = await SellingRequest.find().populate("seller");

  res.status(200).json({
    status: "success",
    results: sellingRequests.length,
    data: {
      sellingRequests,
    },
  });
});

// Read a single selling request by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const sellingRequest = await SellingRequest.findById(req.params.id).populate(
    "seller"
  );

  if (!sellingRequest) {
    return next(new AppError("Selling request not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      sellingRequest,
    },
  });
});

// Update a selling request

// Delete a selling request by ID
exports.Delete = catchAsync(async (req, res, next) => {
  const sellingRequest = await SellingRequest.findById(req.params.id);

  if (!sellingRequest) {
    return next(new AppError("Selling request not found", 404));
  }

  await SellingRequest.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Selling request successfully deleted",
    data: null,
  });
});
