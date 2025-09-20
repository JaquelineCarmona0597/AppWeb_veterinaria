// src/router/AppRouter.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../auth/login.jsx';
import SignUp from '../auth/SignUp.jsx';
import AdminPanel from '../admin/adminpanel.jsx';
import Dashboard from '../views/Dashboard.jsx';
import Veterinarios from '../views/Veterinarios.jsx';
import Horarios from '../views/Horarios.jsx';

const AppRouter = () => {
  return (
    <Routes>
      {/* Ruta para el panel de administración con sub-rutas anidadas */}
      <Route path="/admin" element={<AdminPanel />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="veterinarios" element={<Veterinarios />} />
        <Route path="horarios" element={<Horarios />} />
        {/* Redirección por defecto dentro del panel de admin */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Rutas para la autenticación */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<SignUp />} />

      {/* Redirección desde la raíz de la web hacia la página de login */}
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AppRouter;