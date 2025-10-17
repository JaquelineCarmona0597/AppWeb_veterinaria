import React, { useState, useEffect } from 'react';
import {
    Box, Button, TextField, Grid, CircularProgress, InputAdornment, DialogContent,
    DialogActions, FormControl, InputLabel, Select, MenuItem, Typography
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SchoolIcon from '@mui/icons-material/School';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import SaveIcon from '@mui/icons-material/Save';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { db } from '../../firebase';
import { doc, updateDoc } from "firebase/firestore";
import '../../css/adminCss/editarempeladi.css';

// CAMBIO: Renombramos el componente y las props
const EditarEmpleado = ({ empleadoData, onClose, onEmpleadoActualizado }) => {
    
    // --- ESTADO DEL FORMULARIO ---
    const [formData, setFormData] = useState({
        nombre: '',
        rol: '', // <-- AÑADIDO: Estado para el rol
        especialidad: '',
        correo: '',
        telefono: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // --- EFECTO PARA RELLENAR EL FORMULARIO ---
    useEffect(() => {
        if (empleadoData) {
            setFormData({
                nombre: empleadoData.nombre || '',
                rol: empleadoData.rol || 'vet', // <-- AÑADIDO: Se rellena el rol
                especialidad: empleadoData.especialidad || '',
                correo: empleadoData.correo || '',
                telefono: empleadoData.telefono || ''
            });
        }
    }, [empleadoData]);

    // --- LÓGICA DE VALIDACIÓN ---
    const validate = () => {
        let tempErrors = {};
        if (!formData.nombre.trim()) tempErrors.nombre = "El nombre es obligatorio.";
        if (!formData.correo) tempErrors.correo = "El correo es obligatorio.";
        else if (!/\S+@\S+\.\S+/.test(formData.correo)) tempErrors.correo = "Formato de correo inválido.";
        
        // CAMBIO: La especialidad solo es obligatoria si el rol es 'vet'
        if (formData.rol === 'vet' && !formData.especialidad) {
            tempErrors.especialidad = "La especialidad es obligatoria para veterinarios.";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    
    // --- MANEJADORES DE EVENTOS ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRolChange = (e) => {
        const newRole = e.target.value;
        setFormData(prev => ({
            ...prev,
            rol: newRole,
            // Si el nuevo rol no es 'vet', limpiamos la especialidad
            especialidad: newRole !== 'vet' ? '' : prev.especialidad
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!empleadoData || !validate()) return;
        
        setIsSubmitting(true);
        try {
            const empleadoDocRef = doc(db, 'usuarios', empleadoData.id);
            // Creamos un objeto limpio para actualizar, sin campos vacíos innecesarios
            const dataToUpdate = {
                ...formData,
                especialidad: formData.rol === 'vet' ? formData.especialidad : '' // Asegura que especialidad esté vacía si no es vet
            };

            await updateDoc(empleadoDocRef, dataToUpdate);
            onEmpleadoActualizado({ ...empleadoData, ...dataToUpdate });
            onClose();
        } catch (error) {
            console.error("Error al actualizar el empleado: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
        className='contenedor-edit'
        component="form" onSubmit={handleSubmit} noValidate>
            <DialogContent className='modalmm'>
                <Grid container className='gird-container'>
                    {/* --- CAMPO: ROL --- */}
                    <Grid className='gird-campo'>
                        <FormControl className='formulairo-edit' required>
                            <InputLabel className='rolempledao' id="rol-select-label">Rol del Empleado</InputLabel>
                            <Select
                                className='selector'
                                labelId="rol-select-label"
                                name="rol"
                                value={formData.rol}
                                label="Rol del Empleado"
                                onChange={handleRolChange}
                                startAdornment={<InputAdornment position="start"><SupervisorAccountIcon /></InputAdornment>}
                            >
                                <MenuItem className='menu-item' value="vet">Veterinario</MenuItem>
                                <MenuItem className='menu-item' value="recepcionista">Recepcionista</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    {/* --- CAMPO: NOMBRE --- */}
                    <Grid className='camponombre' >
                        <TextField className='nombreedit' name="nombre" label="Nombre Completo" fullWidth value={formData.nombre} onChange={handleChange} required error={!!errors.nombre} helperText={errors.nombre} InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon /></InputAdornment>) }} />
                    </Grid>

                    {/* --- CAMPO CONDICIONAL: ESPECIALIDAD --- */}
                    {formData.rol === 'vet' && (
                        <Grid className='campoespecialidad'>
                            <FormControl className='especialidad-edit' required error={!!errors.especialidad}>
                                <InputLabel className='labeledit' id="especialidad-select-label">Especialidad</InputLabel>
                                <Select className='select' labelId="especialidad-select-label" name="especialidad" value={formData.especialidad} label="Especialidad" onChange={handleChange} startAdornment={<InputAdornment position="start"><SchoolIcon /></InputAdornment>}>
                                    <MenuItem className='menu-item' value="General">General</MenuItem>
                                    <MenuItem className='menu-item' value="Urgencias">Urgencias</MenuItem>
                                    <MenuItem className='menu-item' value="Cirugía">Cirugía</MenuItem>
                                </Select>
                                {errors.especialidad && <Typography variant="caption" color="error" sx={{ ml: 2, mt: 1 }}>{errors.especialidad}</Typography>}
                            </FormControl>
                        </Grid>
                    )}
                    
                    {/* --- CAMPO: TELÉFONO --- */}
                    <Grid item  sm={formData.rol === 'vet' ? 6 : 12}>
                        <TextField className='telefonoedit' name="telefono" label="Número de Teléfono" type="tel" fullWidth value={formData.telefono} onChange={handleChange} />
                    </Grid>

                    {/* --- CAMPO: CORREO --- */}
                    <Grid item >
                        <TextField className='correoedit' name="correo" label="Correo Electrónico" type="email" fullWidth value={formData.correo} onChange={handleChange} required error={!!errors.correo} helperText={errors.correo} InputProps={{ startAdornment: (<InputAdornment position="start"><EmailOutlinedIcon /></InputAdornment>) }} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions className='action'>
                <Button className='botoncance' onClick={onClose}>Cancelar</Button>
                <Button className='guardarcambiso' type="submit" variant="contained" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}>
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </DialogActions>
        </Box>
    );
};

export default EditarEmpleado;