import Enquiry from "../models/enquiry.model.js";

// CREATE: Add a new enquiry
const createEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    if (!enquiry) {
      throw Error("Enquiry not created");
    }
    res.status(201).json({ message: "Enquiry created successfully", enquiry });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ: Get all enquiries with pagination & search
const getEnquiries = async (req, res) => {
  try {
    const { search, admissionClass, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [{ studentName: { $regex: search, $options: "i" } }];
    }

    if (admissionClass) {
      filter.admissionClass = { $regex: `^${admissionClass}$`, $options: "i" };
    }

    const enquiries = await Enquiry.find(filter)
      .select("studentName admissionClass category referredBy fatherMobile _id")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(enquiries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
};

// READ: Get a single enquiry by ID
const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ error: "Enquiry not found" });

    res.status(200).json(enquiry);
  } catch (err) {
    res.status(500).json({ error: "Invalid Enquiry ID" });
  }
};

// DELETE: Remove an enquiry
const deleteEnquiry = async (req, res) => {
  try {
    const deletedEnquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!deletedEnquiry)
      return res.status(404).json({ error: "Enquiry not found" });

    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete enquiry" });
  }
};

export { createEnquiry, getEnquiries, getEnquiryById, deleteEnquiry };
