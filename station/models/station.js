const mongoose = require("mongoose");

const Station = new mongoose.Schema(
  {
    stationName: {
      type: String,
      required: true, // Name of the central station
    },
    location: {
      city: {
        type: String,
        required: true, // City or town where the station is located
      },
      region: {
        type: String,
        required: true, // The region or district
      },
      coordinates: {
        latitude: {
          type: Number,
          required: true, // Latitude of the station
        },
        longitude: {
          type: Number,
          required: true, // Longitude of the station
        },
      },
    },
    agents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent", // References the agents assigned to this station
      },
    ],
    contactInfo: {
      phoneNumber: {
        type: String,
        required: true, // Contact phone number for the station
      },
      email: {
        type: String,
        required: true, // Contact email for the station
      },
    },
    activeStatus: {
      type: Boolean,
      default: true, // Indicates whether the station is active
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

const StationModel = mongoose.model("StationModel", Station);

module.exports = StationModel;
