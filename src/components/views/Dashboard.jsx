// src/views/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Avatar, CircularProgress } from '@mui/material';
import { Pets as PetsIcon, People as PeopleIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import '../../css/adminCss/Dashboard.css'; // Usamos el mismo CSS de antes

// --- IMPORTACIONES DE FIREBASE ---
import { db } from '../../firebase'; // Asegúrate que la ruta sea correcta
import { collection, getDocs, Timestamp } from "firebase/firestore";

// Componente de Tarjeta KPI reutilizable
const KpiCard = ({ title, value, icon, color, loading, delay }) => (
  <Paper className="kpi-card" elevation={0} variant="outlined" style={{ animationDelay: `${delay}s` }}>
    <Avatar className="kpi-icon" sx={{ bgcolor: color }}>
      {icon}
    </Avatar>
    <Box>
      {loading ? (
        <CircularProgress size={28} />
      ) : (
        <Typography className="kpi-value">{value}</Typography>
      )}
      <Typography className="kpi-title">{title}</Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalEmpleados: 0,
    nuevosUsuariosSemana: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- LÓGICA PARA OBTENER DATOS DE FIRESTORE ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Obtener todos los usuarios
        const usuariosQuery = collection(db, "usuarios");
        const querySnapshot = await getDocs(usuariosQuery);
        
        let clientes = 0;
        let empleados = 0;
        let nuevos = 0;
        
        // Fecha de hace 7 días
        const sevenDaysAgo = Timestamp.now().toMillis() - (7 * 24 * 60 * 60 * 1000);

        querySnapshot.forEach((doc) => {
          const user = doc.data();
          
          // 2. Contar por rol
          if (user.rol === 'cliente') {
            clientes++;
          } else if (user.rol === 'vet' || user.rol === 'recepcionista') {
            empleados++;
          }
          
          // 3. Contar nuevos usuarios de la última semana
          if (user.fechaCreacion && user.fechaCreacion.toMillis() > sevenDaysAgo) {
            nuevos++;
          }
        });

        setStats({
          totalClientes: clientes,
          totalEmpleados: empleados,
          nuevosUsuariosSemana: nuevos,
        });

      } catch (error) {
        console.error("Error al cargar estadísticas: ", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); // Se ejecuta una vez al cargar el componente

  // Datos para las tarjetas KPI
  const kpiData = [
    { title: 'Total de Clientes', value: stats.totalClientes, icon: <PetsIcon />, color: 'var(--color-primario)', loading },
    { title: 'Total de Empleados', value: stats.totalEmpleados, icon: <PeopleIcon />, color: 'var(--color-acento)', loading },
    { title: 'Nuevos (últimos 7 días)', value: stats.nuevosUsuariosSemana, icon: <PersonAddIcon />, color: 'var(--color-exito)', loading },
  ];

  return (
    <Box className="dashboard-container">
      {/* --- SECCIÓN DE BIENVENIDA --- */}
      <Box className="dashboard-header">
        <Typography variant="h5" component="h1" className="dashboard-title">
          Dashboard
        </Typography>
        <Typography className="dashboard-subtitle">
          Resumen de la actividad de tu base de datos en Firestore.
        </Typography>
      </Box>

      {/* --- SECCIÓN DE TARJETAS KPI --- */}
      <Grid container spacing={3} className="kpi-grid">
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <KpiCard 
              title={kpi.title} 
              value={kpi.value} 
              icon={kpi.icon} 
              color={kpi.color} 
              loading={kpi.loading}
              delay={index * 0.1} // Añade el retraso para la animación
            />
          </Grid>
        ))}
      </Grid>

      {error && (
        <Box sx={{ mt: 3 }}>
          <Typography color="error">No se pudieron cargar las estadísticas: {error.message}</Typography>
        </Box>
      )}
      
      {/* --- SECCIÓN DE GRÁFICOS (Próximamente) --- */}
      <Grid container spacing={3} className="main-content-grid">
        <Grid item xs={12}>
          <Paper className="chart-card" elevation={0} variant="outlined">
            <Typography variant="h6" className="card-title">Próximas Citas</Typography>
            <Box className="chart-container">
              <Typography>
                (Próximamente: Aquí podrías mostrar una tabla con las citas del día)
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;