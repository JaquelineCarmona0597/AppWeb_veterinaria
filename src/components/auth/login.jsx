// Importamos las dependencias necesarias de React y Material-UI.
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import MuiLink from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';

// Importamos componentes de enrutamiento y personalizados.
import { Link } from 'react-router-dom';
import { GoogleIcon } from './customicons';
import { useNavigate } from 'react-router-dom';

// Importamos el componente del modal para recuperar la contraseña.
import ForgotPasswordModal from './ForgotPassword';

// Importamos nuestro nuevo archivo de estilos CSS.
import '../../css/authCss/Login.css';

// Definimos el componente de Login.
export default function Login() {
  // Estados para manejar los errores de validación de los campos de email y contraseña.
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  // Estado para controlar la visibilidad del modal de "Olvidé mi contraseña".
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const navigate = useNavigate();

  // Función para navegar al componente de registro.
  const handleNavigateToLogin = () => {
    navigate('/auth/signup');
  };

  // Función que se ejecuta al enviar el formulario.
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevenimos el comportamiento por defecto del formulario.
    if (emailError || passwordError) {
      return; // Si hay errores de validación, no hacemos nada.
    }
    const data = new FormData(event.currentTarget);
    // Mostramos los datos del formulario en la consola (para depuración).
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  // Función para validar los campos del formulario.
  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    let isValid = true;

    // Validamos el campo de email.
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Por favor, introduce un email válido.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    // Validamos el campo de contraseña.
    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  // Funciones para abrir y cerrar el modal.
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Componente para normalizar los estilos del navegador. */}
      <CssBaseline />
      {/* Contenedor principal que centra el contenido verticalmente. */}
      <Stack direction="column" justifyContent="space-between" className="login-container">
        {/* Tarjeta que contiene el formulario de login. */}
        <Card variant="outlined" className="login-card">
          {/* Logo de la aplicación. */}
          <Typography variant="h2" className="login-logo">
            Tu Logo
          </Typography>
          {/* Título del formulario. */}
          <Typography component="h1" variant="h4" className="login-title">
            Inicia Sesión
          </Typography>
          {/* Formulario de login. */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            className="login-form"
          >
            {/* Campo de Email. */}
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="tu@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            {/* Campo de Contraseña. */}
            <FormControl>
              <FormLabel htmlFor="password">Contraseña</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            {/* Checkbox para "Recuérdame". */}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recuérdame"
            />
            {/* Botón para enviar el formulario. */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Iniciar Sesión
            </Button>
            {/* Enlace para abrir el modal de "Olvidé mi contraseña". */}
            <MuiLink
              component="button"
              type="button"
              onClick={handleOpenModal}
              variant="body2"
              className="forgot-password-link"
            >
              ¿Olvidaste tu contraseña?
            </MuiLink>
          </Box>
          {/* Divisor con texto. */}
          <Divider>o</Divider>
          {/* Contenedor para opciones de inicio de sesión alternativas. */}
          <Box className="social-login-container">
            {/* Botón para iniciar sesión con Google. */}
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Iniciar sesión con Google')}
              startIcon={<GoogleIcon />}
            >
              Google
            </Button>
            {/* Texto y botón para navegar al registro. */}
            <Typography className="signup-text">
              ¿No tienes una cuenta?{' '}
              <Button variant="text" size="small" onClick={handleNavigateToLogin}>
                Regístrate
              </Button>
            </Typography>
          </Box>
        </Card>
      </Stack>
      {/* Componente del modal que se muestra u oculta según el estado. */}
      <ForgotPasswordModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}