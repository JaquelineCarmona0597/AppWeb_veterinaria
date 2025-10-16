// src/components/views/UnauthorizedView.jsx

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase'; // Asegúrate que la ruta sea correcta
import ConstructionIcon from '@mui/icons-material/Construction'; // Ícono para "en construcción"

// Importa tus estilos si los tienes
import '../../css/authCss/UnauthorizedView.css'; // Puedes renombrar este CSS también

const WorkInProgressView = () => { // Se cambió el nombre del componente
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
        {/* Se reemplazó el "403" por un ícono más adecuado */}
        <ConstructionIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h4" component="h2" className="unauthorized-title">
          Página en Construcción
        </Typography>
        
        <Typography variant="body1" className="unauthorized-subtitle">
          Estamos trabajando para crear el panel para clientes y veterinarios. ¡Estará disponible muy pronto!
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

export default WorkInProgressView;