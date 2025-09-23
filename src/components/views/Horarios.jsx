import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format, parseISO } from 'date-fns';
import esLocale from '@fullcalendar/core/locales/es';
import TablaHorarios from '../admin/components/TablaHorarios'; // Importaremos la tabla que crearemos después
import '../../css/adminCss/Modal.css'; // Un CSS simple para el modal

// Datos de ejemplo
const horariosIniciales = [
    { id: 1, fecha: format(new Date(), 'yyyy-MM-dd'), horaInicio: '09:00', horaFin: '12:00' },
    { id: 2, fecha: format(new Date(), 'yyyy-MM-dd'), horaInicio: '14:00', horaFin: '17:00' },
];

function ConfiguradorHorarios() {
    const [todosLosHorarios, setTodosLosHorarios] = useState(horariosIniciales);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Estados para el modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [horarioActual, setHorarioActual] = useState(null); // Para edición o creación

    // Formateamos la fecha seleccionada para filtrar
    const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');

    // Filtramos los horarios para mostrar solo los del día seleccionado
    const horariosDelDia = useMemo(() => {
        return todosLosHorarios
            .filter(h => h.fecha === formattedSelectedDate)
            .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
    }, [todosLosHorarios, formattedSelectedDate]);
    
    // Creamos "eventos" para FullCalendar para marcar los días con horarios
    const calendarEvents = useMemo(() => {
        const fechasConHorarios = [...new Set(todosLosHorarios.map(h => h.fecha))];
        return fechasConHorarios.map(fecha => ({
            title: 'Disponible',
            start: fecha,
            allDay: true,
            display: 'background' // Muestra como un fondo de color
        }));
    }, [todosLosHorarios]);

    // --- MANEJO DEL MODAL ---
    const handleOpenModal = (horario = null) => {
        if (horario) {
            // Editando un horario existente
            setHorarioActual(horario);
        } else {
            // Creando un nuevo horario
            setHorarioActual({ fecha: formattedSelectedDate, horaInicio: '', horaFin: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setHorarioActual(null);
    };
    
    const handleSave = () => {
        if (!horarioActual.horaInicio || !horarioActual.horaFin) {
            alert('Por favor, define la hora de inicio y fin.');
            return;
        }

        if (horarioActual.id) {
            // Actualizar
            setTodosLosHorarios(todosLosHorarios.map(h => h.id === horarioActual.id ? horarioActual : h));
        } else {
            // Crear
            const nuevoHorario = { ...horarioActual, id: new Date().getTime() };
            setTodosLosHorarios([...todosLosHorarios, nuevoHorario]);
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este bloque horario?')) {
            setTodosLosHorarios(todosLosHorarios.filter(h => h.id !== id));
        }
    };
    
    return (
        <div className="configurador-container p-4">
            <h2 className="mb-4">Configurador de Horarios Disponibles</h2>
            <div className="calendario-card mb-4">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale={esLocale}
                    events={calendarEvents}
                    dateClick={(info) => setSelectedDate(info.date)} // Al hacer clic en un día, se actualiza la fecha
                    height="60vh"
                />
            </div>

            <TablaHorarios
                fecha={selectedDate}
                horarios={horariosDelDia}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                onAddNew={() => handleOpenModal(null)}
            />

            {/* Modal para añadir/editar */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{horarioActual.id ? 'Editar Bloque Horario' : 'Añadir Nuevo Bloque'}</h3>
                        <p>Para el día: <strong>{format(parseISO(horarioActual.fecha), 'dd/MM/yyyy')}</strong></p>
                        <div className="form-group">
                            <label>Hora de Inicio</label>
                            <input
                                type="time"
                                className="form-control"
                                value={horarioActual.horaInicio}
                                onChange={(e) => setHorarioActual({ ...horarioActual, horaInicio: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hora de Fin</label>
                            <input
                                type="time"
                                className="form-control"
                                value={horarioActual.horaFin}
                                onChange={(e) => setHorarioActual({ ...horarioActual, horaFin: e.target.value })}
                            />
                        </div>
                        <div className="modal-actions mt-3">
                            <button className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ConfiguradorHorarios;