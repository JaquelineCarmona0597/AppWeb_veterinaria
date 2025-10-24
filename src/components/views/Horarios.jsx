import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, TextField, Chip, CircularProgress, Alert } from '@mui/material';
import moment from 'moment';
// Importamos el locale de español para moment
import 'moment/locale/es';
import '../../css/authCss/gestionarcitas.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

// --- CAMBIO: Importaciones de Firestore ---
import { db } from '../../firebase'; // Ajusta esta ruta a tu archivo de config
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Establecemos el idioma español de forma global para moment
moment.locale('es');

// --- CAMBIO: Función para generar los slots ---
/**
 * Genera un array de slots de tiempo en intervalos de 30 minutos.
 * @param {string} inicio - Hora de inicio (ej. "09:00")
 * @param {string} fin - Hora de fin (ej. "15:00")
 * @returns {string[]} - Array de slots (ej. ["09:00", "09:30", ..., "14:30"])
 */
const generarSlots = (inicio, fin) => {
  const slots = [];
  let actual = moment(inicio, 'HH:mm');
  const final = moment(fin, 'HH:mm');

  // Bucle mientras la hora actual sea ANTERIOR a la hora final
  while (actual.isBefore(final)) {
    slots.push(actual.format('HH:mm'));
    actual.add(30, 'minutes'); // Añade 30 minutos para el siguiente slot
  }
  return slots;
};

