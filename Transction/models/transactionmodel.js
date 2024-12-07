const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: [true, "Seller is required"],
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: [true, "Buyer is required"],
    },
    itemSold: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "Item being sold is required"],
    },
    itemBought: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "Item being bought is required"],
    },
    amountSold: {
      type: Number,
      required: [true, "Amount of item sold is required"],
    },
    amountBought: {
      type: Number,
      required: [true, "Amount of item bought is required"],
    },
    transactionValueInBirr: {
      type: Number, // The total value of the transaction in Birr
      required: [true, "Transaction value in Birr is required"],
    },
    transactionType: {
      type: String,
      enum: ["Barter", "Money"],
      required: [true, "Transaction type is required"], // Barter = exchange of goods, Money = cash exchange
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
