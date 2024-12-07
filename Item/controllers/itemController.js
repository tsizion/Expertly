const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Item = require("../models/item2");
const Farmer = require("../../Farmer/models/farmerModel"); // Assuming the Farmer model exists
const Agent = require("../../Agent/models/Agent"); // Assuming the Agent model exists

// Create a new item
exports.Create = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const { seller, name, quantity, priceInBirr, imageUrls } = req.body;

  // Check if seller exists
  const sellerExists = await Farmer.findById(seller);
  if (!sellerExists) {
    return next(new AppError("Seller not found", 404));
  }

  // Get agentId from the authenticated agent
  const agentId = req.agent.id; // Assuming req.agent.id holds the authenticated agent's ID

  // Check if the agent exists
  const agentExists = await Agent.findById(agentId);
  if (!agentExists) {
    return next(new AppError("Agent not found", 404));
  }

  // Validate imageUrls (if provided)
  if (imageUrls && !Array.isArray(imageUrls)) {
    return next(new AppError("imageUrls must be an array", 400));
  }

  const newItem = await Item.create({
    seller,
    agentId, // Added the agentId here
    name,
    quantity,
    priceInBirr,
    imageUrls, // Handle image URLs here
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

  // Find the item by ID
  const item = await Item.findById(id);
  if (!item) {
    return next(new AppError("Item not found", 404));
  }

  // Check if the logged-in agent's ID matches the item agentId
  if (item.agentId.toString() !== req.agent.id) {
    return next(
      new AppError("You are not authorized to update this item", 403)
    );
  }

  // Check if seller exists if `seller` is being updated
  if (updateFields.seller) {
    const sellerExists = await Farmer.findById(updateFields.seller);
    if (!sellerExists) {
      return next(new AppError("Seller not found", 404));
    }
  }

  // Validate imageUrls (if provided in the update request)
  if (updateFields.imageUrls && !Array.isArray(updateFields.imageUrls)) {
    return next(new AppError("imageUrls must be an array", 400));
  }

  // Update the item with the new data
  const updatedItem = await Item.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  }).populate("seller");

  res.status(200).json({
    status: "success",
    data: {
      item: updatedItem,
    },
  });
});

// Read all items
exports.ReadAll = catchAsync(async (req, res, next) => {
  const items = await Item.find(); // Populate seller details

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
