// 1. IMPORTACIONES
// ... (Tus importaciones están perfectas)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; 
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { GoogleIcon } from './customicons';
import ForgotPasswordModal from './ForgotPassword';
import '../../css/authCss/Login.css';
// Al inicio de login.jsx, junto a tus otras importaciones
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../../firebase'; // Asegúrate de importar 'db'


// 2. COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------
export default function Login() {
  // --- Estados del Componente ---
  // ... (Tus estados están perfectos)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [firebaseError, setFirebaseError] = useState('');
  const navigate = useNavigate();

  // --- Manejadores de Eventos (Handlers) ---
  const validateInputs = () => {
    // ... (Tu validación está perfecta)
    let isValid = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Por favor, introduce un email válido.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
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
  
  // Lógica de Firebase para Email y Contraseña (la versión correcta)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFirebaseError(''); 
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Inicio de sesión exitoso!');
      navigate('/');
    } catch (error) {
      console.error("Error en Firebase:", error.code);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setFirebaseError('El correo o la contraseña son incorrectos.');
      } else {
        setFirebaseError('Ocurrió un error. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Lógica de Firebase para Google
// En tu archivo login.jsx

const handleGoogleLogin = async () => {
  setIsLoading(true);
  setFirebaseError('');
  const provider = new GoogleAuthProvider();
  
  try {
    // 1. Inicia sesión como antes
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // 2. Verificamos si el usuario ya existe en la colección 'usuarios'
    const userDocRef = doc(db, 'usuarios', user.uid); // <-- ¡AQUÍ ESTÁ EL CAMBIO!
    const docSnap = await getDoc(userDocRef);

    // 3. Si el documento NO existe, lo creamos
    if (!docSnap.exists()) {
      // Usamos 'setDoc' para crear un nuevo documento en la colección 'usuarios'
      await setDoc(userDocRef, {
        id: user.uid,              // <-- Corregido
        nombre: user.displayName,  // <-- Corregido
        correo: user.email,        // <-- Corregido
        rol: "cliente",            // <-- Corregido (rol en minúsculas)
        telefono: "",              // <-- Añadido (inicialmente vacío)
        fechaCreacion: serverTimestamp() // <-- Corregido
      });
      console.log('Nuevo usuario de Google guardado en la colección "usuarios".');
    }

    console.log('Inicio de sesión con Google exitoso!');
    navigate('/'); // Te redirige al dashboard principal

  } catch (error) {
    console.error("Error con Google:", error.code);
    if (error.code !== 'auth/popup-closed-by-user') {
      setFirebaseError('No se pudo iniciar sesión con Google. Intenta de nuevo.');
    }
  } finally {
    setIsLoading(false);
  }
};

  // --- ELIMINADO: Se borró la función handleSubmit duplicada que estaba aquí. ---

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
          <Box className="login-header">
            <img src="/src/assets/logoN.png" alt="Logo" className="login-logo-image" />
            <Typography component="h1" variant="h4" className="login-title">Inicia Sesión</Typography>
          </Box>

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
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label={<Typography variant="body2">Recuérdame</Typography>}
              />
              <MuiLink component="button" type="button" onClick={handleOpenModal} variant="body2" className="forgot-password-link">
                ¿Olvidaste tu contraseña?
              </MuiLink>
            </Box>

            {firebaseError && (
              <Typography color="error" variant="body2" sx={{ my: 2, textAlign: 'center' }}>
                {firebaseError}
              </Typography>
            )}

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

          <Divider sx={{ my: 2 }}>o</Divider>
          
          <Box className="social-login-container">
            <Button
              className="google-button"
              fullWidth
              variant="outlined"
              onClick={handleGoogleLogin} // <-- CORREGIDO: Se conectó la función real
              startIcon={<GoogleIcon />}
              disabled={isLoading}
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