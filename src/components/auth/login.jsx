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

import { GoogleIcon} from './customicons';

// Nuevo: Importa el componente del modal
import ForgotPasswordModal from './ForgotPassword';


export default function Login({ onNavigateToSignUp }) {
  
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  
  // Nuevo: Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (emailError || passwordError) {
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };
  
  // Nuevas funciones para abrir y cerrar el modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <CssBaseline />
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={{
          height: '100vh',
          minHeight: '100%',
          padding: 2,
          '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            zIndex: -1,
            inset: 0,
            backgroundImage:
              'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
            backgroundRepeat: 'no-repeat',
          },
        }}
      >
        <Card
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            width: '100%',
            padding: 4,
            gap: 2,
            margin: 'auto',
            maxWidth: '450px',
            boxShadow:
              'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
          }}
        >
          {/* Aquí puedes poner un logo, por ahora es solo un placeholder */}
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            Tu Logo
          </Typography>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Inicia Sesión
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recuérdame"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Iniciar Sesión
            </Button>
            
            {/* Nuevo: El enlace que abrirá el modal */}
            <MuiLink
              component="button"
              type="button"
              onClick={handleOpenModal}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              ¿Olvidaste tu contraseña?
            </MuiLink>

          </Box>
          <Divider>o</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Iniciar sesión con Google')}
              startIcon={<GoogleIcon />}
            >
              Google
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              ¿No tienes una cuenta?{' '}
              <Button variant="text" size="small" onClick={onNavigateToSignUp}>
                Regístrate
              </Button>
            </Typography>
          </Box>
        </Card>
      </Stack>
      
      {/* Nuevo: El componente del modal renderizado condicionalmente */}
      <ForgotPasswordModal open={isModalOpen} onClose={handleCloseModal} />

    </>
  );
}