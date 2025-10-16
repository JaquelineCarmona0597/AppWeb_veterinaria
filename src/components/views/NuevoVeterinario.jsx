import React, { useState } from 'react';
import {
    Box, Button, TextField, Grid, CircularProgress, InputAdornment,
    FormControl, InputLabel, Select, MenuItem, Typography
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SchoolIcon from '@mui/icons-material/School';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { db } from '../../firebase';
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

const NuevoVeterinario = ({ onClose, onVetAdded }) => {
    const [name, setName] = useState('');
    const [especialidad, setEspecialidad] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        if (!name.trim()) tempErrors.name = "El nombre completo es obligatorio.";
        else if (!/^[a-zA-Z\s]+$/.test(name)) tempErrors.name = "El nombre solo puede contener letras y espacios.";

        if (!email) tempErrors.email = "El correo electrónico es obligatorio.";
        else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "El formato del correo no es válido.";

        if (telefono && !/^\d{10}$/.test(telefono)) tempErrors.telefono = "El teléfono debe tener 10 dígitos.";

        if (!especialidad) tempErrors.especialidad = "Debes seleccionar una especialidad.";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setName(value);
            if (errors.name) {
                setErrors(prev => ({ ...prev, name: '' }));
            }
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (!/\S+@\S+\.\S+/.test(value) && value !== "") {
            setErrors(prev => ({ ...prev, email: 'El formato del correo no es válido.' }));
        } else {
            setErrors(prev => ({ ...prev, email: '' }));
        }
    };

    const handleTelefonoChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 10) {
            setTelefono(value);
            if (value.length !== 10 && value !== "") {
                setErrors(prev => ({ ...prev, telefono: 'El teléfono debe tener 10 dígitos.' }));
            } else {
                setErrors(prev => ({ ...prev, telefono: '' }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        const newVetRef = doc(collection(db, "usuarios"));
        const nuevoVeterinario = {
            id: newVetRef.id,
            nombre: name,
            especialidad,
            correo: email,
            telefono,
            rol: 'vet',
            fechaCreacion: serverTimestamp(),
        };

        try {
            await setDoc(newVetRef, nuevoVeterinario);
            onVetAdded(nuevoVeterinario);
            onClose();
        } catch (error) {
            console.error("Error al guardar el veterinario: ", error);
            setIsSubmitting(false);
        }
    };

  return (
        // 2. AÑADE LA CLASE PRINCIPAL AL CONTENEDOR
        <Box component="form" onSubmit={handleSubmit} noValidate className="vet-form-container">
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12}>
                    <TextField
                        label="Nombre Completo"
                        fullWidth
                        value={name}
                        onChange={handleNameChange}
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon /></InputAdornment>) }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required error={!!errors.especialidad}>
                        <InputLabel id="especialidad-select-label">Especialidad</InputLabel>
                        <Select
                            labelId="especialidad-select-label"
                            value={especialidad}
                            label="Especialidad"
                            onChange={(e) => setEspecialidad(e.target.value)}
                        >
                            <MenuItem value="General">General</MenuItem>
                            <MenuItem value="Urgencias">Urgencias</MenuItem>
                            <MenuItem value="Cirugía">Cirugía</MenuItem>
                        </Select>
                        {errors.especialidad && <Typography variant="caption" color="error" sx={{ ml: 2 }}>{errors.especialidad}</Typography>}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Número de Teléfono"
                        type="tel"
                        fullWidth
                        value={telefono}
                        onChange={handleTelefonoChange}
                        error={!!errors.telefono}
                        helperText={errors.telefono}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneOutlinedIcon /></InputAdornment>) }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Correo Electrónico"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={handleEmailChange}
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><EmailOutlinedIcon /></InputAdornment>) }}
                    />
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: '16px 24px' }}>
                {/* 3. APLICA LAS CLASES A LOS BOTONES */}
                <Button onClick={onClose} className="btn-secundario" sx={{ mr: 2 }}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    className="btn-primario"
                    disabled={isSubmitting || Object.values(errors).some(error => error !== '')}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Veterinario'}
                </Button>
            </Box>
        </Box>
    );
};

export default NuevoVeterinario;