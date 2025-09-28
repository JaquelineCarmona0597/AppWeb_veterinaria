import React, { useState } from 'react';
// ✅ CORRECCIÓN 2: Ruta de importación ajustada
import { useAuth } from '../../../context/AuthContext';
import { auth } from '../../../firebase';
import { signOut } from 'firebase/auth';

import { Paper, Box, IconButton, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, ArrowBack as ArrowBackIcon, AccountCircle as AccountIcon } from '@mui/icons-material';
import '../../../css/adminCss/Header.css'; // Revisa que esta ruta también sea correcta

const Header = ({ isSidebarOpen, handleToggleSidebar }) => {
  const [profileMenu, setProfileMenu] = useState(null);
  const { userData, currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Sesión cerrada exitosamente.');
    } catch (error) { // ✅ CORRECCIÓN 1: Llaves añadidas
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Paper component="header" elevation={1} className="header-container">
      <Box className="header-content">
        <IconButton 
          color="inherit" 
          onClick={handleToggleSidebar}
          className="menu-button-header"
        >
          {isSidebarOpen ? <ArrowBackIcon /> : <MenuIcon />}
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" className="titulo-header">
          Bienvenido, {userData?.name || 'Usuario'}
        </Typography>
        
        <IconButton onClick={(e) => setProfileMenu(e.currentTarget)}>
          <Avatar 
            className='avatar' 
            alt={userData?.name}
            src={currentUser?.photoURL || ''} 
          >
            {userData?.name?.[0]}
          </Avatar>
        </IconButton>
        
        <Menu
          anchorEl={profileMenu}
          open={Boolean(profileMenu)}
          onClose={() => setProfileMenu(null)}
        >
          <MenuItem>
            <AccountIcon sx={{ marginRight: 1 }} /> Perfil
          </MenuItem>
          <MenuItem className='serrarsecion' onClick={handleLogout}>
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Box>
    </Paper>
  );
};

export default Header;