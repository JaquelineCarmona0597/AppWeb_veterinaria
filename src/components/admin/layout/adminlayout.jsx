import React, { useState } from 'react';
import { Box, Paper } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

import '../../../css/adminCss/adminlayout.css';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box className="dashboard-layout">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      
      <Box component="main" className="main-content">
        {/* Este es el Header que queremos dejar fijo */}
        <Header 
          className="hadercomponent" // Usaremos esta clase
          isSidebarOpen={isSidebarOpen} 
          handleToggleSidebar={handleToggleSidebar} 
        />

        <Box className="page-content">
          <Paper component="header" elevation={0} className="content-card">
            <Outlet />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;