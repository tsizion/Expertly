const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Agent = require("../models/Agent");
const StationModel = require("../../station/models/station");

// Create a new agent
exports.Create = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const {
    fullName,
    phoneNumber,
    location,
    status,
    station,
    itemsScreened,
    transactionsHandled,
  } = req.body;

  // Check if the station exists
  const stationExist = await StationModel.findById(station);
  if (!stationExist) {
    return next(new AppError("Station not found", 404));
  }

  // Create new agent
  const newAgent = await Agent.create({
    fullName,
    phoneNumber,
    location,
    status,
    station,
    itemsScreened,
    transactionsHandled,
  });

  res.status(201).json({
    status: "success",
    data: {
      agent: newAgent,
    },
  });
});

// Read all agents
exports.ReadAll = catchAsync(async (req, res, next) => {
  const agents = await Agent.find();

  res.status(200).json({
    status: "success",
    results: agents.length,
    data: {
      agents,
    },
  });
});

// Read a single agent by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const agent = await Agent.findById(req.params.id)
    .populate("station", "stationName location")
    .populate("itemsScreened")
    .populate("transactionsHandled");

  if (!agent) {
    return next(new AppError("Agent not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      agent,
    },
  });
});

// Update an agent
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Check if the station exists (if updated)
  if (updateFields.station) {
    const stationExist = await Station.findById(updateFields.station);
    if (!stationExist) {
      return next(new AppError("Station not found", 404));
    }
  }

  const updatedAgent = await Agent.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedAgent) {
    return next(new AppError("Agent not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      agent: updatedAgent,
    },
  });
});

// Delete an agent by ID
exports.Delete = catchAsync(async (req, res, next) => {
  const agent = await Agent.findById(req.params.id);

  if (!agent) {
    return next(new AppError("Agent not found", 404));
  }

  await Agent.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Agent successfully deleted",
    data: null,
  });
});
