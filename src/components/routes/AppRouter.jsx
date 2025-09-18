// src/router/AppRouter.jsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../auth/login.jsx';
import SignUp from '../auth/SignUp.jsx';
import AdminPanel from '../admin/adminpanel.jsx';
import Dashboard from '../views/Dashboard.jsx';
import Veterinarios from '../views/Veterinarios.jsx';
import Horarios from '../views/Horarios.jsx';

const AppRouter = () => {
  return (

      <Routes>

        <Route path="/admin" element={<AdminPanel />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="veterinarios" element={<Veterinarios />} />
          <Route path="horarios" element={<Horarios />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>


        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<SignUp />} />

        <Route path="/" element={<Navigate to="/auth/login" replace />} />
      </Routes>

  );
};

export default AppRouter;