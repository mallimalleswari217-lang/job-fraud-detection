const Job = require('../models/Job');

// Fraud detection function
function detectFraud(job) {
  const suspiciousKeywords = [
    "urgent hiring",
    "work from home",
    "easy money",
    "btech graduates",
    "voice process"
  ];
  const text = (job.title + " " + job.company + " " + job.description).toLowerCase();
  return suspiciousKeywords.some(keyword => text.includes(keyword)) ? "Fraud" : "Legit";
}

// Create a job
const createJob = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug log

    const job = new Job(req.body);
    job.status = detectFraud(req.body); // add fraud status
    await job.save();

    res.json({ message: "Job saved successfully", job });
  } catch (err) {
    console.error("Error saving job:", err); // Debug log
    res.status(500).json({ error: "Failed to save job" });
  }
};

// Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// Update a job
const updateJob = async (req, res) => {
  try {
    console.log("Update body:", req.body); // Debug log

    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ message: "Job updated successfully", job });
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ error: "Failed to update job" });
  }
};

// Delete a job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ error: "Failed to delete job" });
  }
};

module.exports = { createJob, getJobs, updateJob, deleteJob };