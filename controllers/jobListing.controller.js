import JobListing from "../models/jobListing.model.js";
// CREATE: Add a new job listing
const createJob = async (req, res) => {
  try {
    const job = await JobListing.create(req.body);
    if (!job) {
      throw Error("Job not created");
    }
    res.status(201).json({ message: "Job created successfully", job });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ: Get all jobs with pagination & search
const getJobs = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const filter = search ? { $text: { $search: search } } : {};

    const jobs = await JobListing.find(filter)
      .select([
        "-createdAt",
        "-keyResponsibilities",
        "-qualificationsAndRequirements",
        "-employmentType",
      ])
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// READ: Get a single job by ID
const getJobById = async (req, res) => {
  try {
    const job = await JobListing.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: "Invalid Job ID" });
  }
};

// UPDATE: Modify a job listing
const updateJob = async (req, res) => {
  try {
    const updatedJob = await JobListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedJob) return res.status(404).json({ error: "Job not found" });

    res.status(200).json({ message: "Job updated successfully", updatedJob });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE: Remove a job listing
const deleteJob = async (req, res) => {
  try {
    const deletedJob = await JobListing.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).json({ error: "Job not found" });

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete job" });
  }
};

export { createJob, getJobs, getJobById, updateJob, deleteJob };
