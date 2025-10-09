/* ==========================================
    IMPORTS
   ========================================== */
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Grid, CircularProgress, InputAdornment, DialogContent, DialogActions } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SchoolIcon from '@mui/icons-material/School';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import SaveIcon from '@mui/icons-material/Save';

// Importaciones de Firebase para actualizar documentos
import { db } from '../../firebase';
import { doc, updateDoc } from "firebase/firestore";

/* ==========================================
    DEFINICIÓN DEL COMPONENTE: EditarVeterinario
   ========================================== */
const EditarVeterinario = ({ vetData, onClose, onVetUpdated }) => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({ name: '', especialidad: '', email: '', telefono: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect para rellenar el formulario cuando los datos del veterinario lleguen
  useEffect(() => {
    if (vetData) {
      setFormData({
        name: vetData.name || '',
        especialidad: vetData.especialidad || '',
        email: vetData.email || '',
        telefono: vetData.telefono || ''
      });
    }
  }, [vetData]); // Este efecto se ejecuta cada vez que vetData cambie

  // Manejador para actualizar el estado del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // Manejador para enviar el formulario actualizado
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vetData) return;
    setIsSubmitting(true);

    try {
      const vetDocRef = doc(db, 'users', vetData.id);
      await updateDoc(vetDocRef, formData);

      console.log("Veterinario actualizado exitosamente.");
      
      onVetUpdated({ id: vetData.id, ...vetData, ...formData }); // Pasamos los datos actualizados
      onClose();

    } catch (error) {
      console.error("Error al actualizar el veterinario: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogContent sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField name="name" label="Nombre Completo" fullWidth value={formData.name} onChange={handleChange} required InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon /></InputAdornment>) }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="especialidad" label="Especialidad" fullWidth value={formData.especialidad} onChange={handleChange} required InputProps={{ startAdornment: (<InputAdornment position="start"><SchoolIcon /></InputAdornment>) }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="telefono" label="Número de Teléfono" type="tel" fullWidth value={formData.telefono} onChange={handleChange} InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneOutlinedIcon /></InputAdornment>) }} />
          </Grid>
          <Grid item xs={12}>
            <TextField name="email" label="Correo Electrónico" type="email" fullWidth value={formData.email} onChange={handleChange} required InputProps={{ startAdornment: (<InputAdornment position="start"><EmailOutlinedIcon /></InputAdornment>) }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}>
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default EditarVeterinario;