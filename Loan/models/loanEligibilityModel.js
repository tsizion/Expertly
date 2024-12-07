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
loanEligibilitySchema.methods.checkEligibility = async function () {
  const { borrower, totalIncome, totalDebt, creditScore, requestedLoanAmount } =
    this;

  // Fetch recent transactions for the borrower (e.g., last 6 months)
  const recentTransactions = await Transaction.find({
    $or: [{ seller: borrower }, { buyer: borrower }],
    transactionType: "Money", // Only consider money transactions for loan eligibility
    status: "Completed", // Only completed transactions
    createdAt: {
      $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    }, // Last 6 months
  });

  const totalTransactionValue = recentTransactions.reduce(
    (acc, transaction) => acc + transaction.transactionValueInBirr,
    0
  );
  const numberOfTransactions = recentTransactions.length;

  this.totalTransactionValue = totalTransactionValue;
  this.numberOfTransactions = numberOfTransactions;

  // Example eligibility logic considering total transaction value and other factors
  if (
    creditScore >= 75 &&
    totalIncome > totalDebt &&
    requestedLoanAmount <= totalIncome * 2
  ) {
    this.eligibilityStatus = "Eligible";
    this.eligibilityReason = "Good Credit";
  } else if (totalDebt > totalIncome) {
    this.eligibilityStatus = "Not Eligible";
    this.eligibilityReason = "Excessive Debt";
  } else if (creditScore < 50) {
    this.eligibilityStatus = "Not Eligible";
    this.eligibilityReason = "Low Credit Score";
  } else if (totalIncome < requestedLoanAmount / 2) {
    this.eligibilityStatus = "Not Eligible";
    this.eligibilityReason = "Low Income";
  } else if (totalTransactionValue < 10000) {
    // Arbitrary threshold for the total value of transactions
    this.eligibilityStatus = "Not Eligible";
    this.eligibilityReason = "Low Transaction Volume";
  } else if (numberOfTransactions < 5) {
    // Arbitrary threshold for the number of transactions
    this.eligibilityStatus = "Not Eligible";
    this.eligibilityReason = "Low Transaction Frequency";
  } else {
    this.eligibilityStatus = "Pending";
    this.eligibilityReason = "Other";
  }
  await this.save();
};

const LoanEligibility = mongoose.model(
  "LoanEligibility",
  loanEligibilitySchema
);

module.exports = LoanEligibility;
