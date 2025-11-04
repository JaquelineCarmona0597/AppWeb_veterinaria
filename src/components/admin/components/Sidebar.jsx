import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Drawer, List, ListItemIcon, ListItemText, Toolbar, Typography, Box, Avatar, ListItemButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Home as DashboardIcon, CalendarMonth as HorariosIcon, MedicalServices as VeterinariosIcon, AccountCircle as ProfileIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';

import { useAuth } from '../../../context/AuthContext'; 
import logoPatitaFeliz from '../../../assets/logoN.png';
import '../../../css/adminCss/Sidebar.css';

const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();
  // La única lógica que necesita es obtener los datos del usuario para mostrarlos.
  const { userData, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Estado para mostrar el diálogo de confirmación
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const drawerWidth = 240;
  

  const structure = [
    { id: 0, label: 'Dashboard', link: '/admin/dashboard', icon: <DashboardIcon /> },
    { id: 1, label: 'Empleados', link: '/admin/veterinarios', icon: <VeterinariosIcon /> },
    { id: 2, label: 'perfil', link: '/admin/perfil', icon: < ProfileIcon/> },
    
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
              {userData?.rol === 'admin' ? 'Administrador' : 'Cliente'}
            </Typography>
          </Box>
        </Box>
        {/* Botón de cerrar sesión (abre diálogo de confirmación) */}
        <ListItemButton onClick={() => setLogoutDialogOpen(true)} className="sidebar-logout">
          <ListItemIcon className='sidebar-item-icon'><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary={'Cerrar sesión'} />
        </ListItemButton>
      </Box>

      {/* Diálogo de confirmación para cerrar sesión */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        aria-labelledby="confirm-logout-title"
      >
        <DialogTitle id="confirm-logout-title">Confirmar cierre de sesión</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro que deseas cerrar sesión?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={async () => {
              try {
                await logout();
                setLogoutDialogOpen(false);
                navigate('/auth/login');
              } catch (error) {
                console.error('Error cerrando sesión:', error);
                setLogoutDialogOpen(false);
              }
            }}
            color="error"
            variant="contained"
          >
            Cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default Sidebar;