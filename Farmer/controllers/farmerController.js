const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Farmer = require("../models/farmerModel");
const Agent = require("../../Agent/models/Agent");
const Transaction = require("../../Transction/models/transactionmodel");

// Create a new farmer
exports.Create = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const { fullName, phoneNumber, location, registeredByAgent, status } =
    req.body;

  // Check if the agent exists
  const agentExist = await Agent.findById(registeredByAgent);
  if (!agentExist) {
    return next(new AppError("Agent not found", 404));
  }

  // Create a new farmer
  const newFarmer = await Farmer.create({
    fullName,
    phoneNumber,
    location,
    registeredByAgent,
    status,
  });

  res.status(201).json({
    status: "success",
    data: {
      farmer: newFarmer,
    },
  });
});

// Read all farmers
exports.ReadAll = catchAsync(async (req, res, next) => {
  const farmers = await Farmer.find()
    .populate("registeredByAgent", "fullName phoneNumber")
    .populate("transactions");

  res.status(200).json({
    status: "success",
    results: farmers.length,
    data: {
      farmers,
    },
  });
});

// Read a single farmer by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const farmer = await Farmer.findById(req.params.id)
    .populate("registeredByAgent", "fullName phoneNumber")
    .populate("transactions");

  if (!farmer) {
    return next(new AppError("Farmer not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      farmer,
    },
  });
});

// Update a farmer
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Check if the agent exists (if updated)
  if (updateFields.registeredByAgent) {
    const agentExist = await Agent.findById(updateFields.registeredByAgent);
    if (!agentExist) {
      return next(new AppError("Agent not found", 404));
    }
  }

  const updatedFarmer = await Farmer.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedFarmer) {
    return next(new AppError("Farmer not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      farmer: updatedFarmer,
    },
  });
});

// Delete a farmer by ID
exports.Delete = catchAsync(async (req, res, next) => {
  const farmer = await Farmer.findById(req.params.id);

  if (!farmer) {
    return next(new AppError("Farmer not found", 404));
  }

  await Farmer.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Farmer successfully deleted",
    data: null,
  });
});
