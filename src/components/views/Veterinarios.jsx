
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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'; // Componentes de Data Grid
// Componentes de Data Grid
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

// Iconos de Material-UI
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GoogleIcon from '@mui/icons-material/Google';

// Estilos locales
import '../../css/authCss/Veterinarios.css';

// Importaciones de Firebase
import { db } from '../../firebase';
import { collection, query, where, getDocs, doc, deleteDoc, addDoc, serverTimestamp} from "firebase/firestore";
import NuevoEmpleado from './NuevoEmpleado';
import EditarEmpleado from './EditarEmpleado';


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
  
  // --- NUEVO ESTADO PARA EL ROL DE INVITACIÓN ---
  const [inviteRole, setInviteRole] = useState('vet'); // 'vet' por defecto
  
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [vetToEdit, setVetToEdit] = useState(null);


  /* ==========================================
    LÓGICA PARA CARGAR DATOS DE FIREBASE
     ========================================== */
  useEffect(() => {
    const fetchVeterinarios = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "usuarios"), where("rol", "in", ["vet", "recepcionista"]));
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
  
  // (Lógica de borrado - sin cambios)
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
      } catch (error) {
        console.error("Error al eliminar el veterinario: ", error);
      } finally {
        handleCloseDialog();
      }
    }
  };

  // (Lógica de Modales Add/Edit - sin cambios)
  const handleVetAdded = (nuevoVet) => {
    setVeterinarios(prevVets => [...prevVets, nuevoVet]);
  };
  const handleVetUpdated = (updatedVetData) => {
    setVeterinarios(prevVets => 
      prevVets.map(vet => vet.id === updatedVetData.id ? updatedVetData : vet)
    );
  };
  const handleOpenAddModal = () => setAddModalOpen(true);
  const handleCloseAddModal = () => setAddModalOpen(false);
  const handleOpenEditModal = (vet) => {
    setVetToEdit(vet);
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setVetToEdit(null);
    setEditModalOpen(false);
  };


  // --- MANEJADORES DEL MODAL DE INVITACIÓN (Actualizados) ---
  const handleOpenInviteModal = () => {
    setInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setInviteModalOpen(false);
    setInviteEmail('');
    setInviteRole('vet');
  };

  const handleSendInvitation = async () => {
    if (!inviteEmail || !inviteRole) {
      console.error("Email y Rol son necesarios");
      // Opcional: Mostrar una alerta al usuario
      return;
    }

    try {
      // 1. Crear el registro de la invitación en Firestore
      const invitacionRef = await addDoc(collection(db, "invitaciones"), {
        correo: inviteEmail,  
        rol: inviteRole,
        fechaInvitacion: serverTimestamp(),
        estado: "pendiente"
      });

      // 2. Crear el documento para que la extensión "Trigger Email" envíe el correo
      // (Asumiendo que instalaste la extensión "Trigger Email")
      
      const invitationId = invitacionRef.id;
      
      // ¡MEJORA! Usar variables de entorno para la URL base de la aplicación.
      // Ejemplo: import.meta.env.VITE_APP_BASE_URL o process.env.REACT_APP_BASE_URL
      const registrationUrl = `${window.location.origin}/auth/signup?token=${invitationId}`;

      await addDoc(collection(db, "mail"), {
        to: [inviteEmail],
        message: {
          subject: "¡Has sido invitado a unirte a la clínica!",
          html: `
            <p>Hola,</p>
            <p>Has sido invitado a unirte a nuestro equipo como <strong>${inviteRole === 'vet' ? 'Veterinario' : 'Recepcionista'}</strong>.</p>
            <p>Para aceptar la invitación y crear tu cuenta, por favor haz clic en el siguiente enlace:</p>
            <a href="${registrationUrl}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Completar Registro</a>
            <p>Si no esperabas esta invitación, puedes ignorar este correo.</p>
          `,
        },
      });
      
      console.log(`Invitación enviada a: ${inviteEmail} con el rol: ${inviteRole}`);
      // (Aquí puedes poner una alerta de éxito para el admin)
      
      handleCloseInviteModal();

    } catch (error) {
      console.error("Error al enviar la invitación: ", error);
      // (Aquí deberías mostrar una alerta de error al admin)
    }
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
      field: 'nombre',
      headerName: 'Nombre', 
      width: 150 
    },
    { 
      field: 'especialidad', 
      headerName: 'Especialidad', 
      width: 180 
    },
    { 
      field: 'correo',
      headerName: 'E-mail', 
      width: 200 
    },
    { 
      field: 'telefono',
      headerName: 'Teléfono', 
      width: 150 
    },
    {
    field: 'rol',
    headerName: 'Rol',
    width: 150,
    renderCell: (params) => (
      <Typography>
        {params.value === 'vet' ? 'Veterinario' : 'Recepcionista'}
      </Typography>
    )
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      sortable: false,
      filterable: false,
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
            <EditIcon />
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleOpenDialog(params.id)}
          >
            <DeleteIcon />
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

      {/* (Barra de título y botones - sin cambios) */}
      <Box className='sub-container'>
        <Typography className='Titulos' variant="h5" component="h1">
          Gestión de empleados
        </Typography>
        <Box className='action-buttons'>
          <Button className='invite-button' variant="outlined" startIcon={<PersonAddIcon />} onClick={handleOpenInviteModal} >
            Invitar empleado
          </Button>
          <Button className='add-button' variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddModal} >
            agregar empleado
          </Button>
        </Box>
      </Box>

      {/* (Data Grid - sin cambios) */}
      <Box className='box-edit' >
        {loading ? (
            <Box>
                <CircularProgress />
            </Box>
        ) : (
            <DataGrid 
              className='data-grid' 
              rows={veterinarios} 
              columns={columns} 
              components={{ Toolbar: GridToolbar }} />
        )}
      </Box>

      {/* (Diálogo de Borrado - sin cambios) */}
      <Dialog 
        className='modal-contenedor' 
        open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle className='confirmacion'>Confirmar eliminación</DialogTitle>
        <DialogContent className='contenedordialog'>
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
      
      {/* --- MODAL DE INVITACIÓN (Actualizado) --- */}
      <Dialog 
          className='modal-contenedor' 
          open={inviteModalOpen} onClose={handleCloseInviteModal} fullWidth maxWidth="sm">
        <DialogTitle className='invit'>Invitar a un Nuevo empleado</DialogTitle>
        <DialogContent className='contenido-invitacion'>
          <DialogContentText className='correo-invitacion' >
            {/* --- CAMBIO DE TEXTO --- */}
            Ingresa el correo y selecciona el rol del empleado para enviarle una invitación.
          </DialogContentText>
          <TextField
            className='secion-inputs'
            autoFocus
            fullWidth
            label="Correo Electrónico"
            type="email"
            variant="outlined"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            // --- AÑADIDO: Margen inferior para separar los campos ---
            sx={{ mb: 3, mt: 1 }} 
          />

          {/* --- AÑADIDO: Selector de Rol --- */}
          <FormControl fullWidth className='secion-inputs'>
            <InputLabel id="invitacion-rol-label">Rol del Empleado</InputLabel>
            <Select
              labelId="invitacion-rol-label"
              value={inviteRole}
              label="Rol del Empleado"
              onChange={(e) => setInviteRole(e.target.value)}
            >
              <MenuItem value="vet">Veterinario</MenuItem>
              <MenuItem value="recepcionista">Recepcionista</MenuItem>
            </Select>
          </FormControl>
          
        </DialogContent>
        <DialogActions className='botones-container' >
          <Button className='boton-camcelar-invt' onClick={handleCloseInviteModal}>Cancelar</Button>
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

      {/* (Modal de Agregar - sin cambios) */}
      <Dialog open={addModalOpen} onClose={handleCloseAddModal} fullWidth maxWidth="sm">
        <DialogTitle className='Titulos'>Registrar un nuevo empleado</DialogTitle>
        <NuevoEmpleado 
          onClose={handleCloseAddModal}
          onVetAdded={handleVetAdded}
        />
      </Dialog>
      
      {/* (Modal de Editar - sin cambios) */}
      <Dialog open={editModalOpen} onClose={handleCloseEditModal} fullWidth maxWidth="sm">
        <DialogTitle className='Titulos' >Editar Información del empleado</DialogTitle>
        <EditarEmpleado 
          vetData={vetToEdit}
          onClose={handleCloseEditModal}
          onVetUpdated={handleVetUpdated}
        />
      </Dialog>
    </Box>
  );
};

export default Veterinarios;