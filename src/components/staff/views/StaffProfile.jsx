import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';

const StaffProfile = () => {
  const { userData } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Perfil</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">Nombre: {userData?.nombre}</Typography>
        <Typography variant="body1">Correo: {userData?.correo}</Typography>
        <Typography variant="body1">Rol: {userData?.rol}</Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined">Editar perfil</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default StaffProfile;
