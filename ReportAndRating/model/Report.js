const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment", // Reference to the Appointment model
      required: [true, "Appointment ID is required"],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client", // Reference to the Client model
      required: [true, "Client ID is required"],
    },
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert", // Reference to the Expert model
      required: [true, "Expert ID is required"],
    },
    issue: {
      type: String,
      required: [true, "Issue description is required"], // Reason for the report
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved", "Rejected"],
      default: "Pending", // The status of the report
    },
    resolution: {
      type: String, // Resolution if the report is resolved
      default: null,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
