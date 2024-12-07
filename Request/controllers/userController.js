const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const User = require("../models/usermodel");

// Create a new user
exports.Create = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, password, status } =
    req.body;

  // Validate request data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Create user data object
  const userData = {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    status,
  };

  // Create the user document in MongoDB
  const newUser = await User.create(userData);

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

// Read all users
exports.ReadAll = catchAsync(async (req, res, next) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

// Read a single user by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// Update user details
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  // Validate request data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Find the user by ID and update the specified fields
  const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

// Delete a user by ID
exports.Delete = catchAsync(async (req, res, next) => {
  // Find the user by ID
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Store the user's full name for the success message
  const fullName = `${user.firstName} ${user.lastName}`;

  // Delete the user
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: `${fullName} has been successfully deleted.`,
    data: null,
  });
});
