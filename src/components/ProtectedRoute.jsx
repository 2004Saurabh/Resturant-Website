import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { role } = useAuth();

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If not matching role, redirect to appropriate role home
    if (role === 'RESTAURANT_OWNER') return <Navigate to="/dashboard/owner" replace />;
    if (role === 'ADMIN') return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/dashboard/user" replace />;
  }

  return children;
}
