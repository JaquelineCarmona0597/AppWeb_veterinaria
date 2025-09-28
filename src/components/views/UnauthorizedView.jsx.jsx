// src/components/views/UnauthorizedView.jsx

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase'; // Asegúrate que la ruta sea correcta

// Importa el nuevo archivo de estilos
import '../../css/authCss/UnauthorizedView.css.css';

const UnauthorizedView = () => {
  const navigate = useNavigate();

  // Esta función cierra la sesión actual y redirige al login
  const handleGoToLogin = async () => {
    try {
      await signOut(auth); // Cierra sesión para evitar bucles
      navigate('/auth/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      navigate('/auth/login'); // Igualmente redirige si hay error
    }
  };

  return (
    <Box className="unauthorized-container">
      <Paper elevation={3} className="unauthorized-card">
        <Typography variant="h1" component="h1" className="unauthorized-code">
          403
        </Typography>
        <Typography variant="h4" component="h2" className="unauthorized-title">
          Acceso Denegado
        </Typography>
        <Typography variant="body1" className="unauthorized-subtitle">
          Lo sentimos, no tienes los permisos necesarios para acceder a esta página.
        </Typography>
        <Button
          variant="contained"
          onClick={handleGoToLogin}
          className="unauthorized-button"
        >
          Regresar al Inicio de Sesión
        </Button>
      </Paper>
    </Box>
  );
};

export default UnauthorizedView;