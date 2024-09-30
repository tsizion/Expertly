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
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: [true, "Campaign is required"],
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
