const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// GET all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// CREATE a new job
router.post("/", async (req, res) => {
  try {
    const { title, company, description } = req.body;

    const job = new Job({
      title,
      company,
      description,
      status: "Pending" // default
    });

    await job.save();
    res.json({ job });
  } catch (err) {
    res.status(500).json({ error: "Failed to create job" });
  }
});

// UPDATE job status (Fraud / Legit)
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ job });
  } catch (err) {
    res.status(500).json({ error: "Failed to update job status" });
  }
});

// DELETE a job
router.delete("/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete job" });
  }
});

module.exports = router;