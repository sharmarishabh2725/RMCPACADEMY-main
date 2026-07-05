import { Schema, model } from "mongoose";
const tcRequestSchema = new Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    admissionNumber: {
      type: String,
      required: true,
    },
    aadharUid: {
      type: String,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
      match: /^\d{10}$/,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TcRequest = model("tcRequest", tcRequestSchema);

export default TcRequest;
