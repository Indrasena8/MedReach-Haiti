import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import AddPatient from './pages/AddPatient';
import PatientDetails from './pages/PatientDetails';
import UpdateProfile from './pages/UpdateProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-patient" element={<AddPatient />} />
          <Route path="update-profile" element={<UpdateProfile />} />
          <Route path="/patient/:id" element={<PatientDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;