const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Admin = require("../models/adminModel");

// Create a new admin
exports.Create = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const { firstName, lastName, email, phoneNumber, password, role } = req.body;

  // Check if email or phone number already exists
  const existingAdmin = await Admin.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (existingAdmin) {
    return next(
      new AppError("Admin with this email or phone number already exists", 400)
    );
  }

  // Create new admin
  const newAdmin = await Admin.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    role,
  });

  res.status(201).json({
    status: "success",
    data: {
      admin: newAdmin,
    },
  });
});

// Read all admins
exports.ReadAll = catchAsync(async (req, res, next) => {
  const admins = await Admin.find().select("-password").sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: admins.length,
    data: {
      admins,
    },
  });
});

// Read a single admin by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.params.id).select("-password");

  if (!admin) {
    return next(new AppError("Admin not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      admin,
    },
  });
});

// Update an admin by ID
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Ensure password isn't directly updated here. Handle password updates separately.
  if (updateFields.password) {
    return next(
      new AppError("Use a separate endpoint to update passwords", 400)
    );
  }

  // Find and update the admin
  const updatedAdmin = await Admin.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
    select: "-password", // Exclude password field
  });

  if (!updatedAdmin) {
    return next(new AppError("Admin not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      admin: updatedAdmin,
    },
  });
});

// Delete an admin by ID
exports.Delete = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.params.id);

  if (!admin) {
    return next(new AppError("Admin not found", 404));
  }

  // Capture the admin's email before deletion
  const adminEmail = admin.email || admin.phoneNumber;

  // Delete the admin
  await Admin.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: `Admin "${adminEmail}" successfully deleted`,
    data: null,
  });
});
