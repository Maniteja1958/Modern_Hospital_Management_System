import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: Array<'Admin' | 'Doctor' | 'Patient'>;
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, redirect to their specific dashboard or a generic unauth page
    if (user.role === 'Admin') return <Navigate to="/dashboard/admin" replace />;
    if (user.role === 'Doctor') return <Navigate to="/dashboard/doctor" replace />;
    if (user.role === 'Patient') return <Navigate to="/dashboard/patient" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
