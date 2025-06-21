// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '../auth/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export default function Dashboard() {
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const fetchData = async () => {
      const docRef = doc(db, "doctors", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setDoctor(docSnap.data());

      const q = query(collection(db, "patients"), where("doctorId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const allPatients = [];
      querySnapshot.forEach((doc) => allPatients.push(doc.data()));
      setPatients(allPatients);
    };

    fetchData();
  }, []);

  if (!doctor) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome to MedReach, Dr. {doctor.firstName} {doctor.lastName}</h2>
      <h4>Specialization: {doctor.specialization}</h4>
      <hr />
      <h3>Patient Visit History</h3>
      {patients.length === 0 ? (
        <p>No patients yet.</p>
      ) : (
        patients.map((p, i) => (
          <div key={i} className="patient-card">
            <strong>{p.name}</strong> ({p.gender})<br />
            DOB: {p.dob} <br />
            Diagnosis: {p.diagnosis}<br />
            Notes: {p.notes}
          </div>
        ))
      )}
    </div>
  );
}