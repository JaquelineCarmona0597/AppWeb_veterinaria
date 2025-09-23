import React from 'react';
import { format } from 'date-fns';

function TablaHorarios({ fecha, horarios, onEdit, onDelete, onAddNew }) {
    return (
        <div className="tabla-horarios-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Horarios para el {format(fecha, 'dd/MM/yyyy')}</h4>
                <button className="btn btn-primary" onClick={onAddNew}>
                    + Añadir Nuevo Horario
                </button>
            </div>
            <table className="table table-striped table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th>Hora de Inicio</th>
                        <th>Hora de Fin</th>
                        <th style={{ width: '150px' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {horarios.length > 0 ? (
                        horarios.map(h => (
                            <tr key={h.id}>
                                <td>{h.horaInicio}</td>
                                <td>{h.horaFin}</td>
                                <td>
                                    <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(h)}>Editar</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(h.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">No hay horarios configurados para este día.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TablaHorarios;