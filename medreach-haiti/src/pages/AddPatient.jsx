import React, { useState } from 'react';
import { db } from '../auth/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../auth/firebase';
import { useNavigate } from 'react-router-dom';
import { initDB, savePatientLocally } from './localDb'; 

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

    const newPatient = {
      id: uuidv4(),
      name,
      gender,
      dob,
      diagnosis,
      notes,
      doctorId: doctor.uid
    };

    try {
      const dbInstance = await initDB();
      console.log("Saving to IndexedDB:", newPatient);
      await savePatientLocally(newPatient); // Save to IndexedDB first

      if (navigator.onLine) {
        console.log("Online: Syncing to Firestore");
        await addDoc(collection(db, "patients"), newPatient); // Save to Firestore if online
        alert("Patient saved and synced online.");
      } else {
        alert("Patient saved locally. Will sync when online.");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to save patient locally.");
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ marginBottom: '1rem' }}>Add Patient</h2>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <input name="name" placeholder="Patient Name" onChange={handleChange} style={inputStyle} />
        <input name="gender" placeholder="Gender" onChange={handleChange} style={inputStyle} />
        <input name="dob" type="date" placeholder="Date of Birth" onChange={handleChange} style={inputStyle} />
        <input name="diagnosis" placeholder="Diagnosis" onChange={handleChange} style={inputStyle} />
        <textarea name="notes" placeholder="Doctor's Notes" onChange={handleChange} rows={3} style={{ ...inputStyle, resize: 'none' }} />

        <button type="submit" style={buttonStyle}>Save</button>
      </form>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '2rem',
  backgroundColor: '#f8f9fa',
  minHeight: '100vh'
};

const formStyle = {
  backgroundColor: '#ffffff',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '500px',
  display: 'flex',
  flexDirection: 'column'
};

const inputStyle = {
  padding: '0.7rem',
  marginBottom: '1rem',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '1rem',
  width: '100%'
};

const buttonStyle = {
  backgroundColor: '#198754',
  color: '#fff',
  border: 'none',
  padding: '0.8rem',
  borderRadius: '5px',
  fontSize: '1rem',
  cursor: 'pointer'
};