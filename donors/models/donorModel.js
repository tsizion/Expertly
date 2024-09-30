const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    FullName: {
      type: String,
      required: function () {
        return !this.isAnonymous;
      }, // Only required if not anonymous
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      required: function () {
        return !this.isAnonymous;
      }, // Only required if not anonymous
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"],
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Donor = mongoose.model("Donor", donorSchema);

module.exports = Donor;
