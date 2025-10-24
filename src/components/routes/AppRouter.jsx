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
import UnauthorizedView from '../views/UnauthorizedView.jsx.jsx';
// --- Componentes de Lógica de Rutas ---
import ProtectedRoute from './ProtectedRoute';

import { UnarchiveOutlined } from '@mui/icons-material';
import LoadingScreen from '../auth/LoadingScreen.jsx';
import WorkInProgressView from '../views/UnauthorizedView.jsx.jsx';
import UserProfile from '../views/Perfil.jsx';
import NuevoEmpleado from '../views/NuevoEmpleado.jsx';
import RecepcionistaLayout from '../recepcionista/RecepcionistaLayout.jsx';
import GestionCitasRecepcionista from '../views/Horarios';
import AgendarCitaInvitado from '../views/AñadirCitaRecepcionista.jsx';


/**
 * Este componente se encarga de redirigir al usuario a su panel
 * correspondiente una vez que ha iniciado sesión.
 */
function RedirectBasedOnRole() {
  const { userData, loading } = useAuth();

  if (loading || !userData) {
    return <LoadingScreen />;
  }
  
  if (userData.rol === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // --- MODIFICACIÓN AQUÍ ---
  // Añadimos la redirección para el rol 'recepcionista'
  if (userData.rol === 'recepcionista') {
    return <Navigate to="/recepcion/dashboard" replace />;
  }
  // --- FIN DE MODIFICACIÓN ---

  // Los roles 'cliente' y 'vet' irán a /dashboard
  return <Navigate to="/dashboard" replace />;
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
     {/* --- NUEVO BLOQUE DE RUTAS PARA RECEPCIONISTA --- */}
      <Route 
        path="/recepcion/*" 
        element={
          <ProtectedRoute roles={['recepcionista']}>
            <RecepcionistaLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="Disponibilidad" element={<GestionCitasRecepcionista />} />
        <Route path="perfil" element={<UserProfile />} />
        <Route path="invitado" element={<AgendarCitaInvitado />} />
      </Route>
      {/* --- FIN DEL NUEVO BLOQUE --- */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute roles={['cliente', 'vet']}>
            <WorkInProgressView/>
          </ProtectedRoute>
        }
      />
      
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