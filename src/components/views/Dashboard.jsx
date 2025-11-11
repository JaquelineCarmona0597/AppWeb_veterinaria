// src/views/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Avatar, CircularProgress } from '@mui/material';
import { Pets as PetsIcon, People as PeopleIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { MedicalServices as VetIcon, SupportAgent as ReceptionistIcon } from '@mui/icons-material';
import '../../css/adminCss/Dashboard.css'; 

// --- IMPORTACIONES DE FIREBASE ---
import { db } from '../../firebase'; 
import { collection, getDocs, Timestamp } from "firebase/firestore";

// --- IMPORTACIONES DE CHART.JS ---
import { Pie, Bar } from 'react-chartjs-2'; 
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale, 
  LinearScale,   
  BarElement,      
  Title          
} from 'chart.js';

// --- REGISTRO DE COMPONENTES DE CHART.JS ---
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title 
);

// Componente de Tarjeta KPI reutilizable (sin cambios)
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
    totalVets: 0,
    totalRecepcionistas: 0,
    nuevosUsuariosSemana: 0,
  });
  
  const [pieChartData, setPieChartData] = useState({ labels: [], datasets: [] });
  const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usuariosQuery = collection(db, "usuarios");
        const querySnapshot = await getDocs(usuariosQuery);
        
        let clientes = 0;
        let vets = 0;
        let recepcionistas = 0;
        let nuevos = 0;
        
        const dayLabels = [];
        const dailyCounts = new Array(7).fill(0);
        const today = new Date();
        const oneDay = 1000 * 60 * 60 * 24;
        
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today.getTime() - (i * oneDay));
          dayLabels.push(`${d.getDate()}/${d.getMonth() + 1}`);
        }
        
        const sevenDaysAgoTimestamp = today.getTime() - (7 * oneDay);

        querySnapshot.forEach((doc) => {
          const user = doc.data();
          
          if (user.rol === 'cliente') {
            clientes++;
          } else if (user.rol === 'vet') {
            vets++;
          } else if (user.rol === 'recepcionista') {
            recepcionistas++;
          }
          
          if (user.fechaCreacion) {
             const creationTime = user.fechaCreacion.toMillis();
             
             if (creationTime > sevenDaysAgoTimestamp) {
                nuevos++;
             }

             const creationDate = user.fechaCreacion.toDate();
             const diffMs = today.getTime() - creationDate.getTime();
             const daysAgo = Math.floor(diffMs / oneDay);
             
             if (daysAgo >= 0 && daysAgo < 7) {
               dailyCounts[6 - daysAgo]++;
             }
          }
        });

        setStats({
          totalClientes: clientes,
          totalVets: vets,
          totalRecepcionistas: recepcionistas,
          nuevosUsuariosSemana: nuevos,
        });

        setPieChartData({
          labels: ['Clientes', 'Veterinarios', 'Recepcionistas'],
          datasets: [
            {
              label: 'Distribución de Usuarios',
              data: [clientes, vets, recepcionistas], 
              backgroundColor: [
                'rgba(54, 162, 235, 0.6)', 
                'rgba(75, 192, 192, 0.6)', 
                'rgba(255, 159, 64, 0.6)', 
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });

        setBarChartData({
          labels: dayLabels, 
          datasets: [
            {
              label: 'Nuevos Usuarios por Día',
              data: dailyCounts, 
              backgroundColor: 'rgba(153, 102, 255, 0.6)', 
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        });

      } catch (error) {
        console.error("Error al cargar estadísticas: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); 

  const kpiData = [
    { title: 'Total de Clientes', value: stats.totalClientes, icon: <PetsIcon />, color: 'var(--color-primario)', loading },
    { title: 'Total Veterinarios', value: stats.totalVets, icon: <VetIcon />, color: 'var(--color-exito)', loading },
    { title: 'Total Recepcionistas', value: stats.totalRecepcionistas, icon: <ReceptionistIcon />, color: 'var(--color-acento)', loading },
    { title: 'Nuevos (últimos 7 días)', value: stats.nuevosUsuariosSemana, icon: <PersonAddIcon />, color: 'var(--color-info)', loading },
  ];

  const barOptions = {
    responsive: true, 
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1 
        }
      }
    }
  };

  return (
    <Box className="dashboard-container">
      {/* --- SECCIÓN DE BIENVENIDA --- */}
      {/* ¡CAMBIO AQUÍ! Añadimos 'sx' para centrar el texto del header */}
      <Box className="dashboard-header" sx={{ textAlign: 'center' }}>
        <Typography variant="h5" component="h1" className="dashboard-title">
          Dashboard
        </Typography>
      </Box>

      {/* --- SECCIÓN DE TARJETAS KPI --- */}
      <Grid container spacing={3} className="kpi-grid">
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}> 
            <KpiCard 
              title={kpi.title} 
              value={kpi.value} 
              icon={kpi.icon} 
              color={kpi.color} 
              loading={kpi.loading}
              delay={index * 0.1}
            />
          </Grid>
        ))}
      </Grid>
      
      {/* --- SECCIÓN DE GRÁFICOS --- */}
      <Grid container spacing={3} className="main-content-grid">
        {/* --- GRÁFICO DE PASTEL --- */}
        <Grid item xs={12} md={6}> 
          <Paper className="chart-card" elevation={0} variant="outlined">
            {/* ¡CAMBIO AQUÍ! Añadimos 'sx' para centrar el título del gráfico */}
            <Typography 
              variant="h6" 
              className="card-title" 
              sx={{ textAlign: 'center', paddingTop: '16px' }} // Añadí paddingTop para darle espacio
            >
              Distribución de Usuarios
            </Typography>
            <Box className="chart-container" sx={{ height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {loading ? (
                <CircularProgress />
              ) : (
                <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* --- GRÁFICO DE BARRAS --- */}
        <Grid item xs={12} md={6}>
          <Paper className="chart-card" elevation={0} variant="outlined">
            {/* ¡CAMBIO AQUÍ! Añadimos 'sx' para centrar el título del gráfico */}
            <Typography 
              variant="h6" 
              className="card-title" 
              sx={{ textAlign: 'center', paddingTop: '16px' }} // Añadí paddingTop para darle espacio
            >
              Nuevos Usuarios (Últimos 7 Días)
            </Typography>
            <Box className="chart-container" sx={{ height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {loading ? (
                <CircularProgress />
              ) : (
                <Bar data={barChartData} options={barOptions} />
              )}
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;