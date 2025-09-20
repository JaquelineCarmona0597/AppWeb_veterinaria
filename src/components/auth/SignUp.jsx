// Importamos las dependencias necesarias de React y Material-UI.
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';

// Importamos nuestro nuevo archivo de estilos CSS para el registro.
import '../../css/authCss/SignUp.css';
import { useNavigate } from 'react-router-dom';

// Definimos el componente de SignUp (Registro).
// Recibe una prop 'onNavigateToLogin' para permitir la navegación de vuelta al login.
export default function SignUp() {
    const navigate = useNavigate();
    const onNavigateToLogin = () => {
        navigate('/auth/login');
    }

  // Función que se ejecuta al enviar el formulario.
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevenimos el comportamiento por defecto del formulario.
    const data = new FormData(event.currentTarget);
    // Mostramos los datos del formulario en la consola (para depuración).
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    alert('Formulario enviado (revisa la consola para ver los datos)');
  };

  return (
    <>
      {/* Componente para normalizar los estilos del navegador. */}
      <CssBaseline />
      {/* Contenedor principal que centra el contenido verticalmente. */}
      <Stack
        direction="column"
        justifyContent="center"
        className="signup-container"
      >
        {/* Tarjeta que contiene el formulario de registro. */}
        <Card
          variant="outlined"
          className="signup-card"
        >
          {/* Título del formulario. */}
          <Typography component="h1" variant="h4">
            Crea tu Cuenta
          </Typography>
          {/* Formulario de registro. */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Campo de Email. */}
            <FormControl fullWidth className="form-control-margin">
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                id="email"
                placeholder="tu@email.com"
                name="email"
                autoComplete="email"
              />
            </FormControl>
            {/* Campo de Contraseña. */}
            <FormControl fullWidth>
              <FormLabel htmlFor="password">Contraseña</FormLabel>
              <TextField
                required
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </FormControl>

            {/* Botón para enviar el formulario de registro. */}
            <Button type="submit" fullWidth variant="contained" className="signup-button">
              Registrarme
            </Button>

            {/* Texto y botón para navegar a la pantalla de inicio de sesión. */}
            <Typography className="login-prompt">
              ¿Ya tienes una cuenta?{' '}
              <Button variant="text" size="small" onClick={onNavigateToLogin}>
                Inicia Sesión
              </Button>
            </Typography>
          </Box>
        </Card>
      </Stack>
    </>
  );
}