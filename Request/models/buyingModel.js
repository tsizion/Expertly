const mongoose = require("mongoose");

const buyingRequestSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer", // Reference to the farmer making the buying request
      required: [true, "Buyer reference is required"],
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item", // Reference to the item being requested (the item they want to buy)
      required: [true, "Item is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be greater than 0"],
    },
    exchangeType: {
      type: String,
      enum: ["Money", "Grain", "Equipment"], // The type of exchange: Money, Grain, or Equipment
      required: [true, "Exchange type is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Completed", "Cancelled"], // The status of the request
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const BuyingRequest = mongoose.model("BuyingRequest", buyingRequestSchema);

module.exports = BuyingRequest;
