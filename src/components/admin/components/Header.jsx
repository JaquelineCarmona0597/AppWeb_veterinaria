import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { auth } from '../../../firebase';
import { signOut } from 'firebase/auth';

// ✅ 1. Importamos los componentes para el diálogo de confirmación
import { Paper, Box, IconButton, Typography, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Menu as MenuIcon, ArrowBack as ArrowBackIcon, Logout as LogoutIcon } from '@mui/icons-material';
import '../../../css/adminCss/Header.css';

const Header = ({ isSidebarOpen, handleToggleSidebar }) => {
  // ✅ 2. Añadimos un estado para controlar la visibilidad del diálogo
  const [openDialog, setOpenDialog] = useState(false);
  const { userData } = useAuth();

  // La función de logout se mantiene igual
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  
  // ✅ 3. Creamos funciones para abrir, cerrar y confirmar
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmLogout = () => {
    handleCloseDialog();
    handleLogout();
  };

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
          
          <Typography variant="h6" noWrap component="div" className="titulo-header">
            Bienvenido, {userData?.nombre || 'Usuario'}
          </Typography>
          

          <IconButton 
          className='logioutbutton'
            onClick={handleOpenDialog} // Ahora abre el diálogo
            title="Cerrar Sesión"
            sx={{ color: 'var(--color-peligro)' }} // Le damos el color rojo
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* ✅ 5. Añadimos el componente de Diálogo para la confirmación */}
      <Dialog
        className='containermodal'
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle 
          className='modalestasseguro'
          id="alert-dialog-title">
          {"¿Estás seguro de que quieres cerrar sesión?"}
        </DialogTitle>
        <DialogContent 
          className='modaltext'>
          <DialogContentText
            className='text'
            id="alert-dialog-description">
            Esta acción finalizará tu sesión actual.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          className='botonesmodal'>
          <Button className='cancelarmodalbutton' onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            className='cerrarmodal'
            onClick={handleConfirmLogout} 
            sx={{ color: 'var(--color-peligro)' }} // El botón de confirmación también es rojo
            autoFocus
          >
            Cerrar Sesión
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;