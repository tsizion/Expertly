const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Expert = require("../models/expertModel");
const Category = require("../../Category/models/categoryModel");

exports.Create = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    category,
    title,
    specialization,
    cv,
    license,
    profilePicture,
    languages, // New languages field
  } = req.body;

  // Check if the category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(
      new AppError("Category not found. Please provide a valid category.", 404)
    );
  }
  const emailExists = await Expert.findOne({ email });
  if (emailExists) {
    return next(new AppError("Email is already in use", 400));
  }

  // Check if phone number already exists
  const phoneExists = await Expert.findOne({ phoneNumber });
  if (phoneExists) {
    return next(new AppError("Phone number is already in use", 400));
  }

  // Create a new expert
  const newExpert = await Expert.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    category,
    title,
    specialization,
    cv,
    license,
    profilePicture,
    languages, // Include languages in the creation
  });

  res.status(201).json({
    status: "success",
    data: {
      expert: newExpert,
    },
  });
});

// Read all experts
exports.ReadAll = catchAsync(async (req, res, next) => {
  const experts = await Expert.find()
    .populate("category", "name")
    .select("-password"); // Exclude password field

  res.status(200).json({
    status: "success",
    results: experts.length,
    data: {
      experts,
    },
  });
});

// Read a single expert by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const expert = await Expert.findById(req.params.id)
    .populate("category", "name")
    .select("-password"); // Exclude password field

  if (!expert) {
    return next(new AppError("Expert not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      expert,
    },
  });
});

// Update an expert
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Check if the category exists (if updated)
  if (updateFields.category) {
    const categoryExist = await Category.findById(updateFields.category);
    if (!categoryExist) {
      return next(new AppError("Category not found", 404));
    }
  }

  const updatedExpert = await Expert.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedExpert) {
    return next(new AppError("Expert not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      expert: updatedExpert,
    },
  });
});

// Delete an expert by ID
exports.Delete = catchAsync(async (req, res, next) => {
  const expert = await Expert.findById(req.params.id);

  if (!expert) {
    return next(new AppError("Expert not found", 404));
  }

  await Expert.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Expert successfully deleted",
    data: null,
  });
});
// Read a single expert by ID
exports.ReadOneByExpert = catchAsync(async (req, res, next) => {
  const expertIdFromToken = req.expert.id; // Getting the expert ID from the authenticated expert (req.expert)

  const expert = await Expert.findById(expertIdFromToken)
    .populate("category", "name")
    .select("-password"); // Exclude password field

  if (!expert) {
    return next(new AppError("Expert not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      expert,
    },
  });
});

// Update Expert Status
exports.ChangeStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate the status value
  if (!["Pending", "Approved", "Declined"].includes(status)) {
    return next(
      new AppError(
        "Invalid status value. Allowed values are Pending, Approved, Declined.",
        400
      )
    );
  }

  // Find and update the expert's status
  const expert = await Expert.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!expert) {
    return next(new AppError("Expert not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: `Expert status updated to ${status}`,
    data: {
      expert,
    },
  });
});
