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
    priceInBirr: {
      type: Number,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
// item_name,type,price
// Sorghum,grain,15
// Wheat,grain,20
// Teff,grain,25
// Oat,grain,18
// Rice,grain,22
// Barley,grain,17
// Tractor,equipment,10000
// Plow,equipment,2000
// Seeder,equipment,3000
// Harvester,equipment,12000
// Sprayer,equipment,5000
// Calculate the equivalent items for a given grain

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
