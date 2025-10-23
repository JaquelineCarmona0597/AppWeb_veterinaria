import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';

const StaffDashboard = () => {
  const { userData } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Bienvenido al Panel del Personal</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">Usuario: {userData?.nombre || userData?.correo}</Typography>
        <Typography variant="body2">Rol: {userData?.rol}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>Aquí irán las herramientas para recepcionistas y veterinarios (citas, historial, etc.).</Typography>
      </Paper>
    </Box>
  );
};

export default StaffDashboard;
