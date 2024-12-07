const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Farmer = require("../models/farmerModel");
const Agent = require("../../Agent/models/Agent");
const Transaction = require("../../Transction/models/transactionmodel");

exports.Create = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Extract the agent ID from the middleware (protectAgent)
  const registeredByAgent = req.agent.id; // `req.agent` is set in the protectAgent middleware

  const { fullName, phoneNumber, location, status } = req.body;

  // Create a new farmer with the agent's ID from the middleware
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
exports.ReadAllByAgent = catchAsync(async (req, res, next) => {
  // Get the agent ID from the authenticated agent
  const agentId = req.agent._id;

  // Find farmers who are registered by the current agent
  const farmers = await Farmer.find({ registeredByAgent: agentId })
    .populate("registeredByAgent", "fullName phoneNumber")
    .populate("transactions");

  // If no farmers are found, return a 404 error
  if (!farmers.length) {
    return next(new AppError("No farmers found for this agent.", 404));
  }

  res.status(200).json({
    status: "success",
    results: farmers.length,
    data: {
      farmers,
    },
  });
});
exports.ReadOneByAgent = catchAsync(async (req, res, next) => {
  // Get the agent ID from the authenticated agent
  const agentId = req.agent._id;

  // Find the farmer by ID and ensure they are registered by the current agent
  const farmer = await Farmer.findOne({
    _id: req.params.id,
    registeredByAgent: agentId,
  })
    .populate("registeredByAgent", "fullName phoneNumber")
    .populate("transactions");

  // If no farmer is found, return a 404 error
  if (!farmer) {
    return next(
      new AppError("Farmer not found or not registered by this agent.", 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      farmer,
    },
  });
});

// Read a single farmer by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const farmer = await Farmer.findById(req.params.id);

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
