import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { db } from '../../firebase'; // Comentado para no usar la base de datos
// import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Componentes de Material-UI
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid'; 
import AddIcon from '@mui/icons-material/Add'; 
// ✅ 1. Importamos los íconos necesarios
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GoogleIcon from '@mui/icons-material/Google';


// --- DATOS DE MUESTRA PARA DISEÑO ---
const datosDeMuestra = [
  { id: '1', nombre: 'Juan', apellido: 'Pérez', especialidad: 'Cardiología', email: 'juan.perez@email.com' },
  { id: '2', nombre: 'Ana', apellido: 'García', especialidad: 'Dermatología', email: 'ana.garcia@email.com' },
  { id: '3', nombre: 'Carlos', apellido: 'López', especialidad: 'Cirugía General', email: 'carlos.lopez@email.com' },
];


const Veterinarios = () => {
  const navigate = useNavigate();
  const [veterinarios, setVeterinarios] = useState(datosDeMuestra); 
  const [loading, setLoading] = useState(false); 
  
  // --- Estados para el diálogo de borrado ---
  const [dialogOpen, setDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  // ✅ 2. Estados para el nuevo modal de invitación
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');


  // --- Lógica para el borrado ---
  const handleOpenDialog = (id) => {
    setIdToDelete(id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setIdToDelete(null);
  };

  const handleDelete = () => {
    if (idToDelete) {
      setVeterinarios(veterinarios.filter(v => v.id !== idToDelete));
      handleCloseDialog();
    }
  };

  // ✅ 3. Funciones para controlar el modal de invitación
  const handleOpenInviteModal = () => {
    setInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setInviteModalOpen(false);
    setInviteEmail(''); // Limpiamos el email al cerrar
  };

  const handleSendInvitation = () => {
    // Por ahora, solo mostramos el email en la consola
    console.log(`Invitación enviada a: ${inviteEmail}`);
    handleCloseInviteModal(); // Cerramos el modal después de "enviar"
  };
  
  
  // --- Definición de las Columnas para la Tabla ---
  const columns = [
    { field: 'nombre', headerName: 'Nombres', width: 150 },
    { field: 'apellido', headerName: 'Apellidos', width: 150 },
    { field: 'especialidad', headerName: 'Especialidad', width: 180 },
    { field: 'email', headerName: 'E-mail', width: 200 },
    {
      field: 'actions',
      headerName: 'Acciones',
      sortable: false,
      width: 250,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ mr: 1 }}
            onClick={() => navigate(`/admin/veterinarios/${params.id}/edit`)}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleOpenDialog(params.id)}
          >
            Eliminar
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1">
          Gestión de Veterinarios
        </Typography>
        {/* ✅ 4. Contenedor para los botones de acción */}
        <Box>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenInviteModal} // Abre el nuevo modal
            sx={{ mr: 2 }}
          >
            Invitar Veterinario
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/veterinarios/nuevo')}
          >
            Agregar Veterinario
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={veterinarios}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          components={{ Toolbar: GridToolbar }}
        />
      </Box>

      {/* --- Diálogo de Confirmación de Borrado --- */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ 5. Nuevo Modal para Invitar Veterinario */}
      <Dialog open={inviteModalOpen} onClose={handleCloseInviteModal} fullWidth maxWidth="sm">
        <DialogTitle>Invitar a un Nuevo Veterinario</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Ingresa el correo electrónico del veterinario para enviarle una invitación para unirse a la plataforma.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Correo Electrónico"
            type="email"
            fullWidth
            variant="outlined"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 24px' }}>
          <Button onClick={handleCloseInviteModal}>Cancelar</Button>
          <Button 
            onClick={handleSendInvitation} 
            variant="contained" 
            startIcon={<GoogleIcon />}
          >
            Enviar Invitación
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Veterinarios;