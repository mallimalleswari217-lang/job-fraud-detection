// src/server.js
require("dotenv").config({ path: "../.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Job model
const Job = require("./models/Job");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Fraud detection function
function detectFraud(job) {
  const suspiciousKeywords = [
    // Generic scam phrases
    "urgent hiring",
    "work from home",
    "easy money",
    "quick money",
    "earn daily",
    "earn ₹5000",
    "no experience",
    "part time without skills",
    "captcha typing",
    "data entry",
    "sms sending",
    "form filling",

    // Education bait
    "10th pass",
    "12th pass",
    "btech graduates",
    "any graduates",
    "freshers welcome",

    // Call center / voice process
    "voice process",
    "telecaller",
    "domestic bpo",
    "international bpo",

    // Too-good-to-be-true perks
    "free laptop",
    "joining bonus",
    "instant joining",
    "salary advance",
    "work 2 hours",

    // Company / title red flags
    "salesman",
    "kfc",
    "google hiring",
    "amazon hiring",
    "flipkart hiring",
    "job consultancy",
    "placement service"
  ];

  const text = (job.title + " " + job.company + " " + job.description).toLowerCase();
  return suspiciousKeywords.some(keyword => text.includes(keyword)) ? "Fraud" : "Legit";
}

// Sanity check route
app.get("/", (req, res) => {
  res.send("Backend is running fine!");
});

// Create job with fraud detection
app.post("/fraud-check", async (req, res) => {
  try {
    const job = new Job(req.body);
    job.status = detectFraud(req.body); // add fraud status
    await job.save();
    res.json({ job });
  } catch (err) {
    res.status(500).json({ error: "Error saving job" });
  }
});

// Get all jobs
app.get("/fraud-check", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching jobs" });
  }
});

// Delete job
app.delete("/fraud-check/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting job" });
  }
});

// Update job with fraud detection
app.put("/fraud-check/:id", async (req, res) => {
  try {
    const status = detectFraud(req.body);
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status },
      { new: true }
    );
    res.json({ job: updatedJob });
  } catch (err) {
    res.status(500).json({ error: "Error updating job" });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));