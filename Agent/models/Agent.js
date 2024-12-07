const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    // farmersRegistered: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Farmer", // References farmers registered by the agent
    //   },
    // ],
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station", // References the station the agent is assigned to
      required: true, // Ensure the agent is always associated with a station
    },
    itemsScreened: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item", // References items screened by the agent
      },
    ],
    transactionsHandled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction", // References transactions the agent facilitated
      },
    ],
  },
  { timestamps: true }
);

const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;
