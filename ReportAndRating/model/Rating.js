const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert", // Reference to the Expert model
      required: [true, "Expert ID is required"],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client", // Reference to the Client model
      required: [true, "Client ID is required"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Rating is required"], // Rating out of 5
    },
    comment: {
      type: String,
      required: [true, "Rating comment is required"], // Optional comment with the rating
    },
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
