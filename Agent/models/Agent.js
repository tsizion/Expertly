const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const agentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station", // References the station the agent is assigned to
      required: true, // Ensure the agent is always associated with a station
    },
    itemsScreened: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item", // References items screened by the agent
      },
    ],
    transactionsHandled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction", // References transactions the agent facilitated
      },
    ],
    imageUrls: [
      {
        type: String,
        required: false, // Optional field to store URLs of images related to the agent
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: 6,
      select: false, // Don't select the password by default when querying
    },
  },
  { timestamps: true }
);

// Hash the agent's password before saving it
agentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check if the agent's password is correct
agentSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;
