// src/pages/AddPatient.js
import React, { useState } from 'react';
import { db } from '../auth/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../auth/firebase';
import { useNavigate } from 'react-router-dom';

export default function AddPatient() {
  const [form, setForm] = useState({
    name: '',
    gender: '',
    dob: '',
    diagnosis: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, gender, dob, diagnosis, notes } = form;
    const doctor = auth.currentUser;

    if (!name || !gender || !dob || !diagnosis || !notes) {
      setError("All fields are required.");
      return;
    }

    try {
      await addDoc(collection(db, "patients"), {
        id: uuidv4(),
        name,
        gender,
        dob,
        diagnosis,
        notes,
        doctorId: doctor.uid
      });

      alert("Patient added successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to save patient.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Add Patient</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input name="name" placeholder="Patient Name" onChange={handleChange} />
      <input name="gender" placeholder="Gender" onChange={handleChange} />
      <input name="dob" placeholder="Date of Birth" type="date" onChange={handleChange} />
      <input name="diagnosis" placeholder="Diagnosis" onChange={handleChange} />
      <textarea name="notes" placeholder="Doctor's Notes" onChange={handleChange} />
      <button type="submit">Save</button>
    </form>
  );
}