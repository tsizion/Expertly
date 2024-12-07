const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Station = require("../models/station");
const Agent = require("../../Agent/models/Agent");

// Create a new station
exports.Create = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const { stationName, location, contactInfo, agents, activeStatus } = req.body;

  if (agents) {
    const agentsExist = await Agent.find({ _id: { $in: agents } });
    if (agentsExist.length !== agents.length) {
      return next(new AppError("Some agents not found", 404));
    }
  }

  // Create new station
  const newStation = await Station.create({
    stationName,
    location,
    contactInfo,
    agents,
    activeStatus,
  });

  res.status(201).json({
    status: "success",
    data: {
      station: newStation,
    },
  });
});

// Read all stations
exports.ReadAll = catchAsync(async (req, res, next) => {
  const stations = await Station.find().populate("agents");

  res.status(200).json({
    status: "success",
    results: stations.length,
    data: {
      stations,
    },
  });
});

// Read a single station by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const station = await Station.findById(req.params.id).populate("agents");

  if (!station) {
    return next(new AppError("Station not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      station,
    },
  });
});

// Update a station
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const updatedStation = await Station.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedStation) {
    return next(new AppError("Station not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      station: updatedStation,
    },
  });
});

// Delete a station by ID
exports.Delete = catchAsync(async (req, res, next) => {
  const station = await Station.findById(req.params.id);

  if (!station) {
    return next(new AppError("Station not found", 404));
  }

  await Station.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Station successfully deleted",
    data: null,
  });
});
