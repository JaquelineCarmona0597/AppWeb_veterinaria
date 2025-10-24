import React, { useState, useEffect } from 'react';
import { 
Box, Typography, Paper, TextField, Chip, CircularProgress, Alert,
Button, Select, MenuItem, FormControl, InputLabel 
} from '@mui/material';
import moment from 'moment';
import 'moment/locale/es';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { db } from '../../firebase'; // Ajusta la ruta a tu config
import { doc, getDoc, runTransaction, collection, serverTimestamp } from 'firebase/firestore';

// Importa el nuevo CSS
import '../../css/authCss/AgendarCitaInvitado.css'; 

moment.locale('es');

function AgendarCitaInvitado() {

// Estados (sin cambios)
const [selectedDate, setSelectedDate] = useState(moment());
const [slotsDelDia, setSlotsDelDia] = useState([]);
const [isLoadingSlots, setIsLoadingSlots] = useState(false);

const [slotSeleccionado, setSlotSeleccionado] = useState(null);
const [isBooking, setIsBooking] = useState(false);
const [formData, setFormData] = useState({
    nombrePropietario: '',
    telefonoPropietario: '',
    nombreMascota: '',
    tipoCita: 'Consulta General',
    observaciones: ''
});

const [alertInfo, setAlertInfo] = useState({ open: false, message: '', severity: 'success' });

// Cargar slots (sin cambios)
useEffect(() => {
    const cargarHorariosDelDia = async () => {
    setIsLoadingSlots(true);
    setSlotSeleccionado(null);
    const dateStr = selectedDate.format('YYYY-MM-DD');
    const docRef = doc(db, 'disponibilidad', dateStr);
    
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        setSlotsDelDia(docSnap.data().horarios || []);
        } else {
        setSlotsDelDia([]);
        }
    } catch (error) {
        console.error("Error al cargar horarios: ", error);
        setAlertInfo({ open: true, message: 'Error al cargar los horarios.', severity: 'error' });
    }
    setIsLoadingSlots(false);
    };

    cargarHorariosDelDia();
}, [selectedDate]);

// --- CAMBIO: Manejador para el formulario con validaciones ---
const handleFormChange = (e) => {
    const { name, value } = e.target;

    // Expresiones regulares para validar
    const soloLetrasEspacios = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚüÜ]*$/; // Permite letras, espacios y acentos
    const soloNumeros = /^[0-9]*$/; // Permite solo números

    if (name === 'nombrePropietario' || name === 'nombreMascota') {
    // Si el valor es solo letras y espacios, actualiza el estado
    if (soloLetrasEspacios.test(value)) {
        setFormData({ ...formData, [name]: value });
    }
    // Si no, no hace nada (evita que se escriba el número)
    } else if (name === 'telefonoPropietario') {
    // Si es solo números Y tiene 10 dígitos o menos, actualiza
    if (soloNumeros.test(value) && value.length <= 10) {
        setFormData({ ...formData, [name]: value });
    }
    // Si no, no hace nada (evita letras o más de 10 números)
    } else {
    // Para otros campos (observaciones, tipoCita), actualiza normalmente
    setFormData({ ...formData, [name]: value });
    }
};

// Manejador para seleccionar un slot (sin cambios)
const handleSelectSlot = (slot) => {
    setSlotSeleccionado(slot);
    setAlertInfo({ open: false }); // Cierra cualquier alerta
};

// Limpiar formulario y selección (sin cambios)
const limpiarFormulario = () => {
    setFormData({
    nombrePropietario: '',
    telefonoPropietario: '',
    nombreMascota: '',
    tipoCita: 'Consulta General',
    observaciones: ''
    });
    setSlotSeleccionado(null);
};

// --- CAMBIO: Lógica para AGENDAR LA CITA con validación final ---
const handleConfirmarCita = async (e) => {
    e.preventDefault(); 
    
    // --- Validaciones al enviar ---
    const telefonoRegex = /^\d{10}$/; // RegEx para EXACTAMENTE 10 dígitos

    if (!slotSeleccionado) {
    setAlertInfo({ open: true, message: 'Por favor, selecciona un horario disponible.', severity: 'warning' });
    return;
    }
    if (!formData.nombrePropietario || !formData.telefonoPropietario || !formData.nombreMascota) {
    setAlertInfo({ open: true, message: 'Nombre, Teléfono y Mascota son obligatorios.', severity: 'warning' });
    return;
    }
    
    // NUEVA VALIDACIÓN: Comprueba el formato del teléfono
    if (!telefonoRegex.test(formData.telefonoPropietario)) {
    setAlertInfo({ open: true, message: 'El teléfono debe contener exactamente 10 números.', severity: 'warning' });
    return;
    }
    // --- Fin de validaciones ---

    setIsBooking(true);
    setAlertInfo({ open: false });

    const fechaDocId = selectedDate.format('YYYY-MM-DD');
    const dispoRef = doc(db, 'disponibilidad', fechaDocId);
    const nuevaCitaRef = doc(collection(db, 'citas'));

    try {
    // Transacción (sin cambios)
    await runTransaction(db, async (transaction) => {
        const dispoDoc = await transaction.get(dispoRef);
        if (!dispoDoc.exists()) throw new Error("Documento de disponibilidad no existe.");

        const horariosActuales = dispoDoc.data().horarios || [];
        const slotTodaviaExiste = horariosActuales.includes(slotSeleccionado);

        if (!slotTodaviaExiste) {
        throw new Error("Este horario ya no está disponible. Alguien más lo reservó. Refrescando...");
        }

        const nuevosHorarios = horariosActuales.filter(h => h !== slotSeleccionado);
        transaction.update(dispoRef, { horarios: nuevosHorarios });

        const fechaCitaCompleta = `${fechaDocId} ${slotSeleccionado}`;
        
        transaction.set(nuevaCitaRef, {
        nombrePropietario: formData.nombrePropietario.trim(), // Usamos .trim() para limpiar espacios
        telefonoPropietario: formData.telefonoPropietario,
        nombreMascota: formData.nombreMascota.trim(),
        tipoCita: formData.tipoCita,
        observaciones: formData.observaciones.trim(),
        fecha: fechaCitaCompleta,
        estado: 'Programada',
        doctor: 'Por asignar',
        fechaRegistro: serverTimestamp(),
        idPropietario: null, 
        idMascota: null,
        agendadoPor: 'Recepcion'
        });
    });
    
    setAlertInfo({ open: true, message: '¡Cita agendada con éxito!', severity: 'success' });
    
    setSlotsDelDia(prev => prev.filter(s => s !== slotSeleccionado));
    limpiarFormulario();

    } catch (error) {
    console.error("Error al agendar cita: ", error);
    setAlertInfo({ open: true, message: `Error: ${error.message}`, severity: 'error' });
    if (error.message.includes("disponible")) {
        // Esta lógica para recargar slots si estaba ocupado es muy buena
        const dateStr = selectedDate.format('YYYY-MM-DD');
        const docRef = doc(db, 'disponibilidad', dateStr);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        setSlotsDelDia(docSnap.data().horarios || []);
        } else {
        setSlotsDelDia([]);
        }
    }
    }
    setIsBooking(false);
};


