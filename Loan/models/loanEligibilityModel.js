const mongoose = require("mongoose");
const Transaction = require("./Transaction"); // Reference to Transaction Model

const loanEligibilitySchema = new mongoose.Schema(
  {
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: [true, "Borrower reference is required"],
    },

    totalTransactionValue: {
      type: Number, // Total value of money transactions over a certain period (e.g., last 6 months)
      default: 0,
    },
    numberOfTransactions: {
      type: Number, // Total number of transactions in a certain period
      default: 0,
    },
    eligibilityStatus: {
      type: String,
      enum: ["Eligible", "Not Eligible", "Pending"],
      default: "Pending",
    },
    eligibilityReason: {
      type: String,
      enum: [
        "Good Credit",
        "Excessive Debt",
        "Low Income",
        "Low Credit Score",
        "Other",
      ],
      default: "Pending",
    },
    decisionDate: {
      type: Date,
      default: Date.now, // Date of eligibility decision
    },
    remarks: {
      type: String, // Additional remarks about the eligibility decision
      default: "",
    },
  },
  { timestamps: true }
);

// Method to calculate eligibility based on criteria

const LoanEligibility = mongoose.model(
  "LoanEligibility",
  loanEligibilitySchema
);

module.exports = LoanEligibility;
