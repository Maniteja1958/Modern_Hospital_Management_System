import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route 
        path="/dashboard/admin" 
        element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} 
      />
      
      <Route 
        path="/dashboard/doctor" 
        element={<ProtectedRoute allowedRoles={['Doctor']}><DoctorDashboard /></ProtectedRoute>} 
      />
      
      <Route 
        path="/dashboard/patient" 
        element={<ProtectedRoute allowedRoles={['Patient']}><PatientDashboard /></ProtectedRoute>} 
      />
    </Routes>
  );
}

export default App;
