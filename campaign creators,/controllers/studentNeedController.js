const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const StudentNeed = require("../models/studentNeedModel"); // Assuming your model is named studentNeedModel

// Create a new student need entry
exports.Create = catchAsync(async (req, res, next) => {
  const { student, needName, goalAmount, description, status } = req.body;

  // Validate request data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Create the student need object
  const studentNeedData = {
    student,
    needName,
    goalAmount,
    description,
    status,
  };

  // Create a new student need entry in MongoDB
  const newStudentNeed = await StudentNeed.create(studentNeedData);

  res.status(201).json({
    status: "success",
    data: {
      studentNeed: newStudentNeed,
    },
  });
});

// Read all student need entries
exports.ReadAll = catchAsync(async (req, res, next) => {
  const studentNeeds = await StudentNeed.find()
    .populate("student")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: studentNeeds.length,
    data: {
      studentNeeds,
    },
  });
});

// Read a single student need entry by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const studentNeed = await StudentNeed.findById(req.params.id).populate(
    "student"
  );

  if (!studentNeed) {
    return next(new AppError("Student need not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      studentNeed,
    },
  });
});

// Update student need details
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  // Validate request data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Find the student need by ID and update the specified fields
  const updatedStudentNeed = await StudentNeed.findByIdAndUpdate(
    id,
    updateFields,
    {
      new: true,
      runValidators: true,
    }
  ).populate("student");

  if (!updatedStudentNeed) {
    return next(new AppError("Student need not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      studentNeed: updatedStudentNeed,
    },
  });
});

// Delete a student need entry by ID
exports.Delete = catchAsync(async (req, res, next) => {
  const studentNeed = await StudentNeed.findById(req.params.id);

  if (!studentNeed) {
    return next(new AppError("Student need not found", 404));
  }

  await StudentNeed.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: `Student need for ${studentNeed.needName} has been successfully deleted.`,
    data: null,
  });
});
