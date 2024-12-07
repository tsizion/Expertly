const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    digitalBirr: {
      type: Number,
      default: 50, // Initial free-tier balance
    },
    registeredByAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent", // References the agent who registered the farmer
      required: [true, "Agent reference is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction", // References transactions the farmer participated in
      },
    ],
  },
  { timestamps: true }
);

const Farmer = mongoose.model("Farmer", farmerSchema);

module.exports = Farmer;
