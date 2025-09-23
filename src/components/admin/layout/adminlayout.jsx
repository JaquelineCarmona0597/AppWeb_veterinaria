import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, CssBaseline } from '@mui/material';

import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Breadcrumb from '..//components/Breadcrumb'; // ✅ 1. Importa el nuevo componente
import Header from '../components/Header';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const drawerWidth = 240;

  const toggleSidebar = () => {

    setSidebarOpen(!isSidebarOpen);

  };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header isSidebarOpen={isSidebarOpen} handleToggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: `-${drawerWidth}px`,
          ...(isSidebarOpen && {
            transition: (theme) => theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
          }),
        }}
      >
        <Toolbar />
        
        {/* ✅ 2. Añade el componente Breadcrumb aquí */}
        <Breadcrumb />

        <Outlet />
        <Footer />
      </Box>
    </Box>
  );
};

export default AdminLayout;