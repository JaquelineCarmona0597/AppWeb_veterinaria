// 1. IMPORTACIONES
// -----------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from '../../context/AuthContext';
// <-- AÑADIDO: Componentes para el Dialog (Modal) ---
import { Box, Button, Card, Checkbox, CssBaseline, Divider, FormControlLabel, IconButton, InputAdornment, Link, Stack, TextField, Typography, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { PersonOutline as PersonOutlineIcon, LockOutlined as LockOutlinedIcon, MailOutline as MailOutlineIcon, Visibility, VisibilityOff, CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import TermsAndConditions from '../views/TermsAndConditions';

// 2. COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------
export default function SignUp() {
  // --- Estados del Componente ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { refreshUserData } = useAuth();
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
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('invite');
  const [inviteData, setInviteData] = useState(null);
  const [inviteStatus, setInviteStatus] = useState('none'); // 'none' | 'loading' | 'found' | 'notfound' | 'used'

  useEffect(() => {
    // Si hay token de invitación, intentamos leerlo
    const fetchInvite = async () => {
      if (!inviteToken) return;
      setInviteStatus('loading');
      try {
        const inviteRef = doc(db, 'invitations', inviteToken);
        const snap = await getDoc(inviteRef);
        if (snap.exists()) {
          const data = snap.data();
          setInviteData(data);
          if (data.used) {
            setInviteStatus('used');
          } else {
            setInviteStatus('found');
          }
          // Prellenar campos si vienen en la invitación
          if (data.email) setEmail(data.email);
          if (data.nombre) setName(data.nombre);
        } else {
          console.warn('Token de invitación no encontrado:', inviteToken);
          setInviteStatus('notfound');
        }
      } catch (err) {
        console.error('Error al leer invitación:', err);
        setInviteStatus('notfound');
      }
    };
    fetchInvite();
  }, [inviteToken]);

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
    // Si venimos con token de invitación, asegurarnos que fue encontrado y no usado
    if (inviteToken && inviteStatus !== 'found') {
      setEmailError('Invitación inválida, usada o no encontrada. Pide al administrador que reenvíe la invitación.');
      return;
    }

    if (!validate()) return; 

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  // Determinar rol: si vino de una invitación usamos ese rol
  const assignedRole = inviteData?.rol || 'cliente';

      await setDoc(doc(db, "usuarios", user.uid), {
        id: user.uid,
        nombre: name,
        correo: user.email,
        rol: assignedRole,
        telefono: "",
        fechaCreacion: serverTimestamp()
      });
      console.log('Usuario guardado en Firestore usuarios/', user.uid, 'con rol', assignedRole);

      // Si fue por invitación, marcarla como usada
      if (inviteToken) {
        try {
          const inviteRef = doc(db, 'invitations', inviteToken);
          await updateDoc(inviteRef, { used: true, usedBy: user.uid, usedAt: serverTimestamp() });
          setInviteStatus('used');
        } catch (err) {
          console.error('No se pudo marcar la invitación como usada:', err);
        }
      }
      
      // 2. Justo después de guardar los datos, le decimos al contexto que los vuelva a leer
      await refreshUserData(user);

      // 3. Navegar según el rol asignado (evita enviar personal al dashboard de clientes)
      if (assignedRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (assignedRole === 'vet' || assignedRole === 'recepcionista') {
        navigate('/staff/dashboard');
      } else {
        navigate('/dashboard');
      }

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
                Crea tu cuenta
            </Typography>
          </Box>
          <Box 
          className='Formulario-secion' 
          component="form" onSubmit={handleSubmit} noValidate>
            {/* ... Campos de texto para nombre, email, contraseña ... (sin cambios) */}
            <TextField className='secion-inputs' label="Nombre Completo" placeholder="Ej: Nombres Apellidos" value={name} onChange={handleNameChange} error={!!nameError} helperText={nameError} required fullWidth variant="outlined" InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon color="action" /></InputAdornment>), }} />
            <TextField className='secion-inputs' label="Email" type="email" placeholder="tu@email.com" value={email} onChange={handleEmailChange} error={!!emailError} helperText={emailError} required fullWidth variant="outlined" InputProps={{ startAdornment: (<InputAdornment position="start"><MailOutlineIcon color="action" /></InputAdornment>), }} />
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