function GestionCitasRecepcionista() {
  
  // --- Estados para el día seleccionado y los horarios ---
  const [selectedDate, setSelectedDate] = useState(moment());
  // Este estado guardará los SLOTS (ej. ["09:00", "09:30"])
  const [slotsDelDia, setSlotsDelDia] = useState([]);
  
  // Estados para el formulario de añadir bloques
  const [newInicio, setNewInicio] = useState('09:00');
  const [newFin, setNewFin] = useState('12:00');

  // --- CAMBIO: Estados de carga y feedback ---
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '', severity: 'success' });

  // --- CAMBIO: Cargar datos de Firestore al cambiar la fecha ---
  useEffect(() => {
    const cargarHorariosDelDia = async () => {
      setIsLoading(true);
      const dateStr = selectedDate.format('YYYY-MM-DD');
      const docRef = doc(db, 'disponibilidad', dateStr);
      
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // Si el documento existe, cargamos los horarios guardados
          setSlotsDelDia(docSnap.data().horarios || []);
        } else {
          // Si no existe, reseteamos los horarios
          setSlotsDelDia([]);
        }
      } catch (error) {
        console.error("Error al cargar horarios: ", error);
        setAlertInfo({ open: true, message: 'Error al cargar los horarios.', severity: 'error' });
      }
      setIsLoading(false);
    };

    cargarHorariosDelDia();
  }, [selectedDate]); // Se ejecuta cada vez que 'selectedDate' cambia

  // --- CAMBIO: Lógica para AÑADIR SLOTS (generados desde un bloque) ---
  const handleAddBloque = () => {
    if (!newInicio || !newFin) return;

    if (moment(newFin, 'HH:mm').isSameOrBefore(moment(newInicio, 'HH:mm'))) {
      setAlertInfo({ open: true, message: 'La hora de fin debe ser posterior a la hora de inicio.', severity: 'warning' });
      return;
    }

    // Generamos los slots a partir del bloque
    const nuevosSlots = generarSlots(newInicio, newFin);
    
    // Usamos un Set para evitar duplicados y luego convertimos a array y ordenamos
    const slotsActualizados = [...new Set([...slotsDelDia, ...nuevosSlots])].sort();
    
    setSlotsDelDia(slotsActualizados);
    setAlertInfo({ open: true, message: `Slots de ${newInicio} a ${newFin} añadidos.`, severity: 'success' });
  };

  // --- CAMBIO: Lógica para ELIMINAR un slot individual ---
  const handleRemoveSlot = (slotToRemove) => {
    setSlotsDelDia(prevSlots => prevSlots.filter(slot => slot !== slotToRemove));
  };

  // --- CAMBIO: Lógica para GUARDAR los slots en Firestore ---
  const handleSaveToFirestore = async () => {
    setIsSaving(true);
    const dateStr = selectedDate.format('YYYY-MM-DD');
    const docRef = doc(db, 'disponibilidad', dateStr);

    try {
      // Guardamos el documento con los slots actuales.
      // Si el array de slots está vacío, se guardará un array vacío.
      await setDoc(docRef, { 
        horarios: slotsDelDia,
        fecha: selectedDate.toDate() // Guardamos también la fecha como Timestamp
      });
      setAlertInfo({ open: true, message: `Horarios para el ${dateStr} guardados con éxito.`, severity: 'success' });
    } catch (error) {
      console.error("Error al guardar en Firestore: ", error);
      setAlertInfo({ open: true, message: 'Error al guardar. Inténtalo de nuevo.', severity: 'error' });
    }
    setIsSaving(false);
  };

  // --- Renderizado del componente ---
  return (
    // Proveedor de localización con el adapterLocale="es"
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
      <Box className='contenedordisponivilidadcitas'>
        <Typography className='Titulo'>Gestión de Disponibilidad</Typography>

        {/* --- Panel de selección de fecha y gestión de horarios --- */}
        <Paper className='configurarhoras' >
          
          {/* Columna del Calendario */}
          <Box  className='columnacalendario'>
            <Typography className='selecionardia' >Selecciona un Día</Typography>
            {/* El adapterLocale="es" de arriba se encarga de traducir este calendario */}
            <DateCalendar
              className='calendario'
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              // Deshabilitamos días pasados
              shouldDisableDate={(day) => day.isBefore(moment().startOf('day'))}
            />
          </Box>

          {/* Columna de gestión de horas para el día seleccionado */}
          <Box className='gestiondehorarios'>
            <Typography className='Titulo' gutterBottom>
              {/* Esta línea usa el locale 'es' de moment para el formato */}
              Configurar Horarios para: <strong>{selectedDate.format('dddd, D [de] MMMM')}</strong>
            </Typography>

            {/* Formulario para añadir bloques */}
            <Paper variant="outlined" className='formularioañadirbloque' >
              <Typography variant="subtitle1" gutterBottom>Añadir bloque de 30 min</Typography>
              <Box className='formulario'>
                <TextField
                  className='hora'
                  label="Hora Inicio"
                  type="time"
                  value={newInicio}
                  onChange={(e) => setNewInicio(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  className='hora'
                  label="Hora Fin"
                  type="time"
                  value={newFin}
                  onChange={(e) => setNewFin(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <Button className='añadirbloque' variant="contained" onClick={handleAddBloque}>
                  Añadir Slots
                </Button>
              </Box>
            </Paper>

            {/* Visualización de los slots generados */}
            <Typography className='Titulo'>
              Slots Disponibles ({slotsDelDia.length})
            </Typography>
            <Paper variant="outlined" className='visualizacionhorarios' >
              {isLoading ? (
                <CircularProgress />
              ) : (
                <Box className='contenedrodedias'>
                  {slotsDelDia.length === 0 ? (
                    <Typography className='alertanohayslots'>No hay slots definidos para este día.</Typography>
                  ) : (
                    slotsDelDia.map((slot, idx) => (
                      <Chip
                        className='chips'
                        key={idx}
                        label={slot}
                        onDelete={() => handleRemoveSlot(slot)}
                      />
                    ))
                  )}
                </Box>
              )}
            </Paper>

            {/* Botón de Guardar en Firestore */}
            <Button
              className='boton-guardar'
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSaveToFirestore}
              // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
              disabled={isSaving || isLoading || slotsDelDia.length === 0}
            >
              {isSaving ? <CircularProgress size={24} /> : `Guardar Cambios para el ${selectedDate.format('D/MM')}`}
            </Button>

            {/* Alerta de Feedback */}
            {alertInfo.open && (
              <Alert 
                className='alerta'
                severity={alertInfo.severity} 
                onClose={() => setAlertInfo({ ...alertInfo, open: false })}
            
              >
                {alertInfo.message}
              </Alert>
            )}
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}

export default GestionCitasRecepcionista;