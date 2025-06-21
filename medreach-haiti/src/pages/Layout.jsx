import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { auth } from '../auth/firebase';

const navLinkStyle = {
  textDecoration: 'none',
  color: 'white',
  fontSize: '1rem',
  background: 'rgba(255,255,255,0.1)',
  padding: '0.5rem 1rem',
  borderRadius: '5px'
};

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: '220px',
        background: '#0d6efd',
        color: '#fff',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h2 style={{ marginBottom: '2rem' }}>MedReach</h2>
        <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
        <Link to="/add-patient" style={navLinkStyle}>Add Patient</Link>
        <Link to="/update-profile" style={navLinkStyle}>Update Profile</Link>
      </div>

      {/* Main Content */}
      <div style={{ flexGrow: 1, backgroundColor: '#f8f9fa' }}>
        {/* Top Navbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '1rem 2rem',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #ccc',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <button onClick={handleLogout} style={{
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🔒 Logout
          </button>
        </div>

        {/* Routed page */}
        <div style={{ padding: '2rem' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}