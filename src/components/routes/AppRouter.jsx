import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.js';

// --- Vistas y Layouts ---
import AdminLayout from '../admin/layout/adminlayout';
import Dashboard from '../views/Dashboard';
import Veterinarios from '../views/Veterinarios';
import NuevoVeterinario from '../views/NuevoVeterinario';
import Horarios from '../views/Horarios';
import Login from '../auth/login';
import SignUp from '../auth/SignUp';


// --- Componentes de Lógica de Rutas ---
import ProtectedRoute from './ProtectedRoute';

import { UnarchiveOutlined } from '@mui/icons-material';
import LoadingScreen from '../auth/LoadingScreen.jsx';

/**
 * Este componente se encarga de redirigir al usuario a su panel
 * correspondiente una vez que ha iniciado sesión.
 */
function RedirectBasedOnRole() {
  const { userData, loading } = useAuth();

  // Es crucial esperar a que termine la carga Y a que tengamos los datos del usuario.
  // Esto previene errores si 'userData' es nulo por un instante.
  if (loading || !userData) {
    return <LoadingScreen />;
  }

  // Una vez que tenemos los datos, redirigimos según el rol.
  if (userData.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // Cualquier otro rol (vet, client) va al dashboard general.
  return <Navigate to="/dashboard" replace />;
}

/**
 * AppRouter es el componente principal que define toda la navegación de la aplicación.
 */
function AppRouter() {
  const { currentUser } = useAuth();

  // NOTA: No es necesario un 'if (loading)' aquí, porque el AuthProvider
  // ya muestra el LoadingScreen y no renderizará este componente hasta que la carga termine.

  return (
    <Routes>
      {/* ================================================================== */}
      {/* RUTAS DE AUTENTICACIÓN                       */}
      {/* ================================================================== */}
      {/* Si el usuario ya está logueado, lo redirige. Si no, muestra el formulario. */}
      <Route path="/auth/login" element={currentUser ? <RedirectBasedOnRole /> : <Login />} />
      <Route path="/auth/signup" element={currentUser ? <RedirectBasedOnRole /> : <SignUp />} />

      {/* ================================================================== */}
      {/* RUTAS PROTEGIDAS PARA ADMIN                     */}
      {/* ================================================================== */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="veterinarios" element={<Veterinarios />} />
        <Route path="veterinarios/nuevo" element={<NuevoVeterinario />} />
        <Route path="horarios" element={<Horarios />} />
      </Route>

      {/* ================================================================== */}
      {/* RUTAS PROTEGIDAS PARA CLIENTES Y VETS                 */}
      {/* ================================================================== */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute roles={['client', 'vet']}>
            {/* Aquí iría el Dashboard para Clientes/Vets cuando lo desarrolles */}
            < UnarchiveOutlined message="Dashboard para clientes y veterinarios próximamente." />
          </ProtectedRoute>
        }
      />
      
      {/* ================================================================== */}
      {/* RUTAS DE UTILIDAD Y FALLBACKS                     */}
      {/* ================================================================== */}
      <Route path="/unauthorized" element={<UnarchiveOutlined />} />

      {/* --- Redirección Principal --- */}
      {/* Si se accede a la raíz, decide a dónde enviar al usuario. */}
      <Route 
        path="/" 
        element={currentUser ? <RedirectBasedOnRole /> : <Navigate to="/auth/login" replace />} 
      />
      
      {/* Si se accede a cualquier otra ruta no definida, se redirige a la raíz. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;