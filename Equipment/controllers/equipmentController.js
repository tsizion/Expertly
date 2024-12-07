const Equipment = require("../models/equipment"); // Assuming this is the Equipment model
const catchAsync = require("../../ErrorHandlers/catchAsync"); // For error handling

// Create a new Equipment
exports.Create = catchAsync(async (req, res) => {
  const { name, type, condition, seller, price, description, imageUrls } =
    req.body;

  // Check if the seller exists
  const existingSeller = await Farmer.findById(seller);
  if (!existingSeller) {
    return res.status(400).json({
      status: "fail",
      message: "Seller not found. Please provide a valid seller ID.",
    });
  }

  // Create the equipment
  const equipment = await Equipment.create({
    name,
    type,
    condition,
    seller,
    price,
    description,
    imageUrls,
  });

  res.status(201).json({
    status: "success",
    data: {
      equipment,
    },
  });
});

// Get all Equipment
exports.ReadAll = catchAsync(async (req, res) => {
  const equipmentList = await Equipment.find();

  res.status(200).json({
    status: "success",
    results: equipmentList.length,
    data: {
      equipment: equipmentList,
    },
  });
});

// Get Equipment by ID
exports.ReadOne = catchAsync(async (req, res) => {
  const { id } = req.params;

  const equipment = await Equipment.findById(id);

  if (!equipment) {
    return res.status(404).json({
      status: "fail",
      message: "No equipment found with this ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      equipment,
    },
  });
});

// Update Equipment by ID
exports.Update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const equipment = await Equipment.findByIdAndUpdate(id, updates, {
    new: true, // Return the updated document
    runValidators: true, // Ensure validation rules are applied
  });

  if (!equipment) {
    return res.status(404).json({
      status: "fail",
      message: "No equipment found with this ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      equipment,
    },
  });
});

// Delete Equipment by ID
exports.Delete = catchAsync(async (req, res) => {
  const { id } = req.params;

  const equipment = await Equipment.findByIdAndDelete(id);

  if (!equipment) {
    return res.status(404).json({
      status: "fail",
      message: "No equipment found with this ID",
    });
  }

  res.status(204).json({
    status: "success",
    message: "Equipment successfully deleted",
  });
});
