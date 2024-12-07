const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer", // References the farmer who owns the item
      required: [true, "Farmer reference is required"],
    },
    type: {
      type: String,
      enum: ["Grain", "Equipment", "Other"],
      required: [true, "Item type is required"],
    },
    name: {
      type: String,
      required: [true, "Item name is required"],
    },
    description: {
      type: String,
      maxlength: 500, // Optional, additional details about the item
    },
    grainDetails: {
      weightInKg: {
        type: Number,
        required: function () {
          return this.type === "Grain";
        }, // Only required for grain type
      },
      grainType: {
        type: String,
        enum: ["Wheat", "Corn", "Barley", "Sorghum", "Other"],
        required: function () {
          return this.type === "Grain";
        }, // Only required for grain type
      },
    },
    equipmentDetails: {
      brand: {
        type: String,
        required: function () {
          return this.type === "Equipment";
        }, // Only required for equipment type
      },
      condition: {
        type: String,
        enum: ["New", "Used"],
        required: function () {
          return this.type === "Equipment";
        }, // Only required for equipment type
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    availability: {
      type: Boolean,
      default: true, // Indicates whether the item is still available
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
