// 1. IMPORTACIONES
// -----------------------------------------------------------------------------
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// <-- AÑADIDO: Componentes para el Dialog (Modal) ---
import { Box, Button, Card, Checkbox, CssBaseline, Divider, FormControlLabel, IconButton, InputAdornment, Link, Stack, TextField, Typography, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { PersonOutline as PersonOutlineIcon, LockOutlined as LockOutlinedIcon, MailOutline as MailOutlineIcon, Visibility, VisibilityOff, CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import '../../css/authCss/SignUp.css';
import TermsAndConditions from '../views/TermsAndConditions';

// 2. COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------
export default function SignUp() {
  // --- Estados del Componente ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openTermsModal, setOpenTermsModal] = useState(false); // <-- AÑADIDO: Estado para el modal

  // Estados para errores de validación
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  
  const navigate = useNavigate();

  // --- AÑADIDO: Handlers para el modal ---
  const handleOpenTerms = () => setOpenTermsModal(true);
  const handleCloseTerms = () => setOpenTermsModal(false);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    if (!newName) {
      setNameError('Por favor, introduce tu nombre.');
    } else {
      setNameError('');
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      setEmailError('Por favor, introduce un email válido.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const minLength = newPassword.length >= 6;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword);
    setPasswordCriteria({ minLength, hasUppercase, hasNumber, hasSpecialChar });
    if (confirmPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (password !== newConfirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const validate = () => {
    let isValid = true;
    if (!name) {
      setNameError('El nombre es obligatorio.');
      isValid = false;
    } else { setNameError(''); }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Por favor, introduce un email válido.');
      isValid = false;
    } else { setEmailError(''); }
    if ( !passwordCriteria.minLength || !passwordCriteria.hasUppercase || !passwordCriteria.hasNumber || !passwordCriteria.hasSpecialChar ) {
      setPasswordError('La contraseña no cumple con todos los requisitos.');
      isValid = false;
    } else { setPasswordError(''); }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
      isValid = false;
    } else { setConfirmPasswordError(''); }
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return; 

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        role: "client",
        createdAt: serverTimestamp()
      });
      console.log('¡Cuenta creada exitosamente!', user);
      navigate('/');
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

  const PasswordCriteriaItem = ({ met, text }) => (
    <ListItem dense sx={{ py: 0, px: 1 }}>
      <ListItemIcon sx={{ minWidth: 'auto', marginRight: 1, color: met ? 'success.main' : 'text.secondary' }}>
        {met ? <CheckCircleOutline fontSize="small" /> : <HighlightOff fontSize="small" />}
      </ListItemIcon>
      <ListItemText 
        primary={text} 
        primaryTypographyProps={{ variant: 'caption', color: met ? 'success.main' : 'text.secondary' }} 
      />
    </ListItem>
  );

  return (
    <>
      <CssBaseline />
      <Stack direction="column" justifyContent="center" className="signup-container">
        <Card variant="outlined" className="signup-card">
          <Typography className='creaCuenta' component="h1" variant="h4">
            Crea tu Cuenta
          </Typography>
          <Box className='box' component="form" onSubmit={handleSubmit} noValidate>
            {/* ... Campos de texto para nombre, email, contraseña ... (sin cambios) */}
            <TextField className='input' label="Nombre Completo" placeholder="Ej: Nombres Apellidos" value={name} onChange={handleNameChange} error={!!nameError} helperText={nameError} required fullWidth variant="outlined" InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon color="action" /></InputAdornment>), }} />
            <TextField className='input' label="Email" type="email" placeholder="tu@email.com" value={email} onChange={handleEmailChange} error={!!emailError} helperText={emailError} required fullWidth variant="outlined" InputProps={{ startAdornment: (<InputAdornment position="start"><MailOutlineIcon color="action" /></InputAdornment>), }} />
            <TextField className='input' label="Contraseña" placeholder="••••••" type={showPassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange} error={!!passwordError} helperText={passwordError} required fullWidth variant="outlined" InputProps={{ startAdornment: (<InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>), endAdornment: ( <InputAdornment position="end"> <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end"> {showPassword ? <VisibilityOff /> : <Visibility />} </IconButton> </InputAdornment> ), }} />
            {password && ( <Card variant="outlined" sx={{ p: 1, mb: 2, bgcolor: '#f5f5f5' }}> <List dense> <PasswordCriteriaItem met={passwordCriteria.minLength} text="Mínimo 6 caracteres" /> <PasswordCriteriaItem met={passwordCriteria.hasUppercase} text="Mínimo una mayúscula (A-Z)" /> <PasswordCriteriaItem met={passwordCriteria.hasNumber} text="Mínimo un número (0-9)" /> <PasswordCriteriaItem met={passwordCriteria.hasSpecialChar} text="Mínimo un carácter especial (!@#$...)" /> </List> </Card> )}
            <TextField className='input' label="Confirmar Contraseña" placeholder="••••••" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={handleConfirmPasswordChange} error={!!confirmPasswordError} helperText={confirmPasswordError} required fullWidth variant="outlined" InputProps={{ startAdornment: (<InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>), endAdornment: ( <InputAdornment position="end"> <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end"> {showPassword ? <VisibilityOff /> : <Visibility />} </IconButton> </InputAdornment> ), }} />

            <FormControlLabel
              control={
                <Checkbox 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  color="primary" 
                />
              }
              label={
                // <-- MODIFICADO: El Link ahora es un botón que abre el modal ---
                <Typography variant="body2">
                  Acepto los{' '}
                  <Link component="button" type="button" variant="body2" onClick={handleOpenTerms} className="forgot-password-link">
                    Términos y Condiciones
                  </Link>
                </Typography>
              }
            />

            <Button type="submit" fullWidth variant="contained" className="signup-button" disabled={!termsAccepted || isLoading }>
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

      {/* --- AÑADIDO: Componente Dialog para los Términos y Condiciones --- */}
      <Dialog open={openTermsModal} onClose={handleCloseTerms} scroll="paper">
        <DialogTitle>Términos y Condiciones de Uso</DialogTitle>
        <DialogContent dividers={true}>
          {/* ▼▼▼ 2. REEMPLAZA EL CONTENIDO ANTERIOR POR ESTO ▼▼▼ */}
          <DialogContentText component="div" tabIndex={-1}>
            <TermsAndConditions />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className='iniciar-secion' onClick={handleCloseTerms}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}