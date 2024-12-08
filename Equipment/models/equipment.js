const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Equipment name is required"],
    },
    type: {
      type: String,
      enum: ["Tool", "Machinery", "Accessory"], // Example: Tool (Shovel), Machinery (Tractor), Accessory (Hose)
      required: [true, "Equipment type is required"],
    },
    condition: {
      type: String,
      enum: ["New", "Used"],
      required: [true, "Condition of the equipment is required"],
    },

    price: {
      type: Number, // Price in digital birr or cash
      required: [true, "Price is required"],
    },
    description: {
      type: String,
      required: false, // Optional description for the equipment
    },
    imageUrls: [
      {
        type: String,
        required: false, // Optional images of the equipment
      },
    ],
    available: {
      type: Boolean,
      default: true, // Indicates if the equipment is still available for sale or barter
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = Equipment;
