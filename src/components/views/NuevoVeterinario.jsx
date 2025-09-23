import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Componentes de Material-UI
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

const NuevoVeterinario = () => {
  const navigate = useNavigate();

  // --- Estados para cada campo del formulario ---
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState(''); // ✅ 1. Nuevo estado para el teléfono

  // --- Manejador del envío del formulario ---
  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    // Objeto con los datos del nuevo veterinario
    const nuevoVeterinario = {
      nombre,
      apellido,
      especialidad,
      email,
      telefono, // ✅ 2. Añadimos el teléfono al objeto
    };

    console.log("Datos del nuevo veterinario:", nuevoVeterinario);
    
    // navigate('/admin/veterinarios'); 
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        p: 3 
      }}
    >
      <Paper 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: '600px',
          borderRadius: 4 // ✅ Aumentamos el borde del contenedor para que coincida
        }}
      >
        <Typography variant="h5" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
          Agregar Nuevo Veterinario
        </Typography>

        {/* --- Campos de texto --- */}
        <TextField
          label="Nombres"
          variant="outlined"
          fullWidth
          margin="normal"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          // ✅ 4. Estilo para redondear las puntas
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
        />
        <TextField
          label="Apellidos"
          variant="outlined"
          fullWidth
          margin="normal"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
        />
        <TextField
          label="Especialidad"
          variant="outlined"
          fullWidth
          margin="normal"
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
          required
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
        />
        <TextField
          label="E-mail"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
        />

        {/* ✅ 3. Nuevo campo para el número de teléfono */}
        <TextField
          label="Número de teléfono"
          type="tel" // El tipo "tel" ayuda en móviles a mostrar el teclado numérico
          variant="outlined"
          fullWidth
          margin="normal"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
        />

        {/* --- Botones de acción --- */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={() => navigate('/admin/veterinarios')}
            sx={{ mr: 2, borderRadius: '20px' }} // ✅ Redondeamos botones también
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            variant="contained" 
            color="primary"
            sx={{ borderRadius: '20px' }} // ✅ Redondeamos botones también
          >
            Guardar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NuevoVeterinario;