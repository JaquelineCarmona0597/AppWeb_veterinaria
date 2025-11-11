// ¡CAMBIO! Importamos useState
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// ¡CAMBIO! Importamos Button y los componentes de Dialog
import { 
  Drawer, List, ListItemIcon, ListItemText, Toolbar, 
  Typography, Box, Avatar, ListItemButton, Button, 
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions 
} from '@mui/material';
import { 
    Home as DashboardIcon, 
    Event as CitasIcon, 
    Pets as PacientesIcon, 
    AccountCircle as ProfileIcon,
    ExitToApp as LogoutIcon // ¡CAMBIO! Importamos el ícono de Logout
} from '@mui/icons-material';

// ¡CAMBIO! Traemos 'logout' desde el contexto
import { useAuth } from '../../context/AuthContext'; 
import logoPatitaFeliz from '../../assets/logoN.png';
import '../../css/adminCss/Sidebar.css';

// ¡CAMBIO! Movimos drawerWidth fuera del componente para que sea una constante global
const drawerWidth = 240;

const SidebarRecep = ({ isSidebarOpen }) => {
  const location = useLocation();
  // ¡CAMBIO! Obtenemos 'logout'
  const { userData, currentUser, logout } = useAuth();

  // --- ¡NUEVO! Estado y Handlers para el Modal de Logout ---
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const handleOpenModal = () => setOpenLogoutModal(true);
  const handleCloseModal = () => setOpenLogoutModal(false);

  const handleLogout = async () => {
    try {
      await logout();
      handleCloseModal();
      window.location.replace('/'); // Redirige a la raíz
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      handleCloseModal();
    }
  };
  
  const structure = [
    { id: 0, label: 'Dashboard', link: '/recepcion/dashboard', icon: <DashboardIcon /> },
    { id: 1, label: 'Disponibilidad', link: '/recepcion/Disponibilidad', icon: <CitasIcon /> },
    { id: 2, label: 'Citas', link: '/recepcion/invitado', icon: <PacientesIcon /> },
    { id: 3, label: 'Mi Perfil', link: '/recepcion/perfil', icon: <ProfileIcon /> },
  ];

  // ¡CAMBIO! Envolvemos en un Fragmento (<>)
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
          
          {/* --- ¡NUEVO! Botón de Cerrar Sesión --- */}
          <Button
            variant="contained"
            className="btn-peligro"
            startIcon={<LogoutIcon />}
            onClick={handleOpenModal}
          >
            Cerrar Sesión
          </Button>

        </Box>
      </Drawer>

      {/* --- ¡NUEVO! Diálogo de Confirmación --- */}
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

export default SidebarRecep;