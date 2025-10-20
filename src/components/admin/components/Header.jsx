import React, {  } from 'react';
import { useAuth } from '../../../context/AuthContext';


// Componentes de Material-UI
import { Paper, Box, IconButton, Typography } from '@mui/material';
import { Menu as MenuIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import '../../../css/adminCss/Header.css';

const Header = ({ isSidebarOpen, handleToggleSidebar }) => {
  const { userData } = useAuth();

  // NOTA: Las funciones de logout y del modal ya no son necesarias aquí,
  // ya que se manejarán desde la página de Perfil.

  return (
    <>
      <Paper component="header" elevation={1} className="header-container">
        <Box className="header-content">
          <IconButton 
            color="inherit" 
            onClick={handleToggleSidebar}
            className="menu-button-header"
          >
            {isSidebarOpen ? <ArrowBackIcon /> : <MenuIcon />}
          </IconButton>
          
          <Typography
            className='Titulos'
            variant="h6" noWrap component="div" 
            sx={{ flexGrow: 1 }} // Esto mantiene el saludo alineado a la izquierda
          >
            Hola, {userData?.nombre || 'Usuario'}
          </Typography>
          
          {/* El botón de Logout y el Modal han sido removidos */}

        </Box>
      </Paper>
    </>
  );
};

export default Header;