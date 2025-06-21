import React, { useState, useEffect } from "react";
import { savePatient, getAllPatients } from "./idb";
import { syncQueueWithServer } from "./syncService";
import './App.css';

function App() {
  const [form, setForm] = useState({ name: "", dob: "", gender: "M", diagnosis: "", notes: "" });
  const [patients, setPatients] = useState([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await savePatient(form);
    setForm({ name: "", dob: "", gender: "M", diagnosis: "", notes: "" });
    const data = await getAllPatients();
    setPatients(data);
  };

  useEffect(() => {
    getAllPatients().then(setPatients);
    window.addEventListener("online", syncQueueWithServer);
    return () => window.removeEventListener("online", syncQueueWithServer);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>MedReach Haiti</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Patient Name" value={form.name} onChange={handleChange} required /><br />
        <input name="dob" type="date" value={form.dob} onChange={handleChange} required /><br />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="M">Male</option><option value="F">Female</option>
        </select><br />
        <input name="diagnosis" placeholder="Diagnosis" value={form.diagnosis} onChange={handleChange} required /><br />
        <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange}></textarea><br />
        <button type="submit">Save Patient</button>
      </form>

      <h3>Patient Records</h3>
      {patients.map((p, i) => (
        <div key={i} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}>
          <strong>{p.name}</strong> ({p.gender})<br />
          DOB: {p.dob}<br />
          Diagnosis: {p.diagnosis}<br />
          Notes: {p.notes}
        </div>
      ))}
    </div>
  );
}

export default App;