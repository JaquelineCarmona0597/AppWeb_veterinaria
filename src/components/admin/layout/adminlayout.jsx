import React, { useState } from 'react'; // <-- 1. AÑADE useState
import { Box, Paper } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import '../../../css/adminCss/adminlayout.css';

// ¡YA NO RECIBE PROPS!
const AdminLayout = () => {
  
  // ✅ 2. LA LÓGICA AHORA VIVE AQUÍ DENTRO
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box className="dashboard-layout">
      {/* 3. Pasa el estado y la función a sus hijos directos */}
      <Sidebar isSidebarOpen={isSidebarOpen} />
      
      <Box component="main" className="main-content">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          handleToggleSidebar={handleToggleSidebar} 
        />
        <Breadcrumb />
        <Box className="page-content">
          <Paper elevation={0} className="content-card">
            <Outlet />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;