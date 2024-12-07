const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Agent = require("../models/Agent"); // Assuming the path to your agent model is correct
const StationModel = require("../../station/models/station");

// Create a new agent
exports.Create = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const { fullName, phoneNumber, location, station, password, imageUrls } =
    req.body;

  // Check if a station exists (assuming you have a station model)
  const stationExists = await StationModel.findById(station); // Uncomment if you want to check station
  if (!stationExists) {
    return next(new AppError("Station not found", 404));
  }

  const newAgent = await Agent.create({
    fullName,
    phoneNumber,
    location,
    station,
    password,
    imageUrls,
  });

  res.status(201).json({
    status: "success",
    data: {
      agent: newAgent,
    },
  });
});

// Update an agent's information
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const updatedAgent = await Agent.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  }).populate("station"); // Populating station information if needed

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
  const agent = await Agent.findById(req.params.id);

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

// Delete an agent
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
