const Consultation = require("../models/Consultation");
const catchAsync = require("../../ErrorHandlers/catchAsync"); // For error handling
const AppError = require("../../ErrorHandlers/appError"); // For error handling

// Create a new Consultation
exports.Create = catchAsync(async (req, res, next) => {
  const { title, description, hourlyRate, schedule, duration, status } =
    req.body;
  const expertIdFromToken = req.expert.id; // Getting the expert ID from the authenticated expert (req.expert)

  // Default status is 'Draft' if not provided
  const newStatus = status || "Draft";

  // Create the consultation
  const consultation = await Consultation.create({
    expert: expertIdFromToken,
    title,
    description,
    hourlyRate,
    schedule,
    duration,
    status: newStatus,
  });

  res.status(201).json({
    status: "success",
    data: {
      consultation,
    },
  });
});

// Get all Consultations for the authenticated expert
exports.ReadAllByExpert = catchAsync(async (req, res, next) => {
  const expertIdFromToken = req.expert.id; // Getting the expert ID from the authenticated expert (req.expert)

  const consultations = await Consultation.find({ expert: expertIdFromToken });

  if (!consultations || consultations.length === 0) {
    return next(new AppError("No consultations found for this expert", 404));
  }

  res.status(200).json({
    status: "success",
    results: consultations.length,
    data: {
      consultations,
    },
  });
});
// Get all Consultations (No expert restriction)
exports.ReadAll = catchAsync(async (req, res, next) => {
  const consultations = await Consultation.find();

  res.status(200).json({
    status: "success",
    results: consultations.length,
    data: {
      consultations,
    },
  });
});

// Get Consultation by ID
exports.ReadOneByExpert = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const expertIdFromToken = req.expert.id; // Getting the expert ID from the authenticated expert (req.expert)

  // Find consultation by ID and ensure it belongs to the authenticated expert
  const consultation = await Consultation.findOne({
    _id: id,
    expert: expertIdFromToken,
  });

  if (!consultation) {
    return next(
      new AppError(
        "Consultation not found or does not belong to this expert",
        404
      )
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      consultation,
    },
  });
});
// Get Consultation by ID (No expert restriction)
exports.ReadOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Find the consultation by its ID
  const consultation = await Consultation.findById(id);

  if (!consultation) {
    return next(new AppError("Consultation not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      consultation,
    },
  });
});

// Update Consultation by ID
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;
  const expertIdFromToken = req.expert.id; // Getting the expert ID from the authenticated expert (req.expert)

  // Ensure only valid status values can be set
  if (
    updates.status &&
    !["Draft", "Active", "Unavailable"].includes(updates.status)
  ) {
    return next(new AppError("Invalid status value", 400));
  }

  // Find and update consultation
  const consultation = await Consultation.findOneAndUpdate(
    { _id: id, expert: expertIdFromToken },
    updates,
    { new: true, runValidators: true }
  );

  if (!consultation) {
    return next(
      new AppError(
        "Consultation not found or does not belong to this expert",
        404
      )
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      consultation,
    },
  });
});

// Delete Consultation by ID
exports.Delete = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const expertIdFromToken = req.expert.id; // Getting the expert ID from the authenticated expert (req.expert)

  // Find and delete consultation
  const consultation = await Consultation.findOneAndDelete(
    { _id: id, expert: expertIdFromToken },
    { returnDocument: "before" } // Return the document before deletion
  );

  if (!consultation) {
    return next(
      new AppError(
        "Consultation not found or does not belong to this expert",
        404
      )
    );
  }

  res.status(200).json({
    status: "success",
    message: "Consultation successfully deleted",
    data: {
      deletedConsultation: consultation,
    },
  });
});
