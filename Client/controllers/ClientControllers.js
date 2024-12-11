const Client = require("../models/Client");

const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
// Create a new client
exports.Create = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    profilePicture,
    status,
  } = req.body;

  // Check if email already exists
  const emailExists = await Client.findOne({ email });
  if (emailExists) {
    return next(new AppError("Email is already in use", 400));
  }

  // Check if phone number already exists
  const phoneExists = await Client.findOne({ phoneNumber });
  if (phoneExists) {
    return next(new AppError("Phone number is already in use", 400));
  }

  // Create a new client
  const newClient = await Client.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    profilePicture,
    status,
  });

  res.status(201).json({
    status: "success",
    data: {
      client: newClient,
    },
  });
});

// Read all clients
exports.ReadAll = catchAsync(async (req, res, next) => {
  const clients = await Client.find();

  res.status(200).json({
    status: "success",
    results: clients.length,
    data: {
      clients,
    },
  });
});

exports.readOneByClient = catchAsync(async (req, res, next) => {
  // Retrieve client ID from the authenticated client's token
  const clientIdFromToken = req.client.id;

  // Find the client by their ID
  const client = await Client.findById(clientIdFromToken).select("-password"); // Exclude the password field

  if (!client) {
    return next(new AppError("Client not found", 404));
  }

  // Respond with the client details
  res.status(200).json({
    status: "success",
    data: {
      client,
    },
  });
});

// Read one client by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const client = await Client.findById(id).populate("appointments");

  if (!client) {
    return next(new AppError("Client not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      client,
    },
  });
});

// Update a client
exports.Update = catchAsync(async (req, res, next) => {
  const clientIdFromToken = req.client.id; // Get the client ID from the authenticated client's token

  // Prevent password updates in this endpoint
  if (req.body.password) {
    return next(
      new AppError("Password updates are not allowed in this endpoint", 400)
    );
  }

  // Find the client and update their details
  const client = await Client.findByIdAndUpdate(clientIdFromToken, req.body, {
    new: true, // Return the updated document
    runValidators: true, // Validate the update against the schema
  });

  if (!client) {
    return next(new AppError("Client not found", 404));
  }

  // Respond with the updated client details
  res.status(200).json({
    status: "success",
    data: {
      client,
    },
  });
});

// Delete a client
exports.Delete = catchAsync(async (req, res, next) => {
  const id = req.client.id; // Get the client ID from the authenticated client's token

  const client = await Client.findByIdAndDelete(id);

  if (!client) {
    return next(new AppError("Client not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Client successfully deleted",
    data: {
      deletedClient: client,
    },
  });
});
exports.DeleteByAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const client = await Client.findByIdAndDelete(id);

  if (!client) {
    return next(new AppError("Client not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Client successfully deleted",
    data: {
      deletedClient: client,
    },
  });
});
