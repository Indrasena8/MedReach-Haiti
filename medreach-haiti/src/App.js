import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import AddPatient from './pages/AddPatient';
import PatientDetails from './pages/PatientDetails';
import UpdateProfile from './pages/UpdateProfile';
import Login from './auth/Login';
import Signup from './auth/Signup';
import { auth } from './auth/firebase';
// index.js or App.js
import './App.css'; // or './App.css'

function App() {
  const isAuthenticated = !!auth.currentUser;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />


        {/* Protected routes */}
        <Route path="/" element={<Layout />}>
          {/* Redirect '/' to login or dashboard */}
          <Route index element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-patient" element={<AddPatient />} />
          <Route path="update-profile" element={<UpdateProfile />} />
          <Route path="patient/:id" element={<PatientDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;