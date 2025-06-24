import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const basePath = import.meta.env.VITE_APP_BASE_NAME || '';

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return isAuthenticated ? <Outlet /> : <Navigate to={`${basePath}/authentication/login`} replace />;
};

export default ProtectedRoute;