return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
    <Box className="agendar-cita-container">
        
        <Paper className="columna-seleccion">
        <Typography variant="h5" className="columna-titulo">
            Seleccionar Fecha y Hora
        </Typography>
        
        {/* Conservamos tu estructura de clases */}
        <Box className="columnacalendario">
            <DateCalendar
            className='calendario'
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            shouldDisableDate={(day) => day.isBefore(moment().startOf('day'))}
            disableFuture={false}
            />
        </Box>
        
        <Typography variant="h6" className="slots-titulo">
            Horarios para el {selectedDate.format('dddd, D [de] MMMM')}
        </Typography>
        <Box className="slots-wrapper">
            {isLoadingSlots ? (
            <CircularProgress />
            ) : (
            <Box className="slots-grid">
                {slotsDelDia.length === 0 ? (
                <Typography className="slots-vacio">
                    No hay horarios definidos para este día.
                </Typography>
                ) : (
                slotsDelDia.map((slot) => (
                    <Chip
                    key={slot}
                    label={slot}
                    clickable
                    onClick={() => handleSelectSlot(slot)}
                    className={`slot-chip ${slot === slotSeleccionado ? 'selected' : ''}`}
                    />
                ))
                )}
            </Box>
            )}
        </Box>
        </Paper>

        <Paper 
        className="columna-formulario" 
        component="form" 
        onSubmit={handleConfirmarCita}
        >
        <Typography variant="h5" className="columna-titulo">
            Datos del Paciente
        </Typography>
        
        {slotSeleccionado && (
            <Alert severity="info" className="slot-seleccionado-info">
            Horario seleccionado: <strong>{slotSeleccionado}</strong>
            </Alert>
        )}

        {/* Conservamos tus clases CSS 'secion-inputs' */}
        <TextField
            className='secion-inputs'
            label="Nombre del Propietario"
            name="nombrePropietario"
            value={formData.nombrePropietario}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            required
            // Opcional: Propiedades de input para mejorar UX
            inputProps={{
            maxLength: 50 // Limitar la longitud total
            }}
        />
        <TextField
            className='secion-inputs'
            label="Teléfono del Propietario"
            name="telefonoPropietario"
            value={formData.telefonoPropietario}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            required
            type="tel" // 'type="tel"' ayuda en móviles
            inputProps={{
            inputMode: 'numeric', // Muestra teclado numérico en móviles
            pattern: '[0-9]*'
            }}
        />
        <TextField
            className='secion-inputs'
            label="Nombre de la Mascota"
            name="nombreMascota"
            value={formData.nombreMascota}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            required
            inputProps={{
            maxLength: 50
            }}
        />
        <FormControl className='secion-inputs' fullWidth margin="normal">
            <InputLabel>Tipo de Cita</InputLabel>
            <Select
            name="tipoCita"
            value={formData.tipoCita}
            label="Tipo de Cita"
            onChange={handleFormChange}
            >
            <MenuItem value="Consulta General">Consulta General</MenuItem>
            <MenuItem value="Vacunación">Vacunación</MenuItem>
            <MenuItem value="Desparasitación">Desparasitación</MenuItem>
            <MenuItem value="Curación">Curación</MenuItem>
            <MenuItem value="Otro">Otro</MenuItem>
            </Select>
        </FormControl>
        <TextField
            className='secion-inputs'
            label="Observaciones (Opcional)"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
            inputProps={{
            maxLength: 200 // Limitar observaciones
            }}
        />
        
        <Button
            type="submit"
            variant="contained"
            className="boton-guardar" // Tu clase de botón
            fullWidth
            disabled={isBooking || !slotSeleccionado}
        >
            {isBooking ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Cita'}
        </Button>
        
        {alertInfo.open && (
            <Alert 
            severity={alertInfo.severity} 
            onClose={() => setAlertInfo({ ...alertInfo, open: false })}
            className="alerta-formulario"
            >
            {alertInfo.message}
            </Alert>
        )}

        </Paper>
    </Box>
    </LocalizationProvider>
);
}

export default AgendarCitaInvitado;