const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    consultation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation", // Reference to the Consultation model
      required: [true, "Consultation ID is required"],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client", // Reference to the Client/User model
      required: [true, "Client ID is required"],
    },
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert", // Reference to the Expert model
      required: [true, "Expert ID is required"],
    },
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"], // Specific time for the appointment
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"], // Duration of the appointment (in minutes)
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending", // Indicates the payment status for the appointment
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled", // Tracks the status of the appointment
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
