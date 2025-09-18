// src/components/admin/adminpanel.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './siderbar.jsx'; // Tu nuevo sidebar
import adminRoutes from '../routes/adminRoutes.js'; // Las rutas que creamos
import logo from '../../assets/react.svg'; // Usaremos el logo de React como ejemplo

const AdminPanel = () => {

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          // Por ahora, solo renderizamos un texto simple para cada ruta
          <Route path={prop.path} element={<h2>{prop.name}</h2>} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <Sidebar
        routes={adminRoutes}
        logo={{
          innerLink: "/admin/dashboard",
          imgSrc: logo,
          imgAlt: "Logo",
        }}
      />
      <div className="main-content">
        <Routes>
          {getRoutes(adminRoutes)}
          {/* Puedes añadir una ruta por defecto */}
          <Route path="*" element={<h2>Dashboard Principal</h2>} />
        </Routes>
      </div>
    </>
  );
};

export default AdminPanel;