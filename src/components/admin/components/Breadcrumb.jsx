import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// ✅ 1. Importamos el archivo CSS que vamos a crear
import '../../../css/adminCss/Breadcrumb.css';

const breadcrumbNameMap = {
  '/admin': 'App',
  '/admin/dashboard': 'Dashboard',
  '/admin/horarios': 'Horarios',
  '/admin/veterinarios': 'Veterinarios',
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs 
      // ✅ 2. Añadimos una clase al contenedor principal
      className="breadcrumb-container"
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <Link 
        component={RouterLink} 
        underline="hover" 
        to="/admin"
        // ✅ 3. Añadimos una clase para los enlaces
        className="breadcrumb-link"
      >
        {breadcrumbNameMap['/admin']}
      </Link>
      
      {pathnames.map((value, index) => {
        if (value === 'admin') return null;

        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const name = breadcrumbNameMap[to];

        return last ? (
          <Typography 
            key={to}
            // ✅ 4. Y una clase para la página actual (el último elemento)
            className="breadcrumb-current"
          >
            {name}
          </Typography>
        ) : (
          <Link 
            component={RouterLink} 
            underline="hover" 
            to={to} 
            key={to}
            className="breadcrumb-link" // La misma clase para los enlaces
          >
            {name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default Breadcrumb;