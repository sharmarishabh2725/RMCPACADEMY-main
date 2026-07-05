import TcRequest from "../models/tcRequest.model.js";
// Create a new TC request
const createTcRequest = async (req, res) => {
  try {
    const newTcRequest = await TcRequest.create(req.body);
    if (!newTcRequest)
      return res.status(400).json({ error: "Could not create TC request" });
    res.status(201).json(newTcRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all TC requests
const getAllTcRequests = async (req, res) => {
  try {
    // Extract query parameters
    const { search, admissionNumber, page = 1, limit = 10 } = req.query;
    const query = {};

    // Apply search filter if provided
    if (search) {
      query.studentName = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    if (admissionNumber) {
      query.admissionNumber = { $regex: admissionNumber, $options: "i" };
    }

    // Pagination options
    const options = {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
    };

    // Fetch data with filters and pagination
    const tcRequests = await TcRequest.find(query)
      .select("studentName contact admissionNumber paymentStatus email")
      .skip(options.skip)
      .limit(options.limit);

    // Get total count for pagination info
    const totalRequests = await TcRequest.countDocuments(query);

    res.status(200).json({
      data: tcRequests,
      totalRequests,
      currentPage: Number(page),
      totalPages: Math.ceil(totalRequests / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single TC request by ID
const getTcRequestById = async (req, res) => {
  try {
    const tcRequest = await TcRequest.findById(req.params.id);
    if (!tcRequest)
      return res.status(404).json({ error: "TC Request not found" });
    res.status(200).json(tcRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTcRequestAdmissionNumber = async (req, res) => {
  try {
    const tcRequests = await TcRequest.find({
      admissionNumber: req.params.id,
    }).countDocuments();
    if (!tcRequests)
      return res.status(404).json({ error: "TC Request not found" });
    res.status(200).json(tcRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a TC request by ID
const deleteTcRequest = async (req, res) => {
  try {
    const deletedTcRequest = await TcRequest.findByIdAndDelete(req.params.id);
    if (!deletedTcRequest)
      return res.status(404).json({ error: "TC Request not found" });
    res.status(200).json({ message: "TC Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createTcRequest,
  getAllTcRequests,
  getTcRequestAdmissionNumber,
  getTcRequestById,
  deleteTcRequest,
};
