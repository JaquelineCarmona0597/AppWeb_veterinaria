import React, { useState } from 'react'; // <-- 1. Importa useState
import { useAuth } from '../../context/AuthContext';
import '../../css/adminCss/perfil.css';

// --- 2. Importa los componentes para el Modal (Dialog) ---
import { 
  Paper, Box, Typography, Avatar, Divider, CircularProgress, Button,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle 
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const UserProfile = () => {
  const { userData, currentUser, logout } = useAuth();
  
  // --- 3. Añade el estado para controlar el modal ---
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const handleOpenModal = () => setOpenLogoutModal(true);
  const handleCloseModal = () => setOpenLogoutModal(false);

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return 'Fecha no disponible';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleCloseModal(); // Cierra el modal después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (!userData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando perfil...</Typography>
      </Box>
    );
  }

  return (
    <div className="profile-page-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h1" className="page-title">
          Perfil
        </Typography>
        <Button
          variant="contained"
          className="btn-peligro" // <-- 4. Aseguramos que el botón sea rojo
          startIcon={<LogoutIcon />}
          onClick={handleOpenModal} // <-- 5. El botón ahora abre el modal
        >
          Cerrar Sesión
        </Button>
      </Box>

      {/* ... (El resto de tu JSX de perfil se mantiene igual) ... */}
      <Box className="profile-page-header">
        <Avatar
          alt={userData?.nombre}
          src={currentUser?.photoURL || ''}
          className="profile-page-avatar"
        />
        <Box>
          <Typography variant="h4" component="h1" className="profile-page-name">
            {userData.nombre}
          </Typography>
          <Typography variant="body1" className="profile-page-email">
            {userData.correo}
          </Typography>
        </Box>
      </Box>

      <Paper elevation={0} variant="outlined" className="details-card">
        <Typography variant="h6" className="card-title">
          Información personal
        </Typography>
        <Divider />
        <Box className="details-grid">
          <div className="detail-row">
            <Typography className="detail-label">Nombre completo:</Typography>
            <Typography className="detail-value">{userData.nombre}</Typography>
          </div>
          <div className="detail-row">
            <Typography className="detail-label">Correo:</Typography>
            <Typography className="detail-value">{userData.correo}</Typography>
          </div>
          <div className="detail-row">
            <Typography className="detail-label">Número de teléfono:</Typography>
            <Typography className="detail-value">{userData.telefono || 'No proporcionado'}</Typography>
          </div>
          <div className="detail-row">
            <Typography className="detail-label">Rol:</Typography>
            <Typography className="detail-value" style={{ textTransform: 'capitalize' }}>{userData.rol}</Typography>
          </div>
          <div className="detail-row">
            <Typography className="detail-label">Miembro desde:</Typography>
            <Typography className="detail-value">{formatDate(userData.fechaCreacion)}</Typography>
          </div>
        </Box>
      </Paper>

      {/* --- 6. Añadimos el componente Dialog para la confirmación --- */}
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
    </div>
  );
};

export default UserProfile;