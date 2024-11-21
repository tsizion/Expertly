const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: [true, "Donor is required"],
    },
    studentNeed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentNeed", // Changed from Campaign to StudentNeed
      required: [true, "Student need is required"],
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
