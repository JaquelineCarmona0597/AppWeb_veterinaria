import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// ✅ Añadimos Typography para el título
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { Home as DashboardIcon, CalendarMonth as HorariosIcon, MedicalServices as VeterinariosIcon } from '@mui/icons-material';

// ✅ Importamos nuestro nuevo archivo de estilos
import '../../../css/adminCss/Sidebar.css';

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
      className='sidebar'
      variant="persistent"
      anchor="left"
      open={isSidebarOpen}
      sx={{
        width: isSidebarOpen ? drawerWidth : 0, // El ancho es 0 si está cerrado
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
        // Transición suave para abrir y cerrar
        transition: (theme) => theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      {/* ✅ MEJORA: Añadimos un título en el Toolbar */}
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
          🐾 Patita Feliz
        </Typography>
      </Toolbar>
      
      <List className='lista-sidebar'>
        {structure.map((item) => (
          <ListItem 
            className='item-sidebar'
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