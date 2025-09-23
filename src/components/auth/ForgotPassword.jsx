import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { sendPasswordResetEmail } from 'firebase/auth';
import '../../css/authCss/ForgotPasswird.css';

const ForgotPasswordModal = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Se ha enviado un correo electrónico para restablecer tu contraseña. Revisa tu bandeja de entrada.');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <Dialog className='dialog' open={open} onClose={onClose}>
      <DialogTitle className='ttituloDial'>Restablecer contraseña</DialogTitle>
      <DialogContent className='cuerpoDial'>
        <DialogContentText className='textoDial'>
          Ingrese la dirección de correo electrónico de su cuenta y le enviaremos un enlace para restablecer su contraseña.
        </DialogContentText>
        <TextField
          className='inputDial'
          autoFocus
          margin="dense"
          id="email-reset"
          label="Dirección de correo electrónico"
          type="email"
          fullWidth
          variant="standard"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {message && <p>{message}</p>}
      </DialogContent>
      <DialogActions className='accionesDial'>
        <Button className='botonDialog' onClick={onClose}>Cancelar</Button>
        <Button className='botonDialog' onClick={handlePasswordReset}>Continuar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordModal;