import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer" // Es una buena práctica semántica
      sx={{
        mt: 5,
        p: 2, // Añadimos un poco de padding
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid #e0e0e0', // Un borde sutil para separarlo
      }}
    >
      {/* Sección Izquierda: Copyright */}
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Veterinaria Admin. Todos los derechos reservados.
      </Typography>

      {/* Sección Derecha: Enlaces y Redes Sociales */}
      <Box>
        <Link href="/privacidad" variant="body2" color="text.secondary" sx={{ mr: 2 }}>
          Política de Privacidad
        </Link>
        <IconButton href="https://facebook.com" target="_blank" color="primary" size="small">
          <Facebook />
        </IconButton>
        <IconButton href="https://twitter.com" target="_blank" color="primary" size="small">
          <Twitter />
        </IconButton>
        <IconButton href="https://instagram.com" target="_blank" color="primary" size="small">
          <Instagram />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;