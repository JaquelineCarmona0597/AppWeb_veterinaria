// 1. IMPORTACIONES
// -----------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; 
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '../../context/AuthContext';
import { Box, Button, Card, Checkbox, CssBaseline, Divider, FormControlLabel, IconButton, InputAdornment, Link, Stack, TextField, Typography, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, Alert } from '@mui/material';
import { PersonOutline as PersonOutlineIcon, LockOutlined as LockOutlinedIcon, MailOutline as MailOutlineIcon, Visibility, VisibilityOff, CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import TermsAndConditions from '../views/TermsAndConditions';

// 2. COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------
export default function SignUp() {
  // --- Estados del Componente ---
  // (Tus estados están perfectos)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { refreshUserData } = useAuth();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(null);
  const [invitacionData, setInvitacionData] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [tokenError, setTokenError] = useState(null);
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

  // (useEffect para validar el token)
  useEffect(() => {
    const invitationToken = searchParams.get('token');
    if (!invitationToken) {
      setTokenLoading(false);
      return;
    }
    setToken(invitationToken);
    
    const fetchInvitation = async () => {
      try {
        const docRef = doc(db, "invitaciones", invitationToken);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setTokenError("Este enlace de invitación no es válido.");
        } else {
          const data = docSnap.data();
          if (data.estado !== 'pendiente') {
            setTokenError("Esta invitación ya ha sido utilizada.");
          } else {
            setInvitacionData(data);
            setEmail(data.correo); 
          }
        }
      } catch (err) {
        // --- ARREGLO 1 (ESLint) ---
        // Ahora sí usamos 'err'
        console.error("Error al verificar la invitación:", err);
        setTokenError("Error al verificar la invitación.");
        // --- FIN ARREGLO 1 ---
      } finally {
        setTokenLoading(false);
      }
    };
    fetchInvitation();
  // --- CORREGIDO --- 
  // Se eliminó la línea duplicada que cerraba el hook
  }, [searchParams]);
  // --- Handlers para el modal ---
  const handleOpenTerms = () => setOpenTermsModal(true);
  const handleCloseTerms = () => setOpenTermsModal(false);

  // --- Handlers de formulario ---
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
    if (token) return; // No dejar cambiar el email si vienes de invitación

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
    // (Tu lógica de criterios es correcta)
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

  // --- Función de Validación ---
  const validate = () => {
    // (Tu lógica de validación es correcta)
    const criteria = {
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    };
    setPasswordCriteria(criteria);

    let isValid = true;
    if (!name) {
      setNameError('El nombre es obligatorio.');
      isValid = false;
    } else { setNameError(''); }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Por favor, introduce un email válido.');
      isValid = false;
    } else { setEmailError(''); }

    // --- CORREGIDO ---
    // Se eliminó la línea 'if' duplicada
    if ( !criteria.minLength || !criteria.hasUppercase || !criteria.hasNumber || !criteria.hasSpecialChar ) {
      setPasswordError('La contraseña no cumple con todos los requisitos.');
      isValid = false;
    } else { setPasswordError(''); }
    // --- FIN CORREGIDO ---

    if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
      isValid = false;
    } else { setConfirmPasswordError(''); }
    return isValid;
  };

  // --- Función de Envío ---
  const handleSubmit = async (event) => {
    // (Tu lógica de handleSubmit es perfecta, se queda igual)
    event.preventDefault();
    if (!validate()) return; 

    setIsLoading(true);
    setEmailError('');
    setConfirmPasswordError('');

    if (token && invitacionData) {
      // --- LÓGICA DE EMPLEADO (con token) ---
      try {
        const functions = getFunctions();
        const completarInvitacion = httpsCallable(functions, 'completarInvitacion');
        
        await completarInvitacion({
          token: token,
          nombre: name,
          password: password,
        });

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await refreshUserData(userCredential.user);
        
        navigate('/dashboard-empleado'); // (O la ruta que corresponda)

      } catch (error) {
        console.error("Error al completar invitación:", error);
        setConfirmPasswordError(error.message || "Error al registrar empleado.");
      } finally {
        setIsLoading(false);
      }

    } else {
      // --- LÓGICA DE CLIENTE (sin token) ---
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "usuarios", user.uid), {
          id: user.uid,
          nombre: name,
          correo: user.email,
          rol: "cliente",
          telefono: "", 
          fechaCreacion: serverTimestamp()
        });
        
        await refreshUserData(user);
        navigate('/dashboard'); 

      } catch (error) {
        console.error("Error al registrar cliente:", error.code);
        if (error.code === 'auth/email-already-in-use') {
          setEmailError('Este correo electrónico ya está en uso.');
        } else {
          setEmailError('Ocurrió un error al crear la cuenta.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const onNavigateToLogin = () => navigate('/auth/login');

  const PasswordCriteriaItem = ({ met, text }) => (
    // (Tu componente de criterios es perfecto)
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

  // (Tu lógica de renderizado condicional es perfecta)
  if (tokenLoading) {
    return (
      <Stack className='secion-container' alignItems="center" justifyContent="center">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Verificando invitación...</Typography>
      </Stack>
    );
  }

  if (tokenError) {
    return (
      <Stack className='secion-container' alignItems="center" justifyContent="center" spacing={2} sx={{ p: 3 }}>
        <Alert severity="error" sx={{ width: '100%', maxWidth: 400 }}>
          {tokenError}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/auth/login')}>Ir a Iniciar Sesión</Button>
      </Stack>
    );
  }

  return (
    <>
      <CssBaseline />
      <Stack 
        className='secion-container'
        >
        <Card 
          className='formilario-contenedor'
          >
          <Box 
          className="contenedor-Titulo-imagen">
            <img
              className='secion-imagen'
              src="/src/assets/logoN.png" 
              alt="Logo"/>
            <Typography 
              className='secion-Titulo'>
                {token ? "Completa tu Registro" : "Crea tu cuenta"}
            </Typography>
          </Box>
          <Box 
          className='Formulario-secion' 
          component="form" onSubmit={handleSubmit} noValidate>
            {/* ... Campos de texto para nombre, email, contraseña ... (sin cambios) */}
            <TextField className='secion-inputs' label="Nombre Completo" placeholder="Ej: Nombres Apellidos" value={name} onChange={handleNameChange} error={!!nameError} helperText={nameError} required fullWidth variant="outlined" InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon color="action" /></InputAdornment>), }} />
            <TextField 
              className='secion-inputs' 
              label="Email" 
              type="email" 
              placeholder="tu@email.com" 
              value={email} 
              onChange={handleEmailChange} 
              error={!!emailError} 
              helperText={emailError} 
              required 
              fullWidth 
              variant="outlined" 
              InputProps={{ 
                startAdornment: (<InputAdornment position="start"><MailOutlineIcon color="action" /></InputAdornment>),
                readOnly: !!token // <-- ¡AQUÍ! Bloquea el campo si hay token
              }} 
            />
            <TextField className='secion-inputs' label="Contraseña" placeholder="••••••" type={showPassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange} error={!!passwordError} helperText={passwordError} required fullWidth variant="outlined" InputProps={{ startAdornment: (<InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>), endAdornment: ( <InputAdornment position="end"> <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end"> {showPassword ? <VisibilityOff /> : <Visibility />} </IconButton> </InputAdornment> ), }} />
            {password && ( <Card variant="outlined" sx={{ p: 1, mb: 2, bgcolor: '#f5f5f5' }}> <List dense> <PasswordCriteriaItem met={passwordCriteria.minLength} text="Mínimo 6 caracteres" /> <PasswordCriteriaItem met={passwordCriteria.hasUppercase} text="Mínimo una mayúscula (A-Z)" /> <PasswordCriteriaItem met={passwordCriteria.hasNumber} text="Mínimo un número (0-9)" /> <PasswordCriteriaItem met={passwordCriteria.hasSpecialChar} text="Mínimo un carácter especial (!@#$...)" /> </List> </Card> )}
            <TextField className='secion-inputs' label="Confirmar Contraseña" placeholder="••••••" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={handleConfirmPasswordChange} error={!!confirmPasswordError} helperText={confirmPasswordError} required fullWidth variant="outlined" InputProps={{ startAdornment: (<InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>), endAdornment: ( <InputAdornment position="end"> <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end"> {showPassword ? <VisibilityOff /> : <Visibility />} </IconButton> </InputAdornment> ), }} />

            <FormControlLabel
            className='aceptar-trerminos'
              control={
                <Checkbox 
                  className='cudro-aceptar'
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
              }
              label={
                // <-- MODIFICADO: El Link ahora es un botón que abre el modal ---
                <Typography 
                className='acepto-los'
                variant="body2">
                  Acepto los{' '}
                  <Link
                  className='redireccion-boton'
                  component="button" 
                  type="button" variant="body2" 
                  onClick={handleOpenTerms} 
                  >
                    Términos y Condiciones
                  </Link>
                </Typography>
              }
            />

            <Button
            className={`secion-boton ${isLoading ? 'loading' : ''}`}
            type="submit" 
            fullWidth variant="contained" 
            disabled={!termsAccepted || isLoading }
            >
              {isLoading ? 'Registrando...' : 'Registrarme'}
            </Button>
            {/* --- MODIFICADO --- */}
            {/* Se oculta el enlace a "Iniciar Sesión" si vienes de un token */}
            {!token && (
              <Typography 
                className="secion-pregunta">
                ¿Ya tienes una cuenta?{' '}
                <Button 
                  className='secion-boton-pregunta' 
                  variant="text" 
                  onClick={onNavigateToLogin}>
                  Inicia Sesión
                </Button>
              </Typography>
            )}
          </Box>
        </Card>
      </Stack>

      {/* --- AÑADIDO: Componente Dialog para los Términos y Condiciones --- */}
      <Dialog
        className='modal-contenedor'
        open={openTermsModal} onClose={handleCloseTerms} 
        scroll="paper">
        <DialogTitle>Términos y Condiciones de Uso</DialogTitle>
        <DialogContent dividers={true}>
          {/* ▼▼▼ 2. REEMPLAZA EL CONTENIDO ANTERIOR POR ESTO ▼▼▼ */}
          <DialogContentText component="div" tabIndex={-1}>
            <TermsAndConditions />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button  onClick={handleCloseTerms}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}