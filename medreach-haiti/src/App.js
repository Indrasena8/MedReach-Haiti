// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './auth/Signup';
import Login from './auth/Login';
import Dashboard from './pages/Dashboard';
import AddPatient from './pages/AddPatient';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-patient" element={<AddPatient />} />
      </Routes>
    </Router>
  );
}

export default App;