const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
      required: [true, "Expert ID is required"],
    },
    title: {
      type: String,
      required: [true, "Consultation title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    hourlyRate: {
      type: Number,
      required: [true, "Hourly rate is required"],
    },
    schedule: [
      {
        day: { type: String, required: true },
        slots: [{ type: String, required: true }],
      },
    ],
    duration: {
      type: Number,
      required: [true, "Duration is required"],
    },
    status: {
      type: String,
      enum: ["Draft", "Active", "Unavailable"],
      default: "Draft", // Set default status as 'Draft'
    },
    lastUpdated: {
      type: Date,
      default: Date.now, // Automatically set when created
    },
  },
  { timestamps: true }
);

const Consultation = mongoose.model("Consultation", consultationSchema);

module.exports = Consultation;
