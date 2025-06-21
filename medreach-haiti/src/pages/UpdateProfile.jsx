import React, { useEffect, useState } from 'react';
import { auth, db } from '../auth/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function UpdateProfile() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    phone: '',
    address: '',
    experience: '',
    dob: '',
  });

  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const fetchDoctor = async () => {
      try {
        const docRef = doc(db, 'doctors', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          console.warn("Doctor profile not found.");
        }
      } catch (err) {
        console.error("Failed to fetch doctor profile:", err);
      }
    };

    fetchDoctor();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, 'doctors', user.uid);
      await updateDoc(docRef, formData);

      if (newPassword && newPassword.length >= 6) {
        try {
          await updatePassword(user, newPassword);
          alert('Password updated successfully!');
        } catch (err) {
          if (err.code === 'auth/requires-recent-login') {
            alert('Please logout and login again before changing your password.');
          } else {
            console.error("Password update failed:", err);
            alert('Password update failed: ' + err.message);
          }
        }
      }

      alert('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Something went wrong: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input name="firstName" value={formData.firstName} onChange={handleChange} required style={inputStyle} />

        <label>Last Name:</label>
        <input name="lastName" value={formData.lastName} onChange={handleChange} required style={inputStyle} />

        <label>Specialization:</label>
        <input name="specialization" value={formData.specialization} onChange={handleChange} style={inputStyle} />

        <label>Experience (in years):</label>
        <input name="experience" value={formData.experience} onChange={handleChange} type="number" style={inputStyle} />

        <label>Date of Birth:</label>
        <input name="dob" value={formData.dob} onChange={handleChange} type="date" style={inputStyle} />

        <label>Phone:</label>
        <input name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />

        <label>Address:</label>
        <textarea name="address" value={formData.address} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: 'none' }} />

        <label>New Password (min 6 chars):</label>
        <input type="password" value={newPassword} onChange={handlePasswordChange} style={inputStyle} />

        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '1rem' }}>
          <button type="submit" style={buttonStyle}>Save Changes</button>
          <Link to="/dashboard" style={{ ...buttonStyle, backgroundColor: '#6c757d' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  margin: '0.5rem 0 1rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '1rem'
};

const buttonStyle = {
  backgroundColor: '#0d6efd',
  color: '#fff',
  border: 'none',
  padding: '0.7rem 1.5rem',
  fontSize: '1rem',
  borderRadius: '5px',
  cursor: 'pointer'
};