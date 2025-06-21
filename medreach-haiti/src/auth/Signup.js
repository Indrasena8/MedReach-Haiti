import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { useNavigate, Link } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';

export default function Signup() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    qualification: '',
    experience: '',
    specialization: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, qualification, experience, specialization } = form;

    if (!email || !password || !firstName || !lastName || !qualification || !experience || !specialization) {
      setError('All fields are required.');
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, 'doctors', uid), {
        firstName,
        lastName,
        email,
        qualification,
        experience,
        specialization
      });

      navigate('/'); // redirect to login after signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="auth-form">
      <h2>Doctor Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
      <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
      <input type="text" name="qualification" placeholder="Qualification" value={form.qualification} onChange={handleChange} />
      <input type="text" name="experience" placeholder="Years of Experience" value={form.experience} onChange={handleChange} />
      <input type="text" name="specialization" placeholder="Specialization" value={form.specialization} onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
      <button type="submit">Register</button>
      <p style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </form>
  );
}