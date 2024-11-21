const mongoose = require("mongoose");

// Referral Schema
const referralSchema = new mongoose.Schema(
  {
    referralCaseNumber: {
      type: String,
      unique: true,
      required: [true, "Referral case number is required"],
    },
    referrerName: {
      type: String,
      required: [true, "Referrer's name is required"],
    },
    referrerEmail: {
      type: String,
      required: [true, "Referrer's email is required"],
    },
    referrerPhone: {
      type: String,
      required: [true, "Referrer's phone number is required"],
    },
    studentName: {
      type: String,
      required: [true, "Student's name is required"],
    },
    studentEmail: {
      type: String,
    },
    studentPhone: {
      type: String,
    },
    studentAddress: {
      type: String,
    },
    needDescription: {
      type: String,
      required: [true, "Description of need is required"],
    },
    documents: {
      type: [String], // Array of strings to store document URLs or paths
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: [true, "A referral must be associated with a user"],
    },
  },
  { timestamps: true }
);

// Pre-save hook to auto-generate a case number if not provided
referralSchema.pre("save", function (next) {
  if (!this.referralCaseNumber) {
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
    this.referralCaseNumber = `RE${randomNumber}`;
  }
  next();
});

// Create and export the Referral model
const Referral = mongoose.model("Referral", referralSchema);

module.exports = Referral;
