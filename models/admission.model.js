import { Schema, model } from "mongoose";
const AdmissionSchema = new Schema(
  {
    // Student Details
    studentFirstName: { type: String, required: true },
    studentMiddleName: { type: String },
    studentLastName: { type: String, required: true },
    studentAadharNo: { type: String, required: true },
    studentAadharFile: { type: String }, // File path or URL
    studentPhoto: { type: String },
    studentMigrationDocument: { type: String },
    studentBirthCertificate: { type: String },
    abcCard: { type: String },
    abcId: { type: String },

    // Father Details
    fatherFirstName: { type: String, required: true },
    fatherMiddleName: { type: String },
    fatherLastName: { type: String, required: true },
    fatherAadharFile: { type: String },
    fatherPhoto: { type: String },

    // Mother Details
    motherFirstName: { type: String, required: true },
    motherMiddleName: { type: String },
    motherLastName: { type: String, required: true },
    motherAadharFile: { type: String },
    motherPhoto: { type: String },

    // Additional Details
    domicileCertificate: { type: String },
    contactNo: { type: String, required: true },

    // Academic Documents
    previousSchoolTC: { type: String },
    previousMarksheet: { type: String },

    // Admission Details
    admissionClass: { type: String, required: true },
    governmentScholarship: { type: String, enum: ["yes", "no"], default: "no" },
    scholarshipDocument: { type: String },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending"],
      default: "pending",
    },
    transactionId: { type: String },
  },
  { timestamps: true }
);

const Admission = model("Admission", AdmissionSchema);
export default Admission;
