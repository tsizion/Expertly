const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer", // References the farmer making the request
      required: [true, "Farmer reference is required"],
    },
    itemName: {
      type: String,
      required: [true, "Item Name is required"],
    },
    desiredTrade: {
      type: String,
      enum: ["Money", "Grain", "Equipment"],
      required: [true, "Desired trade type is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Completed"],
      default: "Pending",
    },
    agentAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent", // References the agent assigned to handle the request
    },
    screeningPassed: {
      type: Boolean,
      default: false, // Updated after item screening by an agent
    },
    callCenterNote: {
      type: String, // Optional notes from the call center for additional context
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
