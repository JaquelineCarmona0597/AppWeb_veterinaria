import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// Un mapa para traducir las rutas a nombres más amigables
const breadcrumbNameMap = {
  '/admin': 'App',
  '/admin/dashboard': 'Dashboard',
  '/admin/horarios': 'Horarios',
  '/admin/veterinarios': 'Veterinarios',
  // Añade más rutas aquí si es necesario
};

const Breadcrumb = () => {
  const location = useLocation();
  // Obtenemos las partes de la URL, quitando elementos vacíos
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs 
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ marginBottom: 2 }} // Un poco de espacio inferior
    >
      {/* Siempre mostramos el enlace principal */}
      <Link component={RouterLink} underline="hover" color="inherit" to="/admin">
        {breadcrumbNameMap['/admin']}
      </Link>
      
      {/* Mapeamos el resto de las partes de la ruta */}
      {pathnames.map((value, index) => {
        // Ignoramos 'admin' porque ya lo pusimos como 'App'
        if (value === 'admin') return null;

        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const name = breadcrumbNameMap[to];

        return last ? (
          // El último elemento no es un enlace, es texto simple
          <Typography color="text.primary" key={to}>
            {name}
          </Typography>
        ) : (
          // Los elementos intermedios son enlaces
          <Link component={RouterLink} underline="hover" color="inherit" to={to} key={to}>
            {name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default Breadcrumb;