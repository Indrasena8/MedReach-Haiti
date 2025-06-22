import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../auth/firebase';
import { saveVisitLocally } from './localDb';
import { getLocalVisits } from './localDb';
import { v4 as uuidv4 } from 'uuid'; 
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc
} from 'firebase/firestore';
import { initDB, savePatientLocally } from './localDb';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showAddVisit, setShowAddVisit] = useState(false);

  const [newVisit, setNewVisit] = useState({ date: '', reason: '', prescription: '' });

  useEffect(() => {
  const fetchData = async () => {
    try {
      const dbInstance = await initDB();
      const localData = await dbInstance
        .transaction('patients', 'readonly')
        .objectStore('patients')
        .get(id);

      if (localData) {
        setPatient(localData);
      }
      let localVisits = await getLocalVisits(id);
      setVisits(localVisits);

      if (navigator.onLine) {
        const docRef = doc(db, 'patients', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPatient(data);
          await savePatientLocally(data);
        }

        const q = query(collection(db, 'visits'), where('patientId', '==', id));
        const visitDocs = await getDocs(q);
        const visitList = visitDocs.docs.map(doc => doc.data());
        const allVisits = [...localVisits, ...visitList];
        const deduped = allVisits.reduce((acc, curr) => {
        if (!acc.some(v => v.visitId === curr.visitId)) acc.push(curr);
        return acc;
        }, []);
        setVisits(deduped);

        // Save each visit locally
        for (const v of visitList) {
          await saveVisitLocally(v);
        }



      const unsynced = localVisits.filter(v => !v.synced);
        for (const v of unsynced) {
          const q = query(collection(db, 'visits'), where('visitId', '==', v.visitId));
          const existing = await getDocs(q);
          if (existing.empty) {
            await addDoc(collection(db, 'visits'), v);
          }
          const updated = { ...v, synced: true };
          const tx = dbInstance.transaction('visits', 'readwrite');
          tx.objectStore('visits').put(updated);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Error during fetch/sync:', err);
      setLoading(false);
    }
  };

  fetchData();
}, [id]);

  const handleChange = (e) => {
    setPatient(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'patients', id);
      await savePatientLocally(patient);
      if (navigator.onLine) {
        await updateDoc(docRef, patient);
        alert('Patient updated');
      } else {
        alert('Saved locally, will sync when online.');
      }
      setEditMode(false);
    } catch (err) {
      alert('Failed to update.');
    }
  };

  const handleAddVisit = async () => {
  const payload = {
    ...newVisit,
    patientId: id,
    synced: false,
    visitId: uuidv4(),
  };

  try {

    await saveVisitLocally(payload); // 🔄 save offline
    setVisits(prev => [...prev, payload]);
    if (navigator.onLine) {
      await addDoc(collection(db, 'visits'), payload);
      payload.synced = true;
      const db = await initDB();
      const tx = db.transaction('visits', 'readwrite');
      tx.objectStore('visits').put(payload);
      //alert('Visit added');
    } else {
      alert('Saved locally. Will sync later.');
    }
  } catch (err) {
    alert('Saved locally. Will sync later');
    console.error(err);
  }
  setShowAddVisit(false);
  setNewVisit({ date: '', reason: '', prescription: '' });
};

  if (loading) return <p style={{ padding: '2rem' }}>Loading patient data...</p>;

  if (!patient) {
    return <p style={{ color: 'red', padding: '2rem' }}>❗ Patient not found</p>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto' }}>
      <h2>Patient Details</h2>
      <div style={cardStyle}>
        {editMode ? (
          <>
            <label>Name</label>
            <input name="name" value={patient.name} onChange={handleChange} style={inputStyle} />
            <label>Gender</label>
            <input name="gender" value={patient.gender} onChange={handleChange} style={inputStyle} />
            <label>Date of Birth</label>
            <input name="dob" type="date" value={patient.dob} onChange={handleChange} style={inputStyle} />
            <label>Diagnosis</label>
            <input name="diagnosis" value={patient.diagnosis} onChange={handleChange} style={inputStyle} />
            <label>Notes</label>
            <textarea name="notes" value={patient.notes} onChange={handleChange} style={{ ...inputStyle, resize: 'none' }} />
            <button onClick={handleSave} style={buttonStyle}>Save</button>
            <button onClick={() => setEditMode(false)} style={cancelStyle}>Cancel</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {patient.name || 'N/A'}</p>
            <p><strong>Gender:</strong> {patient.gender || 'N/A'}</p>
            <p><strong>DOB:</strong> {patient.dob || 'N/A'}</p>
            <p><strong>Diagnosis:</strong> {patient.diagnosis || 'N/A'}</p>
            <p><strong>Notes:</strong> {patient.notes || 'N/A'}</p>
            <button onClick={() => setEditMode(true)} style={buttonStyle}>Edit</button>
            <button onClick={() => navigate('/dashboard')} style={cancelStyle}>Back</button>
          </>
        )}
      </div>

      <hr />
      <h3>Visit History</h3>
      <button onClick={() => setShowAddVisit(!showAddVisit)} style={buttonStyle}>+ Add Visit</button>

      {showAddVisit && (
        <div style={cardStyle}>
          <h4>Add Visit</h4>
          <label>Date</label>
          <input type="date" value={newVisit.date} onChange={e => setNewVisit({ ...newVisit, date: e.target.value })} style={inputStyle} />
          <label>Diagnosis</label>
          <input value={newVisit.reason} onChange={e => setNewVisit({ ...newVisit, reason: e.target.value })} style={inputStyle} />
          <label>Notes</label>
          <textarea value={newVisit.prescription} onChange={e => setNewVisit({ ...newVisit, prescription: e.target.value })} style={inputStyle} />
          <button onClick={handleAddVisit} style={buttonStyle}>Submit</button>
          <button onClick={() => setShowAddVisit(false)} style={cancelStyle}>Cancel</button>
        </div>
      )}

      {visits.length === 0 ? (
        <p>No visits found.</p>
      ) : (
        visits.map((v, idx) => (
          <div key={idx} style={visitStyle}>
            <p><strong>Date:</strong> {v.date}</p>
            <p><strong>Diagnosis:</strong> {v.reason}</p>
            <p><strong>Notes:</strong> {v.prescription}</p>
          </div>
        ))
      )}
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '1.5rem'
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '0.5rem',
  marginBottom: '1rem',
  fontSize: '1rem',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

const buttonStyle = {
  backgroundColor: '#198754',
  color: '#fff',
  border: 'none',
  padding: '0.6rem 1.2rem',
  borderRadius: '5px',
  marginRight: '1rem',
  cursor: 'pointer'
};

const cancelStyle = {
  backgroundColor: '#6c757d',
  color: '#fff',
  border: 'none',
  padding: '0.6rem 1.2rem',
  borderRadius: '5px',
  cursor: 'pointer'
};

const visitStyle = {
  backgroundColor: '#f8f9fa',
  padding: '1rem',
  borderLeft: '4px solid #0d6efd',
  borderRadius: '5px',
  marginBottom: '1rem'
};