const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Appointment = require("../models/Appointment"); // Assuming the Appointment model is in models folder
const Expert = require("../../Expert/models/expertModel");
const Client = require("../../Client/models/Client");
const Consultation = require("../../Consultation/models/Consultation");

// Create a new appointment
exports.Create = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const {
    consultation,
    client,
    expert,
    date,
    timeSlot,
    duration,
    paymentStatus,
    status,
  } = req.body;

  // Check if Consultation, Client, and Expert exist
  const consultationExist = await Consultation.findById(consultation);
  const clientExist = await Client.findById(client);
  const expertExist = await Expert.findById(expert);

  if (!consultationExist) {
    return next(new AppError("Consultation not found", 404));
  }
  if (!clientExist) {
    return next(new AppError("Client not found", 404));
  }
  if (!expertExist) {
    return next(new AppError("Expert not found", 404));
  }

  // Create new appointment
  const newAppointment = await Appointment.create({
    consultation,
    client,
    expert,
    date,
    timeSlot,
    duration,
    paymentStatus,
    status,
  });

  res.status(201).json({
    status: "success",
    data: {
      appointment: newAppointment,
    },
  });
});

// Read all appointments
exports.ReadAll = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find()
    .populate("consultation")
    .populate("client")
    .populate("expert");

  res.status(200).json({
    status: "success",
    results: appointments.length,
    data: {
      appointments,
    },
  });
});

// Read a single appointment by ID
exports.getAppointmentById = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("consultation")
    .populate("client")
    .populate("expert");

  if (!appointment) {
    return next(new AppError("Appointment not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      appointment,
    },
  });
});

// Update an appointment
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    id,
    updateFields,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedAppointment) {
    return next(new AppError("Appointment not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      appointment: updatedAppointment,
    },
  });
});

// Delete an appointment by ID
exports.Delete = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new AppError("Appointment not found", 404));
  }

  await Appointment.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Appointment successfully deleted",
    data: null,
  });
});
