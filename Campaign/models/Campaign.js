const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    goalAmount: {
      type: Number,
      required: [true, "Goal amount is required"],
    },
    fundsRaised: {
      type: Number,
      default: 0,
    },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Creator is required"],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "PendingApproval"],
      default: "PendingApproval",
    },
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;
