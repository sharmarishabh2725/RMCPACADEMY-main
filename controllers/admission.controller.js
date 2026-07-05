import { v2 as cloudinary } from "cloudinary";
import Admission from "../models/admission.model.js";
import { uploadCloud } from "../utils/cloudinary.js";
import path from "path";

// ✅ CREATE: Add a new admission
export const createAdmission = (req, res, next) => {
  uploadCloud(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ error: err.message || "File upload failed" });
    }
    try {
      const studentData = { ...req.body };

      if (req.files) {
        Object.keys(req.files).forEach((key) => {
          if (req.files[key]?.[0]?.path) {
            studentData[key] = req.files[key][0].path;
          }
        });
      }

      const newAdmission = await Admission.create(studentData);
      res.status(201).json({
        message: "application added successfully",
        admission: newAdmission,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

// ✅ READ: Get all students with search and pagination
export const getAdmissions = async (req, res, next) => {
  try {
    let { page = 1, limit = 50, search = "", admissionClass = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    // Search by name (first, middle, or last) if provided
    if (search) {
      query.$or = [
        { studentFirstName: { $regex: search, $options: "i" } },
        { studentMiddleName: { $regex: search, $options: "i" } },
        { studentLastName: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by admission class if provided
    if (admissionClass) {
      query.admissionClass = admissionClass;
    }

    const admissions = await Admission.find(query)
      .select(
        "studentFirstName studentLastName admissionClass abcId contactNo paymentStatus _id"
      )
      .skip((page - 1) * limit)
      .limit(limit);

    const totalRecords = await Admission.countDocuments(query);

    res.status(200).json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      data: admissions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAdmissionById = async (req, res, next) => {
  try {
    const admission = await Admission.findById(req.params.id);

    if (!admission)
      return res.status(404).json({ error: "Admission record not found" });

    res.status(200).json(admission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE: Remove an admission record and delete files from Cloudinary
export const deleteAdmission = async (req, res, next) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ error: "Student not found" });

    // Delete files from Cloudinary
    for (const key in admission.toObject()) {
      if (
        key.includes("File") ||
        key.includes("Photo") ||
        key.includes("Document")
      ) {
        const fileUrl = admission[key];
        if (fileUrl) {
          const fileName = path.basename(fileUrl); // Extract filename from URL
          const publicId = `admission_documents/${fileName.split(".")[0]}`; // Ensure folder structure
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    await Admission.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Admission record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
