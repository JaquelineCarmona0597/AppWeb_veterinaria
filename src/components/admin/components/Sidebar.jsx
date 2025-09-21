// src/components/Sidebar/Sidebar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { Home as DashboardIcon, CalendarMonth as HorariosIcon, MedicalServices as VeterinariosIcon } from '@mui/icons-material';

// ✅ El componente recibe 'isSidebarOpen' para saber si debe mostrarse
const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();
  const drawerWidth = 240;

  const structure = [
    { id: 0, label: 'Dashboard', link: '/admin/dashboard', icon: <DashboardIcon /> },
    { id: 1, label: 'Horarios', link: '/admin/horarios', icon: <HorariosIcon /> },
    { id: 2, label: 'Veterinarios', link: '/admin/veterinarios', icon: <VeterinariosIcon /> },
  ];

  return (
    <Drawer
      variant="persistent" // 'persistent' funciona bien con este enfoque
      anchor="left"
      open={isSidebarOpen} // ✅ Su visibilidad depende de esta prop
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar /> {/* Un espacio para que no quede debajo del Header */}
      <List>
        {structure.map((item) => (
          <ListItem 
            button 
            key={item.label} 
            component={Link} 
            to={item.link}
            selected={location.pathname === item.link}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;