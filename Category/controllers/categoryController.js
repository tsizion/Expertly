const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Category = require("../models/categoryModel");

// Create a new category
exports.Create = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const { name, description, image, status } = req.body;

  // Create a new category
  const newCategory = await Category.create({
    name,
    description,
    image,
    status,
  });

  res.status(201).json({
    status: "success",
    data: {
      category: newCategory,
    },
  });
});

// Read all categories
exports.ReadAll = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    status: "success",
    results: categories.length,
    data: {
      categories,
    },
  });
});

// Read a single category by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

// Update a category
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const updatedCategory = await Category.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedCategory) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      category: updatedCategory,
    },
  });
});

// Bulk create categories
exports.BulkCreate = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const categories = req.body.categories;

  if (!Array.isArray(categories) || categories.length === 0) {
    return next(new AppError("Please provide an array of categories", 400));
  }

  const newCategories = await Category.insertMany(categories);

  res.status(201).json({
    status: "success",
    results: newCategories.length,
    data: {
      categories: newCategories,
    },
  });
});

// Delete a category by ID
exports.Delete = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Category successfully deleted",
    data: null,
  });
});
