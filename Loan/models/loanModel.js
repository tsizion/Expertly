const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer", // Reference to the farmer taking the loan
      required: [true, "Borrower reference is required"],
    },
    amount: {
      type: Number,
      required: [true, "Loan amount is required"],
      min: [1, "Loan amount must be greater than 0"],
    },
    interestRate: {
      type: Number,
      required: [true, "Interest rate is required"],
      min: [0, "Interest rate must be positive"],
    },
    loanTerm: {
      type: Number,
      required: [true, "Loan term is required"], // in months
    },
    repaymentSchedule: {
      type: String,
      enum: ["Monthly", "Quarterly", "Annually"],
      required: [true, "Repayment schedule is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Defaulted"],
      default: "Active",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    lastPaymentDate: {
      type: Date,
    },
    totalAmountPayable: {
      type: Number,
      required: [true, "Total payable amount is required"],
    },
    outstandingAmount: {
      type: Number,
      required: [true, "Outstanding amount is required"],
    },
  },
  { timestamps: true }
);

// Calculate the total amount payable (principal + interest) and the monthly installments
loanSchema.pre("save", function (next) {
  const principal = this.amount;
  const interest = (principal * this.interestRate) / 100;
  this.totalAmountPayable = principal + interest;
  this.outstandingAmount = this.totalAmountPayable;
  // Calculate the loan repayment based on the loan term and schedule
  next();
});

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
