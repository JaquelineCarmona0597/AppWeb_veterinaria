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
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'; // Icono para el Rol
import { db } from '../../firebase';
import '../../css/adminCss/NuevoEmpleado.css';
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

// CAMBIO: Renombramos el componente y la prop para mayor claridad
const NuevoEmpleado = ({ onClose, onEmpleadoAgregado }) => {
    // --- ESTADO DEL COMPONENTE ---
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [rol, setRol] = useState('vet'); // <-- AÑADIDO: Estado para el rol, por defecto 'vet'
    const [especialidad, setEspecialidad] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // --- LÓGICA DE VALIDACIÓN ---
    const validate = () => {
        let tempErrors = {};
        if (!nombre.trim()) tempErrors.nombre = "El nombre es obligatorio.";
        if (!email) tempErrors.email = "El correo es obligatorio.";
        else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "El formato del correo no es válido.";
        if (telefono && !/^\d{10}$/.test(telefono)) tempErrors.telefono = "El teléfono debe tener 10 dígitos.";
        
        // CAMBIO: La especialidad solo es obligatoria si el rol es 'vet'
        if (rol === 'vet' && !especialidad) {
            tempErrors.especialidad = "La especialidad es obligatoria para veterinarios.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // --- MANEJADORES DE EVENTOS ---
    const handleRolChange = (e) => {
        const newRole = e.target.value;
        setRol(newRole);
        // Si el rol cambia a recepcionista, limpiamos la especialidad
        if (newRole === 'recepcionista') {
            setEspecialidad('');
            setErrors(prev => ({ ...prev, especialidad: '' })); // Limpiar error si existía
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        const newEmpleadoRef = doc(collection(db, "usuarios"));
        
        // CAMBIO: El objeto a guardar ahora es dinámico
        const nuevoEmpleado = {
            id: newEmpleadoRef.id,
            nombre,
            correo: email,
            telefono,
            rol, // <-- Se usa el estado del rol
            fechaCreacion: serverTimestamp(),
            // Se añade 'especialidad' solo si el rol es 'vet'
            ...(rol === 'vet' && { especialidad }),
        };

        try {
            await setDoc(newEmpleadoRef, nuevoEmpleado);
            onEmpleadoAgregado(nuevoEmpleado); // <-- Se usa la nueva prop
            onClose();
        } catch (error) {
            console.error("Error al guardar el empleado: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
        <Box
        className='contenedor-modal-nuevo-empleado'
        component="form" 
        onSubmit={handleSubmit} noValidate>
            <Grid container 
            className='selector-rol'
            >
                
                <Grid item 
                className='selector-rol-contenedor'
                >
                    <FormControl 
                    className='rol'
                    error={!!errors.rol}>
                        <InputLabel id="rol-select-label">Rol del Empleado</InputLabel>
                        <Select
                            labelId="rol-select-label"
                            value={rol}
                            label="Rol del Empleado"
                            onChange={handleRolChange}
                            startAdornment={<InputAdornment position="start"><SupervisorAccountIcon /></InputAdornment>}
                        >
                            <MenuItem className='menu-item' value="vet">Veterinario</MenuItem>
                            <MenuItem className='menu-item' value="recepcionista">Recepcionista</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                
                <Grid item 
                className='unput-nomnre'
                >
                    <TextField
                        className='secion-inputs'
                        label="Nombre Completo"
                        fullWidth
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon /></InputAdornment>) }}
                    />
                </Grid>

                {/* --- CAMPO CONDICIONAL: ESPECIALIDAD (SOLO PARA VETERINARIOS) --- */}
                {rol === 'vet' && (
                    <Grid item  
                    className='especialidad'
                    >
                        <FormControl 
                        className='especialidad-con'
                        error={!!errors.especialidad}>
                            <InputLabel id="especialidad-select-label">Especialidad</InputLabel>
                            <Select
                                className='selector'
                                labelId="especialidad-select-label"
                                value={especialidad}
                                label="Especialidad"
                                onChange={(e) => setEspecialidad(e.target.value)}
                                startAdornment={<InputAdornment position="start"><SchoolIcon /></InputAdornment>}
                            >
                                <MenuItem className='menu-item' value="General">General</MenuItem>
                                <MenuItem className='menu-item' value="Urgencias">Urgencias</MenuItem>
                                <MenuItem className='menu-item' value="Cirugía">Cirugía</MenuItem>
                            </Select>
                            {errors.especialidad && <Typography variant="caption" color="error" >{errors.especialidad}</Typography>}
                        </FormControl>
                    </Grid>
                )}

                {/* --- CAMPO: TELÉFONO --- */}
                <Grid item sm={rol === 'vet' ? 6 : 12}> {/* Ocupa todo el ancho si especialidad no está */}
                    <TextField
                        className='secion-inputs'
                        label="Número de Teléfono"
                        type="tel"
                        fullWidth
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        error={!!errors.telefono}
                        helperText={errors.telefono}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneOutlinedIcon /></InputAdornment>) }}
                    />
                </Grid>

                {/* --- CAMPO: CORREO --- */}
                <Grid item >
                    <TextField
                        className='secion-inputs'
                        label="Correo Electrónico"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><EmailOutlinedIcon /></InputAdornment>) }}
                    />
                </Grid>
            </Grid>
            <Box >
                <Button className='boton-can' onClick={onClose} >
                    Cancelar
                </Button>
                <Button
                    className='boton-guardar'
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress  /> : <SaveIcon />}
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Empleado'}
                </Button>
            </Box>
        </Box>
    );
};

export default NuevoEmpleado;