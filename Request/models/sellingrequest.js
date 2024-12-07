const mongoose = require("mongoose");

const sellingRequestSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer", // Reference to the farmer making the selling request
      required: [true, "Seller reference is required"],
    },
    itemName: {
      type: String,
      required: [true, "Item is required"],
    },
    quantity: {
      type: Number,
    },
    exchangeType: {
      type: String,
      enum: ["Money", "Grain", "Equipment"], // The type of exchange: Money, Grain, or Equipment
      required: [true, "Exchange type is required"],
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Completed", "Cancelled"], // Status of the request
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

const SellingRequest = mongoose.model("SellingRequest", sellingRequestSchema);

module.exports = SellingRequest;
