/* ==========================================
   IMPORTS
   ========================================== */
// React y Hooks de React Router
import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'
// Componentes de Material-UI
import { 
  Box, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Typography, 
  TextField 
} from '@mui/material';

// Componentes de Data Grid
import { DataGrid, GridToolbar } from '@mui/x-data-grid'; 

// Iconos de Material-UI
import AddIcon from '@mui/icons-material/Add'; 
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GoogleIcon from '@mui/icons-material/Google';

// Estilos locales
import '../../css/authCss/Veterinarios.css';


/* ==========================================
   DATOS DE MUESTRA (PARA DESARROLLO)
   ========================================== */
const datosDeMuestra = [
  { id: '1', nombre: 'Juan', apellido: 'Pérez', especialidad: 'Cardiología', email: 'juan.perez@email.com' },
  { id: '2', nombre: 'Ana', apellido: 'García', especialidad: 'Dermatología', email: 'ana.garcia@email.com' },
  { id: '3', nombre: 'Carlos', apellido: 'López', especialidad: 'Cirugía General', email: 'carlos.lopez@email.com' },
];


/* ==========================================
   DEFINICIÓN DEL COMPONENTE: Veterinarios
   ========================================== */
const Veterinarios = () => {

  /* ==========================================
     ESTADO DEL COMPONENTE (HOOKS)
     ========================================== */
  const navigate = useNavigate();
  const [veterinarios, setVeterinarios] = useState(datosDeMuestra); // Almacena los datos de la tabla
  const [loading, setLoading] = useState(false); // Controla el estado de carga de la tabla
  
  // Estados para el diálogo de confirmación de borrado
  const [dialogOpen, setDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  // Estados para el modal de invitación
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');


  /* ==========================================
     LÓGICA Y MANEJADORES DE EVENTOS
     ========================================== */
  
  // --- Lógica para Diálogo de Borrado ---
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
      // Filtra los datos para "eliminar" el registro (en modo de prueba)
      setVeterinarios(veterinarios.filter(v => v.id !== idToDelete));
      handleCloseDialog();
    }
  };

  // --- Lógica para Modal de Invitación ---
  const handleOpenInviteModal = () => {
    setInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setInviteModalOpen(false);
    setInviteEmail(''); // Limpia el campo de email al cerrar
  };

  const handleSendInvitation = () => {
    // Lógica para enviar la invitación (actualmente solo simula con un log)
    console.log(`Invitación enviada a: ${inviteEmail}`);
    handleCloseInviteModal();
  };
  
  
  /* ==========================================
     CONFIGURACIÓN DE LA TABLA (COLUMNAS)
     ========================================== */
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
            onClick={() => navigate(`/admin/veterinarios/${params.id}/edit`)}
            sx={{ mr: 1 }}
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


  /* ==========================================
     RENDERIZADO DEL COMPONENTE (JSX)
     ========================================== */
  return (
    <Box className='containeer-box'>
      
      {/* --- Cabecera: Título y Botones de Acción --- */}
      <Box className='sub-container' sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography className='titulo' variant="h5" component="h1">
          Gestión de Veterinarios
        </Typography>
        
        <Box className='action-buttons'>
          <Button
            className='invite-button'
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenInviteModal}
            sx={{ mr: 2 }}
          >
            Invitar Veterinario
          </Button>
          <Button
            className='add-button'
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/veterinarios/nuevo')}
          >
            Agregar Veterinario
          </Button>
        </Box>
      </Box>

      {/* --- Tabla de Datos --- */}
      <Box className='box-edit' sx={{ height: 600, width: '100%' }}>
        <DataGrid
          className='data-grid'
          rows={veterinarios}
          columns={columns}
          loading={loading}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>

      {/* --- Diálogo de Confirmación de Borrado --- */}
      <Dialog className='container-dialog' open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle className='confirmacion'>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText className='texto-dialog'>
            ¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions className='iconos'>
          <Button className='cancelar' onClick={handleCloseDialog}>Cancelar</Button>
          <Button className='eliminar' onClick={handleDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Diálogo para Invitar Veterinario --- */}
      <Dialog className='invitar-veterinario' open={inviteModalOpen} onClose={handleCloseInviteModal} fullWidth maxWidth="sm">
        <DialogTitle className='invit'>Invitar a un Nuevo Veterinario</DialogTitle>
        <DialogContent className='contenido-invitacion'>
          <DialogContentText className='correo-invitacion' sx={{ mb: 2 }}>
            Ingresa el correo del veterinario para enviarle una invitación y unirse a la plataforma.
          </DialogContentText>
          <TextField
            className='input-email'
            autoFocus
            fullWidth
            label="Correo Electrónico"
            type="email"
            variant="outlined"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions className='cancelar' sx={{ p: '0 24px 24px' }}>
          <Button onClick={handleCloseInviteModal}>Cancelar</Button>
          <Button
            className='enviar-invitacion'
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