import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItemIcon, ListItemText, Toolbar, Typography, Box, Avatar, ListItemButton } from '@mui/material';
import { 
    Home as DashboardIcon, 
    Event as CitasIcon, // Icono para Citas/Agenda
    Pets as PacientesIcon, // Icono para Pacientes
    AccountCircle as ProfileIcon 
} from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext'; 
import logoPatitaFeliz from '../../assets/logoN.png';
import '../../css/adminCss/Sidebar.css';

const SidebarRecep = ({ isSidebarOpen }) => {
  const location = useLocation();
  // La única lógica que necesita es obtener los datos del usuario para mostrarlos.
  const { userData, currentUser } = useAuth();
  const drawerWidth = 240;
  

const structure = [
    { id: 0, label: 'Dashboard', link: '/recepcion/dashboard', icon: <DashboardIcon /> },
    { id: 1, label: 'Disponibilidad', link: '/recepcion/Disponibilidad', icon: <CitasIcon /> },
    { id: 2, label: 'Citas', link: '/recepcion/invitado', icon: <PacientesIcon /> },
    { id: 3, label: 'Mi Perfil', link: '/recepcion/perfil', icon: <ProfileIcon /> },
  ];

  return (
    <Drawer
      className='contenedorsider'
      variant="persistent"
      anchor="left"
      open={isSidebarOpen}
      sx={{
        width: isSidebarOpen ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        },
        transition: (theme) => theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      {/* --- SECCIÓN SUPERIOR: LOGO --- */}
      <Toolbar className='sidebar-header'>
        <img src={logoPatitaFeliz} alt="Logo Patita Feliz" className="sidebar-logo-image" />
        <Typography
          className='Titulos'
          variant="h6" component="span" >
          Patita Feliz
        </Typography>
      </Toolbar>
      
      {/* --- SECCIÓN MEDIA: LISTA DE NAVEGACIÓN --- */}
      <Box className="sidebar-list-container">
        <List>
          {structure.map((item) => (
            <ListItemButton 
              key={item.label} 
              component={Link} 
              to={item.link}
              selected={location.pathname === item.link} 
              className="sidebar-item"
            >
              <ListItemIcon className='sidebar-item-icon'>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* --- SECCIÓN INFERIOR: PERFIL DE USUARIO (SOLO VISUAL) --- */}
      <Box className="sidebar-footer">
        <Box className="user-profile">
          <Avatar 
            className='avatar' 
            alt={userData?.nombre}
            src={currentUser?.photoURL || ''} 
          >
            {userData?.nombre?.[0]}
          </Avatar>
          <Box className="user-info">
            <Typography variant="subtitle1" className="user-name">
              {userData?.nombre || 'Usuario'}
            </Typography>
          <Typography variant="body2" className="user-account-type">
              {userData?.rol === 'admin' ? 'Administrador' :
               userData?.rol === 'recepcionista' ? 'Recepcionista' : 'Cliente'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SidebarRecep;