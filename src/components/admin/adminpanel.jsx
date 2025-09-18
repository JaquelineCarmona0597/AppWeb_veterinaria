import React from 'react';

const AdminPanel = () => {
  return (
    <div>
      <h1>Panel de Administrador</h1>
      <p>¡Hola! Has iniciado sesión con éxito.</p>
      {/* Aquí es donde irán las tablas y formularios CRUD */}
      <nav>
        <ul>
          <li>Gestionar Mascotas</li>
          <li>Gestionar Usuarios</li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminPanel;