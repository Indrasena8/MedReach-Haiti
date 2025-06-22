import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { initDB } from './localDb';
import { db } from '../auth/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function PatientDetail() {
  const { id } = useParams(); // /patients/:id
  const [patient, setPatient] = useState(null);
  const [newDiag, setNewDiag] = useState('');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    const loadPatient = async () => {
      const dbInstance = await initDB();
      const tx = dbInstance.transaction("patients", "readonly");
      const store = tx.objectStore("patients");
      const result = await store.get(id);
      setPatient(result);
    };

    loadPatient();
  }, [id]);

  const addVisit = async () => {
    if (!newDiag || !newNotes) return alert("Please enter diagnosis and notes");

    const newVisit = {
      date: new Date().toISOString().split('T')[0],
      diagnosis: newDiag,
      notes: newNotes
    };

    const updated = {
      ...patient,
      visits: [...(patient.visits || []), newVisit]
    };

    // Save locally
    const dbInstance = await initDB();
    const tx = dbInstance.transaction("patients", "readwrite");
    const store = tx.objectStore("patients");
    await store.put(updated);
    setPatient(updated);

    // Sync to Firestore if online
    if (navigator.onLine) {
      const ref = doc(db, "patients", id);
      try {
        await updateDoc(ref, { visits: updated.visits });
        alert("Visit added & synced.");
      } catch {
        alert("Saved locally. Will sync later.");
      }
    } else {
      alert("Visit saved locally. Will sync when online.");
    }

    setNewDiag('');
    setNewNotes('');
  };

  if (!patient) return <p>Loading patient...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{patient.name} ({patient.gender})</h2>
      <p><strong>DOB:</strong> {patient.dob}</p>

      <hr />
      <h3>Visit History</h3>
      {patient.visits && patient.visits.length > 0 ? (
        patient.visits.map((v, i) => (
          <div key={i} style={{ marginBottom: '1rem' }}>
            <strong>{v.date}</strong><br />
            Diagnosis: {v.diagnosis}<br />
            Notes: {v.notes}
            <hr />
          </div>
        ))
      ) : (
        <p>No previous visits.</p>
      )}

      <h3>Add New Visit</h3>
      <input
        value={newDiag}
        onChange={(e) => setNewDiag(e.target.value)}
        placeholder="Diagnosis"
        style={{ display: 'block', marginBottom: '0.5rem' }}
      />
      <textarea
        value={newNotes}
        onChange={(e) => setNewNotes(e.target.value)}
        placeholder="Doctor's Notes"
        style={{ display: 'block', width: '100%', height: '80px', marginBottom: '0.5rem' }}
      />
      <button onClick={addVisit}>Add Visit</button>
    </div>
  );
}
