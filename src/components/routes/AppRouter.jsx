import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

// --- Vistas y Layouts ---
import AdminLayout from '../admin/layout/adminlayout';
import Dashboard from '../views/Dashboard';
import Veterinarios from '../views/Veterinarios';
import Horarios from '../views/Horarios';
import Login from '../auth/login';
import SignUp from '../auth/SignUp';
import UnauthorizedView from '../views/UnauthorizedView.jsx';
// --- Componentes de Lógica de Rutas ---
import ProtectedRoute from './ProtectedRoute';

import { UnarchiveOutlined } from '@mui/icons-material';
import LoadingScreen from '../auth/LoadingScreen.jsx';
import WorkInProgressView from '../views/UnauthorizedView.jsx';
import UserProfile from '../views/Perfil.jsx';
import NuevoEmpleado from '../views/NuevoEmpleado.jsx';
// --- Staff ---
import StaffLayout from '../staff/layout/StaffLayout';
import StaffDashboard from '../staff/views/StaffDashboard';
import StaffProfile from '../staff/views/StaffProfile';


/**
 * Este componente se encarga de redirigir al usuario a su panel
 * correspondiente una vez que ha iniciado sesión.
 */
function RedirectBasedOnRole() {
  const {   userData, loading } = useAuth();

  if (loading || !userData) {
    return <LoadingScreen />;
  }
  if (userData.rol === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  // Personal (veterinarios y recepcionistas) van al panel staff
  if (userData.rol === 'vet' || userData.rol === 'recepcionista') {
    return <Navigate to="/staff/dashboard" replace />;
  }
  // Clientes u otros roles van al dashboard de cliente
  return <Navigate to="/dashboard" replace />;
}
function AdminProfilePage() {
  const { userData, loading } = useAuth(); // Obtenemos datos del contexto

  if (loading) {
    return <LoadingScreen />; // Muestra una pantalla de carga mientras se obtienen los datos
  }

  // Una vez que tenemos los datos, renderizamos el perfil
  return <UserProfile user={userData} />;
}


function AppRouter() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/auth/login" element={currentUser ? <RedirectBasedOnRole /> : <Login />} />
      <Route path="/auth/signup" element={currentUser ? <RedirectBasedOnRole /> : <SignUp />} />

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
        <Route path="veterinarios/nuevo" element={<NuevoEmpleado />} />
        <Route path="horarios" element={<Horarios />} />
        <Route path="perfil" element={<UserProfile />} />
      </Route>

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute roles={['cliente']}>
            {/* Dashboard visible solo para clientes */}
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Rutas para personal (veterinarios y recepcionistas) */}
      <Route
        path="/staff/*"
        element={
          <ProtectedRoute roles={['vet', 'recepcionista']}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="profile" element={<StaffProfile />} />
      </Route>
      
      <Route path="/unauthorized" element={<WorkInProgressView />} /> {/* <-- 2. USA TU COMPONENTE AQUÍ */}

      <Route 
        path="/" 
        element={currentUser ? <RedirectBasedOnRole /> : <Navigate to="/auth/login" replace />} 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;