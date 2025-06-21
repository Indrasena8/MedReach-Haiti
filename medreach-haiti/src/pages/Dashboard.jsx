import React, { useEffect, useState } from 'react';
import { auth, db } from '../auth/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { initDB, savePatientLocally } from './localDb';


export default function Dashboard() {
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const fetchData = async () => {
      const dbInstance = await initDB();

      const docRef = doc(db, "doctors", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setDoctor(docSnap.data());

      const tx = dbInstance.transaction('patients', 'readonly');
      const store = tx.objectStore('patients');
      const localPatients = await store.getAll();
      setPatients(Array.isArray(localPatients) ? localPatients : []);

      if (navigator.onLine) {
        const q = query(collection(db, "patients"), where("doctorId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const freshPatients = [];

        for (const docSnap of querySnapshot.docs) {
          const patient = docSnap.data();
          freshPatients.push(patient);
          await savePatientLocally(patient);
        }

        setPatients(freshPatients);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!doctor) return <p>Loading...</p>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ flexGrow: 1, backgroundColor: '#f8f9fa' }}>
        {/* Top Nav */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          backgroundColor: '#fff',
          borderBottom: '1px solid #ccc'
        }}>
          <div>
            <h2>Welcome, Dr. {doctor.firstName} {doctor.lastName}</h2>
            <p style={{ margin: 0 }}>Phone: {doctor.phone || 'N/A'}, Address: {doctor.address || 'N/A'}</p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          <h4>Specialization: {doctor.specialization}</h4>

          <hr />
          <h3>Patient Visit History</h3>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by patient name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.5rem',
              marginBottom: '1rem',
              width: '100%',
              maxWidth: '400px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          />

          {/* Patient List */}
          {filteredPatients.length === 0 ? (
            <p>No matching patients found.</p>
          ) : (
            filteredPatients.map((p, i) => (
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

const navLinkStyle = {
  textDecoration: 'none',
  color: 'white',
  fontSize: '1rem',
  background: 'rgba(255,255,255,0.1)',
  padding: '0.5rem 1rem',
  borderRadius: '5px'
};