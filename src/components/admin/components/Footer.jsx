import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
// Se importa el ícono 'X' en lugar de 'Twitter'
import { Facebook, Instagram, X } from '@mui/icons-material';

// ✅ 1. Importamos el archivo CSS que crearemos
import '../../../css/adminCss/Footer.css';

const Footer = () => {
  return (
    <Box
      component="footer"
      // ✅ 2. Añadimos una clase principal al contenedor del footer
      className="footer-container"
    >
      {/* Sección Izquierda: Copyright */}
      <Typography variant="body2" className="footer-copyright">
        {/* ✅ 3. Añadimos una clase para el texto de copyright */}
        © {new Date().getFullYear()} Patita Feliz Admin. Todos los derechos reservados.
      </Typography>

      {/* Sección Derecha: Enlaces y Redes Sociales */}
      <Box className="footer-links">
        {/* ✅ 4. Añadimos una clase al contenedor de los enlaces */}
        <Link href="/privacidad" variant="body2">
          Política de Privacidad
        </Link>
        <IconButton href="https://facebook.com" target="_blank" size="small">
          <Facebook />
        </IconButton>
        
        {/* --- CAMBIO AQUÍ --- */}
        <IconButton 
          href="https://x.com"
          target="_blank" 
          size="small"
        >
          <X /> {/* 👈 Ícono actualizado */}
        </IconButton>
        {/* --- FIN DEL CAMBIO --- */}

        <IconButton href="https://instagram.com" target="_blank" size="small">
          <Instagram />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;