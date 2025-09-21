// src/router/AppRouter.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../auth/login.jsx';
import SignUp from '../auth/SignUp.jsx';
import Dashboard from '../views/Dashboard.jsx';
import Veterinarios from '../views/Veterinarios.jsx';
import Horarios from '../views/Horarios.jsx';
import AdminLayout from '../admin/layout/adminlayout.jsx';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
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