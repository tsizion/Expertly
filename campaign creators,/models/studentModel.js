const mongoose = require("mongoose");

const studentInfoSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student's name is required"],
    },
    studentEmail: {
      type: String,
    },
    studentPhone: {
      type: String,
      required: [true, "Student's phone number is required"],
    },
    studentAddress: {
      type: String,
      required: [true, "Student's address is required"],
    },
    educationLevel: {
      type: String,
      required: [true, "Student's education level is required"],
      enum: ["High School", "University"], // The student can either be in high school or university
    },
    grade: {
      type: String, // The grade level (only for high school students)
      required: function () {
        return this.educationLevel === "High School"; // Required only if the student is in high school
      },
    },
    institution: {
      type: String, // The name of the school or university
      required: [true, "Institution name is required"],
    },
    universityYear: {
      type: String, // Year of study (e.g., Freshman, Sophomore, Junior, Senior)
      required: function () {
        return this.educationLevel === "University"; // Only required if the student is in university
      },
    },
    department: {
      type: String, // The student's department (e.g., Computer Science, Medicine)
      required: function () {
        return this.educationLevel === "University"; // Only required if the student is in university
      },
    },
    hasDisability: {
      type: Boolean,
      default: false, // Whether the student has a disability
    },
    disabilityDetails: {
      type: String, // Details about the disability if applicable
      required: function () {
        return this.hasDisability; // Only required if the student has a disability
      },
    },
    hasFamilySupport: {
      type: Boolean,
      default: false, // Whether the student has family support
    },
    familyDetails: {
      type: String, // Details about the family situation if applicable
      required: function () {
        return !this.hasFamilySupport; // Only required if the student has no family support
      },
    },
    fundingNeeds: {
      type: String, // Description of what funding is needed
      required: [true, "Funding needs must be specified"],
    },
  },
  { timestamps: true }
);

const StudentInfo = mongoose.model("StudentInfo", studentInfoSchema);

module.exports = StudentInfo;
