import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    // Personal Details
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    githubId: String,
    email: { type: String, required: true },
    linkedId: String,
    phoneNumber: String,

    // Employment History
    employmentHistory: [
      {
        company: String,
        title: String,
        location: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    // Education
    educationList: [
      {
        institution: String,
        degree: String,
        startDate: String,
        endDate: String,
      },
    ],

    // Skill Groups
    skills: [
      {
        heading: String,
        skills: [String],
      },
    ],

    // Projects
    projectHistory: [
      {
        title: { type: String },
        description: { type: String },
        stack: { type: [String], default: [] },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
