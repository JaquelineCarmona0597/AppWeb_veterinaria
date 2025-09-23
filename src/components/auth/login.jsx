// 1. IMPORTACIONES
// -----------------------------------------------------------------------------
// React y Librerías
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Componentes de Material-UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// Íconos de Material-UI
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Componentes y Estilos Locales
import { GoogleIcon } from './customicons';
import ForgotPasswordModal from './ForgotPassword';
import '../../css/authCss/Login.css';

// 2. COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------
export default function Login() {
  // --- Estados del Componente ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para errores de validación
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const navigate = useNavigate();

  // --- Manejadores de Eventos (Handlers) ---
  const validateInputs = () => {
    let isValid = true;
    // Validación de Email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Por favor, introduce un email válido.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
    // Validación de Contraseña
    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    // Simulación de una llamada a API
    setTimeout(() => {
      console.log({ email, password });
      setIsLoading(false);
    }, 2000);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleNavigateToSignup = () => navigate('/auth/signup');
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // 3. RENDERIZADO DEL JSX
  // -----------------------------------------------------------------------------
  return (
    <>
      <CssBaseline />
      <Stack direction="column" justifyContent="space-between" className="login-container">
        <Card variant="outlined" className="login-card">
          {/* --- Encabezado --- */}
          <Box className="login-header">
            <img src="/src/assets/Logo.png" alt="Logo" className="login-logo-image" />
            <Typography component="h1" variant="h4" className="login-title">
              Inicia Sesión
            </Typography>
          </Box>

          {/* --- Formulario Principal --- */}
          <Box component="form" onSubmit={handleSubmit} noValidate className="login-form">
            <TextField
              className="input"
              label="Email"
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailErrorMessage}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><MailOutlineIcon color="action" /></InputAdornment>
                ),
              }}
            />
            <TextField
              className="input"
              label="Contraseña"
              id="password"
              placeholder="••••••"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordErrorMessage}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            {/* --- Opciones del Formulario --- */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label={<Typography variant="body2">Recuérdame</Typography>}
              />
              <MuiLink component="button" type="button" onClick={handleOpenModal} variant="body2" className="forgot-password-link">
                ¿Olvidaste tu contraseña?
              </MuiLink>
            </Box>

            {/* --- Botón de Envío --- */}
            <Button
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>
          </Box>

          {/* --- Separador y Login Social --- */}
          <Divider sx={{ my: 2 }}>o</Divider>
          <Box className="social-login-container">
            <Button
              className="google-button"
              fullWidth
              variant="outlined"
              onClick={() => alert('Iniciar sesión con Google')}
              startIcon={<GoogleIcon />}
            >
              Google
            </Button>
            <Typography variant="body2" className="signup-text">
              ¿No tienes una cuenta?{' '}
              <Button className="registrate" variant="text" size="small" onClick={handleNavigateToSignup}>
                Regístrate
              </Button>
            </Typography>
          </Box>
        </Card>
      </Stack>

      <ForgotPasswordModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}