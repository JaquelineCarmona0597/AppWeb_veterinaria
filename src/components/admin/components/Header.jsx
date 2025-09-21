// src/components/Header/Header.jsx

import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem } from '@mui/material';
// ✅ CORRECCIÓN: Cambiamos 'Account' por 'AccountCircle'
import { Menu as MenuIcon, ArrowBack as ArrowBackIcon, AccountCircle as AccountIcon } from '@mui/icons-material';

const Header = ({ isSidebarOpen, handleToggleSidebar }) => {
  const [profileMenu, setProfileMenu] = useState(null);

  const mockUser = {
    firstName: 'Ana',
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={handleToggleSidebar}
        >
          {isSidebarOpen ? <ArrowBackIcon /> : <MenuIcon />}
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, ml: 2 }}>
          Veterinaria Admin
        </Typography>
        
        <IconButton onClick={(e) => setProfileMenu(e.currentTarget)}>
          <Avatar alt="Ana">{mockUser.firstName?.[0]}</Avatar>
        </IconButton>
        
        <Menu
          anchorEl={profileMenu}
          open={Boolean(profileMenu)}
          onClose={() => setProfileMenu(null)}
        >
          {/* ✅ Usamos el ícono corregido aquí */}
          <MenuItem>
            <AccountIcon sx={{ marginRight: 1 }} /> Perfil
          </MenuItem>
          <MenuItem>Cerrar Sesión</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;