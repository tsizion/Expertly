const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const expertSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: 6,
      select: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    specialization: [
      {
        type: String,
        required: [true, "At least one specialization is required"],
      },
    ],
    cv: {
      type: String,
      required: [true, "CV is required"],
    },
    license: {
      type: String,
      required: [true, "License is required"],
    },
    profilePicture: {
      type: String,
      default: "default-profile.jpg",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Declined"],
      default: "Pending",
    },
    languages: {
      type: [String], // Array to hold up to 4 languages
      validate: {
        validator: function (v) {
          return v.length <= 4; // Ensure no more than 4 languages
        },
        message: "You can select up to 4 languages.",
      },
      required: [true, "At least one language is required"],
    },
  },
  { timestamps: true }
);

// Hash password before saving
expertSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Check password correctness
expertSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Expert = mongoose.model("Expert", expertSchema);

module.exports = Expert;
