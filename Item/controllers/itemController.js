const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Item = require("../models/item2");

const Farmer = require("../../Farmer/models/farmerModel"); // Assuming the Farmer model exists

// Create a new item
exports.Create = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const { seller, name, quantity, priceInBirr } = req.body;

  // Check if seller exists
  const sellerExists = await Farmer.findById(seller);
  if (!sellerExists) {
    return next(new AppError("Seller not found", 404));
  }

  const newItem = await Item.create({
    seller,
    name,
    quantity,
    priceInBirr,
  });

  res.status(201).json({
    status: "success",
    data: {
      item: newItem,
    },
  });
});

// Update an item
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Check if seller exists if `seller` is being updated
  if (updateFields.seller) {
    const sellerExists = await Farmer.findById(updateFields.seller);
    if (!sellerExists) {
      return next(new AppError("Seller not found", 404));
    }
  }

  const updatedItem = await Item.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  }).populate("seller");

  if (!updatedItem) {
    return next(new AppError("Item not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      item: updatedItem,
    },
  });
});

// Read all items
exports.ReadAll = catchAsync(async (req, res, next) => {
  const items = await Item.find().populate("seller", "name contactInfo"); // Populate seller details

  res.status(200).json({
    status: "success",
    results: items.length,
    data: {
      items,
    },
  });
});

// Read a single item by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate(
    "seller",
    "name contactInfo"
  );

  if (!item) {
    return next(new AppError("Item not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      item,
    },
  });
});

// Delete an item
exports.Delete = catchAsync(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(new AppError("Item not found", 404));
  }

  await Item.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Item successfully deleted",
    data: null,
  });
});
