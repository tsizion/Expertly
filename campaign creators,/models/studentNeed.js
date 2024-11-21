const mongoose = require("mongoose");

const studentNeedSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentInfo", // Reference to the StudentInfo model
      required: [true, "Student information is required"],
    },
    needName: {
      type: String,
      required: [true, "Need name is required"],
    },
    goalAmount: {
      type: Number,
      required: [true, "Goal amount is required"],
    },
    description: {
      type: String,
      required: [true, "Description of the need is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Fundraising", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const StudentNeed = mongoose.model("StudentNeed", studentNeedSchema);

module.exports = StudentNeed;
