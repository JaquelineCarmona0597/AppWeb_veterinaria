// ¡CORREGIDO! Faltaba 'useState'
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Drawer, List, ListItemIcon, ListItemText, Toolbar, 
  Typography, Box, Avatar, ListItemButton, Dialog, 
  DialogTitle, DialogContent, DialogContentText, 
  DialogActions, Button 
} from '@mui/material';
import { 
  Home as DashboardIcon, 
  CalendarMonth as HorariosIcon, 
  MedicalServices as VeterinariosIcon, 
  AccountCircle as ProfileIcon, 
  // ¡CORREGIDO! Renombrado a LogoutIcon para que coincida con el uso
  ExitToApp as LogoutIcon 
} from '@mui/icons-material';

import { useAuth } from '../../../context/AuthContext'; 
import logoPatitaFeliz from '../../../assets/logoN.png';
import '../../../css/adminCss/Sidebar.css';

// ¡CORREGIDO! Se define la variable drawerWidth
const drawerWidth = 250;

const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();
  const { userData, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Estado para mostrar el diálogo de confirmación
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const handleOpenModal = () => setOpenLogoutModal(true);
  const handleCloseModal = () => setOpenLogoutModal(false);

  // ¡CORREGIDO! Se implementa la lógica de logout
  const handleLogout = async () => {
    try {
      await logout();
      handleCloseModal();
      // Esta es una buena forma de recargar para evitar condiciones de carrera
      window.location.replace('/');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      handleCloseModal(); // Cierra el modal incluso si hay error
    }
  };

  const structure = [
    { id: 0, label: 'Dashboard', link: '/admin/dashboard', icon: <DashboardIcon /> },
    { id: 1, label: 'Empleados', link: '/admin/veterinarios', icon: <VeterinariosIcon /> },
    { id: 2, label: 'perfil', link: '/admin/perfil', icon: <ProfileIcon /> },
  ];

  // ¡CORREGIDO! Se envuelve todo en un Fragmento (<>)
  return (
    <>
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

        {/* --- SECCIÓN INFERIOR: PERFIL DE USUARIO --- */}
        <Box className="sidebar-footer">

          
          {/* Botón de cerrar sesión */}
          <Button
            variant="contained"
            className="btn-peligro"
            startIcon={<LogoutIcon />} // ¡CORREGIDO! Ahora coincide con el import
            onClick={handleOpenModal} 
          >
            Cerrar Sesión
          </Button>
        </Box>
      </Drawer>

      {/* --- DIÁLOGO DE CONFIRMACIÓN --- */}
      {/* ¡CORREGIDO! Se eliminó el diálogo duplicado y se usa el estado correcto */}
      <Dialog
        className='modal-contenedor'
        open={openLogoutModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar cierre de sesión"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que quieres cerrar tu sesión?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} className="btn-secundario">
            Cancelar
          </Button>
          <Button onClick={handleLogout} className="btn-peligro" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;