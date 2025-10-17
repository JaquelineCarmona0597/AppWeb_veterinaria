/* ==========================================
   IMPORTS
   ========================================== */
// React y Hooks
import React, { useState } from 'react';

// Componentes de Material-UI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

// Servicios de Firebase
import { sendPasswordResetEmail } from 'firebase/auth';
// ¡CAMBIO 1: Importamos 'auth' directamente!
import { auth } from '../../firebase'; // <-- Asegúrate de que la ruta a tu archivo firebase.js sea correcta

// Estilos locales
import '../../css/authCss/ForgotPasswird.css';


/* ==========================================
   DEFINICIÓN DEL COMPONENTE
   ========================================== */
// ¡CAMBIO 2: Ya no necesitamos recibir 'auth' como prop!
const ForgotPasswordModal = ({ open, onClose }) => {
  
  /* ==========================================
     ESTADO DEL COMPONENTE
     ========================================== */
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); // Estado separado para errores

  
  /* ==========================================
     LÓGICA Y MANEJADORES DE EVENTOS
     ========================================== */
  const handlePasswordReset = async () => {
    // Limpiamos mensajes anteriores
    setMessage('');
    setError('');

    if (!email) {
      setError('Por favor, ingresa tu correo electrónico.');
      return;
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('¡Correo enviado! Revisa tu bandeja de entrada (y la carpeta de spam) para restablecer tu contraseña.');
    } catch (error) {
      console.error("Error al enviar correo de restablecimiento:", error.code);
      if (error.code === 'auth/user-not-found') {
        setError('No se encontró ninguna cuenta con ese correo electrónico.');
      } else {
        setError('Hubo un problema al enviar el correo. Inténtalo de nuevo.');
      }
    }
  };

  // Función para limpiar el estado cuando el modal se cierra
  const handleClose = () => {
    setMessage('');
    setError('');
    setEmail('');
    onClose();
  };

  
  /* ==========================================
     RENDERIZADO DEL COMPONENTE (JSX)
     ========================================== */
  return (
    <Dialog 
      className='modal-contenedor' 
      open={open} 
      onClose={handleClose} // Usamos la nueva función de cierre
    >
      <DialogTitle className='Titulo-modal'>
        Restablecer Contraseña
      </DialogTitle>

      <DialogContent className='cuermo-modal'>
        <DialogContentText className='texto-modal'>
          Ingresa el correo de tu cuenta y te enviaremos un enlace para que puedas crear una nueva contraseña.
        </DialogContentText>
        
        <TextField
          autoFocus
          fullWidth
          className='Formulario-secion'
          id="email-reset"
          label="Dirección de correo electrónico"
          margin="dense"
          type="email"
          variant="standard"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error} // El campo se marca en rojo si hay un error
        />
        
        {/* Mostramos los mensajes de estado con colores diferentes */}
        {message && <p className='mensaje-estado exito'>{message}</p>}
        {error && <p className='mensaje-estado error'>{error}</p>}
      </DialogContent>

      <DialogActions className='boton-contendeor'>
        <Button className='boton-modal' onClick={handleClose}>
          Cancelar
        </Button>
        <Button className='boton-modal' onClick={handlePasswordReset}>
          Enviar Correo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordModal;