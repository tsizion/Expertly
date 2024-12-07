const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer", // Reference to the farmer making the selling request
      required: [true, "Seller reference is required"],
    },
    name: {
      type: String,
      enum: [
        "Sorghum",
        "Oat",
        "Wheat",
        "Barley",
        "Sorghum",
        "Shovel",
        "Teff",
        "Rice",
      ], // Example: Teff, Shovel, Wheat
      required: [true, "Item name is required"],
    },
    quantity: {
      type: Number,
      required: true,
    },

    imageUrls: [
      {
        type: String,
        required: false, // Optional field to store URLs of images related to the agent
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
