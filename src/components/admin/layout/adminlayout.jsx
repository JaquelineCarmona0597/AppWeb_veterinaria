// src/admin/layout/adminlayout.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material'; // Usaremos Box para un layout simple

// Componentes
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const AdminLayout = () => {
  // ✅ Estado local para controlar el sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // ✅ Función para pasarla al Header
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    // Usamos Box de MUI para un layout flexible y simple
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Le pasamos el estado y la función a los componentes hijos */}
      <Header isSidebarOpen={isSidebarOpen} handleToggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px' }}>
        {/* El Outlet renderizará la página actual (Dashboard, etc.) */}
        <Outlet />
        <Footer />
      </Box>
    </Box>
  );
};

export default AdminLayout;