/* ==========================================
   IMPORTS
   ========================================== */
import React, { useState } from 'react';
// Usaremos date-fns para manejar las horas de forma sencilla y segura
import { format, parse, addMinutes, isBefore } from 'date-fns';
import '../../css/authCss/Horarios.css'; // Reutilizamos y actualizamos el mismo CSS

/* ==========================================
   CONFIGURACIÓN INICIAL
   ========================================== */
const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DURACIONES = [15, 20, 30, 45, 60];

/* ==========================================
   DEFINICIÓN DEL COMPONENTE: GeneradorHorariosAvanzado
   ========================================== */
const GeneradorHorariosAvanzado = () => {
  /* ==========================================
     ESTADO DEL COMPONENTE (HOOKS)
     ========================================== */
  const [horarios, setHorarios] = useState({ Lunes: [], Martes: [], Miércoles: [], Jueves: [], Viernes: [] });

  // Estado para el formulario
  const [diasSeleccionados, setDiasSeleccionados] = useState({ Lunes: false, Martes: false, Miércoles: false, Jueves: false, Viernes: false, Sábado: false, Domingo: false });
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFin, setHoraFin] = useState('17:00');
  const [duracion, setDuracion] = useState(30);

  /* ==========================================
     LÓGICA Y MANEJADORES DE EVENTOS
     ========================================== */
  // Maneja el cambio en las casillas de los días
  const handleDiaChange = (dia) => {
    setDiasSeleccionados(prev => ({ ...prev, [dia]: !prev[dia] }));
  };
  
  // Atajo para seleccionar/deseleccionar Lunes a Viernes
  const seleccionarLunesAViernes = () => {
    const todosSeleccionados = DIAS_SEMANA.slice(0, 5).every(dia => diasSeleccionados[dia]);
    const nuevosDias = { ...diasSeleccionados };
    DIAS_SEMANA.slice(0, 5).forEach(dia => nuevosDias[dia] = !todosSeleccionados);
    setDiasSeleccionados(nuevosDias);
  };
  
  // La nueva función para generar horarios en lote
  const handleGenerarHorarios = (e) => {
    e.preventDefault();
    const diasParaActualizar = Object.keys(diasSeleccionados).filter(dia => diasSeleccionados[dia]);
    
    if (diasParaActualizar.length === 0) {
      alert('Por favor, selecciona al menos un día.');
      return;
    }
    if (!horaInicio || !horaFin || horaInicio >= horaFin) {
      alert('Por favor, ingresa un rango de horas válido.');
      return;
    }

    // --- Lógica de generación de citas ---
    const nuevosSlots = [];
    const fechaBase = new Date(); // Usamos una fecha cualquiera, solo nos importan las horas
    let slotActual = parse(horaInicio, 'HH:mm', fechaBase);
    const horaFinDate = parse(horaFin, 'HH:mm', fechaBase);

    while (isBefore(slotActual, horaFinDate)) {
      const slotFin = addMinutes(slotActual, duracion);
      if (!isBefore(slotFin, horaFinDate) && slotFin.getTime() !== horaFinDate.getTime()) {
        break; // No agregar si el slot termina después de la hora final
      }
      nuevosSlots.push({
        id: Date.now() + Math.random(),
        inicio: format(slotActual, 'HH:mm'),
        fin: format(slotFin, 'HH:mm'),
      });
      slotActual = slotFin;
    }
    
    // Actualizamos el estado para todos los días seleccionados
    const horariosActualizados = { ...horarios };
    diasParaActualizar.forEach(dia => {
      horariosActualizados[dia] = nuevosSlots; // Reemplaza los horarios del día
    });
    
    setHorarios(horariosActualizados);
  };
  
  const handleEliminarHorario = (dia, idAEliminar) => {
    const horariosActualizados = horarios[dia].filter(h => h.id !== idAEliminar);
    setHorarios({ ...horarios, [dia]: horariosActualizados });
  };

  /* ==========================================
     RENDERIZADO DEL COMPONENTE (JSX)
     ========================================== */
return (
    <div className="main-container">
        <div className="gestion-horarios-container">
            <h2>Generador de Horarios</h2>
            <form onSubmit={handleGenerarHorarios} className="horarios-form">
                
                {/* --- NUEVO: Selector de días con Checkboxes --- */}
                <div className="form-group span-full">
                <label>Días de la Semana</label>
                <div className="dias-selector">
                    <div className="dias-checkbox-container">
                    {DIAS_SEMANA.map(dia => (
                        <label key={dia} className="checkbox-label">
                        <input type="checkbox" checked={diasSeleccionados[dia]} onChange={() => handleDiaChange(dia)} />
                            <span>{dia.substring(0, 3)}</span>
                        </label>
                    ))}
                    </div>
                    <button type="button" className="btn-shortcut" onClick={seleccionarLunesAViernes}>Lunes a Viernes</button>
                </div>
                </div>

                <div className="form-group">
                <label htmlFor="hora-inicio">Hora Inicio</label>
                <input id="hora-inicio" type="time" className="form-input" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />
                </div>
                <div className="form-group">
                <label htmlFor="hora-fin">Hora Fin</label>
                <input id="hora-fin" type="time" className="form-input" value={horaFin} onChange={e => setHoraFin(e.target.value)} />
                </div>
                <div className="form-group span-full">
                <label htmlFor="duracion">Duración por Cita (minutos)</label>
                <select id="duracion" className="form-select" value={duracion} onChange={e => setDuracion(Number(e.target.value))}>
                    {DURACIONES.map(d => <option key={d} value={d}>{d} minutos</option>)}
                </select>
                </div>
                <button type="submit" className="btn-agregar span-full">Generar Horarios</button>
            </form>
            
            <div className="horarios-configurados">
                <h3>Horarios Generados</h3>
                <div className="horarios-lista">
                {DIAS_SEMANA.map(dia => (
                    horarios[dia] && horarios[dia].length > 0 && (
                    <div key={dia} className="dia-grupo">
                        <h4>{dia}</h4>
                        {horarios[dia].map(h => (
                        <div key={h.id} className="horario-item">
                            <span>{h.inicio} - {h.fin}</span>
                            <button onClick={() => handleEliminarHorario(dia, h.id)} className="eliminar-btn">Eliminar</button>
                        </div>
                        ))}
                    </div>
                    )
                ))}
                </div>
            </div>
        </div>
    </div>

    
);
};

export default GeneradorHorariosAvanzado;