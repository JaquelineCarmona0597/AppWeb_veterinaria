// src/components/routes/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Ajusta la ruta si es necesario

const ProtectedRoute = ({ children, roles }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return null; // O un spinner
  }

  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  // ✅ LÓGICA SIMPLIFICADA
  // Si la ruta requiere roles y el rol del usuario no está en la lista...
  if (roles && !roles.includes(userData?.role)) {
    // ...lo enviamos directamente a la página de "Acceso Denegado".
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;