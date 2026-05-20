import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  loading: boolean;
  children: React.ReactNode;
}

export const ProtectedRoute = ({ isAuthenticated, loading, children }: ProtectedRouteProps) => {
  if (loading) {
    return <div>Chargement...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

interface AdminRouteProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  children: React.ReactNode;
}

export const AdminRoute = ({ isAuthenticated, isAdmin, loading, children }: AdminRouteProps) => {
  if (loading) {
    return <div>Chargement...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />; // Ou une page d'erreur 403
  }
  return children;
};
