// src/components/routes/AppRouter.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// --- Tus Componentes ---
import AdminLayout from '../admin/layout/adminlayout.jsx';
import Dashboard from '../views/Dashboard.jsx';
import Veterinarios from '../views/Veterinarios.jsx';
import NuevoVeterinario from '../views/NuevoVeterinario.jsx';
import Horarios from '../views/Horarios.jsx';
import Login from '../auth/login.jsx';
import SignUp from '../auth/SignUp.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

import UnauthorizedView from '../views/UnauthorizedView.jsx'; // <-- Asegúrate de importar esta vista

// Componente que redirige al usuario al iniciar sesión
function RedirectBasedOnRole() {
  const { userData } = useAuth();

  // ✅ LÓGICA DE REDIRECCIÓN CORRECTA
  if (userData?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // Tanto 'vet' como 'client' son enviados a /dashboard
  return <Navigate to="/dashboard" replace />;
}

function AppRouter() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Cargando sesión...</div>;
  }

  return (
    <Routes>
      <Route path="/auth/login" element={currentUser ? <RedirectBasedOnRole /> : <Login />} />
      <Route path="/auth/signup" element={currentUser ? <RedirectBasedOnRole /> : <SignUp />} />

      {/* --- RUTA PROTEGIDA EXCLUSIVA PARA ADMIN --- */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="veterinarios" element={<Veterinarios />} />
        <Route path="veterinarios/nuevo" element={<NuevoVeterinario />} />
        <Route path="horarios" element={<Horarios />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* --- RUTA "PRÓXIMAMENTE" PARA CLIENTES Y VETERINARIOS --- */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute roles={['client', 'vet']}>
            <UnauthorizedView />
          </ProtectedRoute>
        }
      />
      
      {/* --- RUTA DE ACCESO DENEGADO --- */}
      <Route path="/unauthorized" element={<UnauthorizedView />} />

      {/* --- REDIRECCIÓN GLOBAL --- */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/" element={currentUser ? <RedirectBasedOnRole /> : <Navigate to="/auth/login" replace />} />
    </Routes>
  );
}

export default AppRouter;