import React, { useEffect, useState } from 'react';
import { auth, db } from '../auth/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { initDB, savePatientLocally } from './localDb'
import { Link } from 'react-router-dom';;

export default function Dashboard() {
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const user = auth.currentUser;
  if (!user) return;

  const fetchData = async () => {
    const dbInstance = await initDB();

    // Fetch doctor info from Firestore (online-only)
    const docRef = doc(db, "doctors", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) setDoctor(docSnap.data());

    // Fetch from local IndexedDB first
    const tx = dbInstance.transaction('patients', 'readonly');
    const store = tx.objectStore('patients');
    const localPatients = await store.getAll();
    setPatients(localPatients);

    // If online, sync Firestore data → IndexedDB → update UI
    if (navigator.onLine) {
      const q = query(collection(db, "patients"), where("doctorId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const freshPatients = [];

      for (const docSnap of querySnapshot.docs) {
        const patient = docSnap.data();
        freshPatients.push(patient);
        await savePatientLocally(patient); // update IndexedDB
      }

      setPatients(freshPatients); // overwrite UI state
    }
  };

  fetchData();
}, []);

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  if (!doctor) return <p>Loading...</p>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '200px', background: '#f0f0f0', padding: '1rem' }}>
        <h3>MedReach</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a href="/dashboard">Dashboard</a>
          <Link to="/add-patient">Add Patient</Link>
          <a href="#">Profile Settings</a>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flexGrow: 1 }}>
        {/* Top Nav */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid #ccc',
          backgroundColor: '#fff'
        }}>
          <h2>Welcome, Dr. {doctor.firstName} {doctor.lastName}</h2>
          <button onClick={handleLogout} style={{
            padding: '0.5rem 1rem',
            background: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Logout
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          <h4>Specialization: {doctor.specialization}</h4>
          <hr />
          <h3>Patient Visit History</h3>
          {patients.length === 0 ? (
            <p>No patients yet.</p>
          ) : (
            patients.map((p, i) => (
              <div key={i} className="patient-card" style={{
                backgroundColor: '#fff',
                padding: '1rem',
                marginBottom: '1rem',
                borderLeft: '5px solid #198754',
                borderRadius: '5px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <strong>{p.name}</strong> ({p.gender})<br />
                DOB: {p.dob} <br />
                Diagnosis: {p.diagnosis}<br />
                Notes: {p.notes}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}