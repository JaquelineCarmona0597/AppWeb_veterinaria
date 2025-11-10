import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../auth/LoadingScreen';

/**
 * Un componente que protege una ruta. Solo permite el acceso si el usuario
 * ha iniciado sesión y su rol coincide con los roles permitidos.
 */
const ProtectedRoute = ({ children, roles }) => {
  const { currentUser, userData, loading } = useAuth();

  // Si la sesión inicial todavía se está verificando, mostramos la pantalla de carga.
  if (loading) {
    return <LoadingScreen />;
  }

  // Si terminó de cargar y no hay usuario, lo enviamos al login.
  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  // Si hay usuario pero aún no tenemos sus datos (rol), también esperamos.
  // Esto es clave para evitar el "parpadeo" de la página de acceso denegado.
  if (!userData) {
    return <LoadingScreen />;
  }

  // Si la ruta requiere roles específicos y el rol del usuario no está incluido,
  // lo enviamos a la página de "Acceso Denegado".
  if (roles && !roles.includes(userData.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si todas las comprobaciones pasan, renderizamos el componente hijo (la página).
  return children;
};

export default ProtectedRoute;