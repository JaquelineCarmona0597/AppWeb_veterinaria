import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Muestra una pantalla de carga centrada que ocupa toda la ventana.
 * Es ideal para momentos en que la aplicación está esperando datos importantes,
 * como la autenticación del usuario.
 */
export default function LoadingScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'var(--color-fondo)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <CircularProgress sx={{ color: 'var(--color-primario)' }} />
      <Typography variant="h6" sx={{ mt: 2, color: 'var(--color-texto-secundario)' }}>
        Cargando...
      </Typography>
    </Box>
  );
}