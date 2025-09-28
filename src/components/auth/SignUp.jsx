// 1. IMPORTACIONES
// -----------------------------------------------------------------------------
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Box, Button, Card, Checkbox, CssBaseline, Divider, FormControlLabel, IconButton, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material';
import { LockOutlined as LockOutlinedIcon, MailOutline as MailOutlineIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import '../../css/authCss/SignUp.css';

// 2. COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------
export default function SignUp() {
  // --- Estados del Componente ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // <-- AÑADIDO: Estado para la carga

  // Estados para errores de validación
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const navigate = useNavigate();

  // --- Manejadores de Eventos (Handlers) ---
  const validate = () => {
    // ... (Tu función de validación está perfecta, no cambia)
    let isValid = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Por favor, introduce un email válido.');
      isValid = false;
    } else { setEmailError(''); }
    if (!password || password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres.');
      isValid = false;
    } else { setPasswordError(''); }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
      isValid = false;
    } else { setConfirmPasswordError(''); }
    return isValid;
  };

  // --- ELIMINADO: La versión vieja de handleSubmit fue borrada de aquí ---

  // Lógica de Firebase para el Registro (La única y correcta versión)
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return; 

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "client",
        createdAt: serverTimestamp()
      });

      console.log('¡Cuenta creada exitosamente!', user);
      navigate('/admin/dashboard');

    } catch (error) {
      console.error("Error al registrar:", error.code);
      if (error.code === 'auth/email-already-in-use') {
        setEmailError('Este correo electrónico ya está en uso.');
      } else {
        setEmailError('Ocurrió un error al crear la cuenta.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const onNavigateToLogin = () => navigate('/auth/login');

  // 3. RENDERIZADO DEL JSX
  // -----------------------------------------------------------------------------
  return (
    <>
      <CssBaseline />
      <Stack direction="column" justifyContent="center" className="signup-container">
        <Card variant="outlined" className="signup-card">
          <Typography className='creaCuenta' component="h1" variant="h4">
            Crea tu Cuenta
          </Typography>

          <Box className='box' component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              className='input'
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError} // El doble signo de exclamación convierte el string en booleano
              helperText={emailError}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (<InputAdornment position="start"><MailOutlineIcon color="action" /></InputAdornment>),
              }}
            />
            <TextField
              className='input'
              label="Contraseña"
              placeholder="••••••"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Corregido el error de escritura
              error={!!passwordError}
              helperText={passwordError}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (<InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              className='input'
              label="Confirmar Contraseña"
              placeholder="••••••"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (<InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            {/* --- Nuevo: Términos y Condiciones --- */}
            <FormControlLabel
              control={
                <Checkbox 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  color="primary" 
                />
              }
              label={
                // CORRECTO
                <Typography variant="body2">
                  Acepto los <Link href="/terminos" target="_blank">Términos y Condiciones</Link>
                </Typography>
              }
            />

            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              className="signup-button"
              disabled={!termsAccepted || isLoading } // El botón se deshabilita si los términos no están aceptados
            >
              {isLoading ? 'Registrando...' : 'Registrarme'}
            </Button>

            <Divider sx={{ my: 1 }} />

            <Typography className="login-prompt">
              ¿Ya tienes una cuenta?{' '}
              <Button className='iniciar-secion' variant="text" size="small" onClick={onNavigateToLogin}>
                Inicia Sesión
              </Button>
            </Typography>
          </Box>
        </Card>
      </Stack>
    </>
  );
}