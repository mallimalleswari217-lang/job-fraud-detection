// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

function App() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [editingJobId, setEditingJobId] = useState(null);
  const [editFields, setEditFields] = useState({ title: "", company: "", description: "", link: "" });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/fraud-check`);
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const addJob = async () => {
    try {
      const res = await axios.post(`${API_BASE}/fraud-check`, {
        title,
        company,
        description,
        link,
      });
      setJobs([...jobs, res.data.job]);
      setTitle("");
      setCompany("");
      setDescription("");
      setLink("");
    } catch (err) {
      console.error("Error adding job:", err);
    }
  };

  const startEdit = (job) => {
    setEditingJobId(job._id);
    setEditFields({
      title: job.title,
      company: job.company,
      description: job.description,
      link: job.link || "",
    });
  };

  const saveEdit = async (id) => {
    try {
      const res = await axios.put(`${API_BASE}/fraud-check/${id}`, editFields);
      setJobs(jobs.map((job) => (job._id === id ? res.data.job : job)));
      setEditingJobId(null);
      setEditFields({ title: "", company: "", description: "", link: "" });
    } catch (err) {
      console.error("Error updating job:", err);
    }
  };

  const deleteJob = async (id) => {
    try {
      await axios.delete(`${API_BASE}/fraud-check/${id}`);
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  return (
    <div className="App">
      <h1>Job Fraud Detection</h1>
      <input
        type="text"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Job Link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button onClick={addJob}>Add Job</button>

      <table border="1" style={{ marginTop: "20px", width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Description</th>
            <th>Link</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              {editingJobId === job._id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editFields.title}
                      onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editFields.company}
                      onChange={(e) => setEditFields({ ...editFields, company: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editFields.description}
                      onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editFields.link}
                      onChange={(e) => setEditFields({ ...editFields, link: e.target.value })}
                    />
                  </td>
                  <td style={{ fontWeight: "bold", color: job.status === "Fraud" ? "red" : "green" }}>
                    {job.status}
                  </td>
                  <td>
                    <button
                      style={{ backgroundColor: "#28a745", color: "white", marginRight: "5px" }}
                      onClick={() => saveEdit(job._id)}
                    >
                      Save
                    </button>
                    <button
                      style={{ backgroundColor: "lightgray" }}
                      onClick={() => setEditingJobId(null)}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>{job.description}</td>
                  <td>
                    {job.link ? (
                      <a href={job.link} target="_blank" rel="noopener noreferrer">
                        View Job
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td style={{ fontWeight: "bold", color: job.status === "Fraud" ? "red" : "green" }}>
                    {job.status}
                  </td>
                  <td>
                    <button
                      style={{
                        marginRight: "5px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                      }}
                      onClick={() => startEdit(job)}
                    >
                      Update
                    </button>
                    <button
                      style={{
                        backgroundColor: "lightgray",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                      }}
                      onClick={() => deleteJob(job._id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;