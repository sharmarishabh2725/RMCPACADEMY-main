import mongoose from "mongoose";

const CBSEDisclosureSchema = new mongoose.Schema(
  {
    generalInfo: {
      schoolName: String,
      affiliationNo: String,
      schoolCode: String,
      address: String,
      principalName: String,
      principalqual: String,
      email: String,
      contact: String,
    },
    documents: {
      societyCertificate: String,
      nocCertificate: String,
      waterCertificate: String,
      fireCertificate: String,
      buildingCertificate: String,
      recognitionCertificate: String,
      deoCertificate: String,
      landCertificate: String,
    },
    academics: {
      feeStructure: String,
      smcList: String,
      academicCalendar: String,
      ptaList: String,
      teachersDetails: String,
    },
    staff: {
      principal: String,
      totalTeachers: Number,
      ntt: Number,
      tgt: Number,
      prt: Number,
      sectionRatio: String,
      specialEducator: String,
      counsellor: String,
    },
    infrastructure: {
      campusArea: String,
      classRooms: String,
      laboratories: String,
      internetFacility: String,
      girlsToilets: Number,
      boysToilets: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CBSEDisclosure", CBSEDisclosureSchema);
