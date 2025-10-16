/* ==========================================
    IMPORTS
   ========================================== */
// React y Hooks
import React, { useState, useEffect } from 'react';

// Componentes de Material-UI
import {
  Avatar, 
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  TextField,
  CircularProgress
} from '@mui/material';

// Componentes de Data Grid
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

// Iconos de Material-UI
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GoogleIcon from '@mui/icons-material/Google';

// Componentes de Formularios
import NuevoVeterinario from './NuevoVeterinario'; 
// --- AÑADIDO: Importamos el componente de edición ---
import EditarVeterinario from './EditarVeterinario';

// Estilos locales
import '../../css/authCss/Veterinarios.css';

// Importaciones de Firebase
import { db } from '../../firebase';
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";


/* ==========================================
    DEFINICIÓN DEL COMPONENTE: Veterinarios
   ========================================== */
const Veterinarios = () => {

  /* ==========================================
    ESTADO DEL COMPONENTE (HOOKS)
     ========================================== */
  
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // --- AÑADIDO: Estados para el modal de edición ---
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [vetToEdit, setVetToEdit] = useState(null);


  /* ==========================================
    LÓGICA PARA CARGAR DATOS DE FIREBASE
     ========================================== */
  useEffect(() => {
    const fetchVeterinarios = async () => {
      setLoading(true);
      try {
        // Se cambia "users" por "usuarios" y "role" por "rol"
        const q = query(collection(db, "usuarios"), where("rol", "==", "vet"));
        const querySnapshot = await getDocs(q);
        const vetsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVeterinarios(vetsData);
      } catch (error) {
        console.error("Error al obtener los veterinarios: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVeterinarios();
}, []);


  /* ==========================================
    LÓGICA Y MANEJADORES DE EVENTOS
     ========================================== */
  const handleOpenDialog = (id) => {
    setIdToDelete(id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setIdToDelete(null);
  };

  const handleDelete = async () => {
    if (idToDelete) {
      try {
        const vetDocRef = doc(db, 'usuarios', idToDelete);
        await deleteDoc(vetDocRef);
        setVeterinarios(veterinarios.filter(v => v.id !== idToDelete));
        console.log(`Veterinario con ID: ${idToDelete} eliminado exitosamente.`);
      } catch (error) {
        console.error("Error al eliminar el veterinario: ", error);
      } finally {
        handleCloseDialog();
      }
    }
  };

  const handleVetAdded = (nuevoVet) => {
    setVeterinarios(prevVets => [...prevVets, nuevoVet]);
  };
  
  // --- AÑADIDO: Función para actualizar la tabla cuando se edita un veterinario ---
  const handleVetUpdated = (updatedVetData) => {
    setVeterinarios(prevVets => 
      prevVets.map(vet => vet.id === updatedVetData.id ? updatedVetData : vet)
    );
  };

  const handleOpenInviteModal = () => {
    setInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setInviteModalOpen(false);
    setInviteEmail('');
  };

  const handleSendInvitation = () => {
    console.log(`Invitación enviada a: ${inviteEmail}`);
    handleCloseInviteModal();
  };

  const handleOpenAddModal = () => setAddModalOpen(true);
  const handleCloseAddModal = () => setAddModalOpen(false);

  // --- AÑADIDO: Manejadores para el modal de edición ---
  const handleOpenEditModal = (vet) => {
    setVetToEdit(vet);
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setVetToEdit(null);
    setEditModalOpen(false);
  };

  /* ==========================================
    CONFIGURACIÓN DE LA TABLA (COLUMNAS)
     ========================================== */
  const columns = [
    { 
      field: 'photoURL', 
      headerName: 'Foto', 
      width: 80, 
      renderCell: (params) => (<Avatar src={params.value} />), 
      sortable: false, 
      filterable: false, 
    },
    { 
      field: 'nombre', // Corregido de 'name' a 'nombre'
      headerName: 'Nombre', 
      width: 150 
    },
    { 
      field: 'especialidad', 
      headerName: 'Especialidad', 
      width: 180 
    },
    { 
      field: 'correo', // Corregido de 'email' a 'correo'
      headerName: 'E-mail', 
      width: 200 
    },
    { 
      field: 'telefono', // ¡Añadido!
      headerName: 'Teléfono', 
      width: 150 
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      sortable: false,
      filterable: false, // Las acciones no se deben poder filtrar
      width: 250,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleOpenEditModal(params.row)}
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

      <Box className='sub-container' sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography className='titulo' variant="h5" component="h1">
          Gestión de Veterinarios
        </Typography>
        <Box className='action-buttons'>
          <Button className='invite-button' variant="outlined" startIcon={<PersonAddIcon />} onClick={handleOpenInviteModal} sx={{ mr: 2 }}>
            Invitar Veterinario
          </Button>
          <Button className='add-button' variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddModal} >
            Agregar Veterinario
          </Button>
        </Box>
      </Box>

      <Box className='box-edit' sx={{ height: 600, width: '100%' }}>
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        ) : (
            <DataGrid className='data-grid' rows={veterinarios} columns={columns} components={{ Toolbar: GridToolbar }} />
        )}
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

      {/* --- MODAL PARA AGREGAR VETERINARIO --- */}
      <Dialog open={addModalOpen} onClose={handleCloseAddModal} fullWidth maxWidth="sm">
        <DialogTitle>Registrar Nuevo Veterinario</DialogTitle>
        <NuevoVeterinario 
          onClose={handleCloseAddModal}
          onVetAdded={handleVetAdded}
        />
      </Dialog>
      
      {/* --- AÑADIDO: MODAL PARA EDITAR VETERINARIO --- */}
      <Dialog open={editModalOpen} onClose={handleCloseEditModal} fullWidth maxWidth="sm">
        <DialogTitle>Editar Información del Veterinario</DialogTitle>
        <EditarVeterinario 
          vetData={vetToEdit}
          onClose={handleCloseEditModal}
          onVetUpdated={handleVetUpdated}
        />
      </Dialog>
    </Box>
  );
};

export default Veterinarios;