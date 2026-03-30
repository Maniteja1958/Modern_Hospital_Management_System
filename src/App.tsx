import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Workflow from './pages/Workflow';
import DashboardLayout from './layouts/DashboardLayout';
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
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/doctor" 
        element={
          <ProtectedRoute allowedRoles={['Doctor']}>
            <DashboardLayout>
              <DoctorDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/patient" 
        element={
          <ProtectedRoute allowedRoles={['Patient']}>
            <DashboardLayout>
              <PatientDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/workflow" 
        element={
          <ProtectedRoute allowedRoles={['Patient', 'Doctor', 'Admin']}>
            <DashboardLayout>
              <Workflow />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
