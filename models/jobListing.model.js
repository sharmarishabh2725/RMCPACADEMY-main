import { Schema, model } from "mongoose";

const jobListingSchema = new Schema(
  {
    jobTitle: { type: String, required: true, trim: true, index: true },
    jobDescription: { type: String, required: true },
    keyResponsibilities: {
      type: [String],
      required: true,
    },
    qualificationsAndRequirements: {
      type: [String],
      required: true,
    },
    employmentType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract"],
      required: true,
    },
  },
  { timestamps: true }
);

jobListingSchema.index({ jobTitle: "text", jobDescription: "text" }); // Full-text search index

const JobListing = model("JobListing", jobListingSchema);
export default JobListing;
