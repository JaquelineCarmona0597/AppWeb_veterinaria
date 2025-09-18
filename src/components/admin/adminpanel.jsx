// src/components/admin/adminpanel.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './siderbar.jsx';
import logo from '../../assets/react.svg';

// --- SOLUCIÓN AQUÍ ---
// 1. Definimos la lista de rutas directamente en este archivo.
//    Esta es la información que el Sidebar necesita para mostrar los enlaces.
const adminRoutes = [
  {
    path: "/admin/dashboard",
    name: "Dashboard",
    icon: "fa-solid fa-chart-pie", // Ejemplo de ícono (puedes cambiarlo)
  },
  {
    path: "/admin/veterinarios",
    name: "Veterinarios",
    icon: "fa-solid fa-user-doctor",
  },
  {
    path: "/admin/horarios",
    name: "Horarios",
    icon: "fa-solid fa-calendar-days",
  }
];

const mainContentStyle = {
  marginLeft: '250px',
  padding: '2rem'
};

const AdminPanel = () => {
  return (
    <>
      {/* 2. Le pasamos la lista que acabamos de crear al Sidebar */}
      <Sidebar
        routes={adminRoutes}
        logo={{
          innerLink: "/admin/dashboard",
          imgSrc: logo,
          imgAlt: "Logo",
        }}
      />
      <div style={mainContentStyle} className="main-content">
        <Outlet />
      </div>
    </>
  );
};

export default AdminPanel;