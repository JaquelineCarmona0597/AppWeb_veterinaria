import React, { useState, useEffect } from 'react';

// --- AÑADIDO: Nuevos componentes para el selector ---
import { 
  Box, Button, TextField, Grid, CircularProgress, InputAdornment, DialogContent, 
  DialogActions, FormControl, InputLabel, Select, MenuItem, Typography 
} from '@mui/material';

import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SchoolIcon from '@mui/icons-material/School';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { db } from '../../firebase';
import { doc, updateDoc } from "firebase/firestore";

const EditarVeterinario = ({ vetData, onClose, onVetUpdated }) => {
  // --- MODIFICADO: Estado para los datos del formulario con los nombres correctos ---
  const [formData, setFormData] = useState({ nombre: '', especialidad: '', correo: '', telefono: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- AÑADIDO: Estado para los errores de validación ---
  const [errors, setErrors] = useState({});

  // Efecto para rellenar el formulario cuando los datos del veterinario lleguen
  useEffect(() => {
    if (vetData) {
      // --- MODIFICADO: Usa los nombres de campo correctos de la BD ---
      setFormData({
        nombre: vetData.nombre || '',
        especialidad: vetData.especialidad || '',
        correo: vetData.correo || '',
        telefono: vetData.telefono || ''
      });
    }
  }, [vetData]);

  // --- AÑADIDO: Lógica de validación final (para el envío) ---
  const validate = () => {
    let tempErrors = {};
    if (!formData.nombre.trim()) tempErrors.nombre = "El nombre es obligatorio.";
    if (!formData.correo) tempErrors.correo = "El correo es obligatorio.";
    else if (!/\S+@\S+\.\S+/.test(formData.correo)) tempErrors.correo = "Formato de correo inválido.";
    if (formData.telefono && !/^\d{10}$/.test(formData.telefono)) tempErrors.telefono = "El teléfono debe tener 10 dígitos.";
    if (!formData.especialidad) tempErrors.especialidad = "Debes seleccionar una especialidad.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // --- AÑADIDO: Manejadores con validación en tiempo real ---
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setFormData(prev => ({ ...prev, nombre: value }));
      if (errors.nombre) setErrors(prev => ({ ...prev, nombre: '' }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, correo: value }));
    if (!/\S+@\S+\.\S+/.test(value) && value) {
      setErrors(prev => ({ ...prev, correo: 'Formato de correo inválido.' }));
    } else {
      setErrors(prev => ({ ...prev, correo: '' }));
    }
  };

  const handleTelefonoChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setFormData(prev => ({ ...prev, telefono: value }));
      if (value.length > 0 && value.length < 10) {
        setErrors(prev => ({ ...prev, telefono: 'El teléfono debe tener 10 dígitos.' }));
      } else {
        setErrors(prev => ({ ...prev, telefono: '' }));
      }
    }
  };
  
  const handleEspecialidadChange = (e) => {
    setFormData(prev => ({...prev, especialidad: e.target.value}));
    if (errors.especialidad) setErrors(prev => ({...prev, especialidad: ''}));
  }

  // Manejador para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vetData || !validate()) return;
    
    setIsSubmitting(true);
    try {
      // --- MODIFICADO: Apunta a la colección 'usuarios' ---
      const vetDocRef = doc(db, 'usuarios', vetData.id);
      await updateDoc(vetDocRef, formData);
      
      onVetUpdated({ ...vetData, ...formData });
      onClose();
    } catch (error) {
      console.error("Error al actualizar el veterinario: ", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <DialogContent sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            {/* --- MODIFICADO: Atributos 'name', 'value' y 'onChange' actualizados --- */}
            <TextField name="nombre" label="Nombre Completo" fullWidth value={formData.nombre} onChange={handleNameChange} required error={!!errors.nombre} helperText={errors.nombre} InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon /></InputAdornment>) }} />
          </Grid>

          {/* --- MODIFICADO: Campo de Especialidad ahora es un Selector --- */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.especialidad}>
              <InputLabel id="especialidad-select-label">Especialidad</InputLabel>
              <Select labelId="especialidad-select-label" name="especialidad" value={formData.especialidad} label="Especialidad" onChange={handleEspecialidadChange} startAdornment={<InputAdornment position="start"><SchoolIcon /></InputAdornment>}>
                <MenuItem value="General">General</MenuItem>
                <MenuItem value="Urgencias">Urgencias</MenuItem>
                <MenuItem value="Cirugía">Cirugía</MenuItem>
              </Select>
              {errors.especialidad && <Typography variant="caption" color="error" sx={{ ml: 2 }}>{errors.especialidad}</Typography>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField name="telefono" label="Número de Teléfono" type="tel" fullWidth value={formData.telefono} onChange={handleTelefonoChange} error={!!errors.telefono} helperText={errors.telefono} InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneOutlinedIcon /></InputAdornment>) }} />
          </Grid>
          <Grid item xs={12}>
            <TextField name="correo" label="Correo Electrónico" type="email" fullWidth value={formData.correo} onChange={handleEmailChange} required error={!!errors.correo} helperText={errors.correo} InputProps={{ startAdornment: (<InputAdornment position="start"><EmailOutlinedIcon /></InputAdornment>) }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting || Object.values(errors).some(e => e)} startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}>
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default EditarVeterinario;