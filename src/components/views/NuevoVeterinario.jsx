/* ==========================================
    IMPORTS
   ========================================== */
// React y Hooks
import React, { useState } from 'react';

// Componentes de Material-UI
import {
  Box, Button, TextField, Grid, CircularProgress, InputAdornment
} from '@mui/material';

// Iconos
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SchoolIcon from '@mui/icons-material/School';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import SaveIcon from '@mui/icons-material/Save';

// Importaciones de Firebase
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/* ==========================================
    DEFINICIÓN DEL COMPONENTE: NuevoVeterinario
   ========================================== */
// --- MODIFICADO: El componente ahora acepta props ---
const NuevoVeterinario = ({ onClose, onVetAdded }) => {

  // --- Estados para los campos del formulario ---
  const [name, setName] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Manejador del envío del formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const nuevoVeterinario = {
      name,
      especialidad,
      email,
      telefono,
      role: 'vet',
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "users"), nuevoVeterinario);
      console.log("Veterinario guardado con ID: ", docRef.id);
      
      // --- MODIFICADO: Llama a la función del padre para actualizar la tabla ---
      onVetAdded({ id: docRef.id, ...nuevoVeterinario });
      onClose(); // Cierra el modal a través de la función del padre

    } catch (error) {
      console.error("Error al guardar el veterinario: ", error);
      setIsSubmitting(false);
    }
  };

  return (
    // El formulario ahora se renderiza directamente, sin Paper o título aquí
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2} sx={{ mt: 1, p: 2 }}>
        <Grid item xs={12}>
          <TextField label="Nombre Completo" fullWidth value={name} onChange={(e) => setName(e.target.value)} required InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon /></InputAdornment>) }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Especialidad" fullWidth value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} required InputProps={{ startAdornment: (<InputAdornment position="start"><SchoolIcon /></InputAdornment>) }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Número de Teléfono" type="tel" fullWidth value={telefono} onChange={(e) => setTelefono(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneOutlinedIcon /></InputAdornment>) }} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Correo Electrónico" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required InputProps={{ startAdornment: (<InputAdornment position="start"><EmailOutlinedIcon /></InputAdornment>) }} />
        </Grid>
      </Grid>
      
      {/* --- Los botones ahora están fuera del Grid, para ser usados en DialogActions --- */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: '16px 24px' }}>
        <Button onClick={onClose} color="secondary" sx={{ mr: 2 }}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}>
          {isSubmitting ? 'Guardando...' : 'Guardar Veterinario'}
        </Button>
      </Box>
    </Box>
  );
};

export default NuevoVeterinario;