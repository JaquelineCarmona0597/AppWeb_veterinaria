// src/views/DashboardRecepcionista.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Grid, Avatar, CircularProgress, List, 
  ListItem, ListItemText, ListItemAvatar, Divider, TextField, InputAdornment 
} from '@mui/material';
import { 
  Event as EventIcon, 
  PersonAdd as PersonAddIcon, 
  Pets as PetIcon, 
  MedicalServices as VetIcon,
  Search as SearchIcon // <--- IMPORTANTE: Nuevo icono
} from '@mui/icons-material';
import '../../css/adminCss/Dashboard.css'; 

// --- IMPORTACIONES DE FIREBASE ---
import { db } from '../../firebase';
import { collection, getDocs, doc, getDoc, query, where, Timestamp, orderBy } from "firebase/firestore";

// Componente de Tarjeta KPI
const KpiCard = ({ title, value, icon, color, loading, delay }) => (
  <Paper className="kpi-card" elevation={0} variant="outlined" style={{ animation: `fadeInUp 0.5s ease-out ${delay}s forwards`, opacity: 0 }}>
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

const DashboardRecepcionista = () => {
  const [stats, setStats] = useState({ citasHoy: 0, invitadosHoy: 0 });
  const [citasDelDia, setCitasDelDia] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); // <--- NUEVO ESTADO PARA EL BUSCADOR
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNombreUsuario = async (userId) => {
      if (!userId || typeof userId !== 'string' || userId.length < 5) return "No asignado";
      try {
        const userDoc = await getDoc(doc(db, "usuarios", userId));
        return userDoc.exists() ? userDoc.data().nombre : "Desconocido";
      } catch (error) {
        return "Error";
      }
    };

    const fetchCitas = async () => {
      try {
        setLoading(true);
        
        const hoy = new Date();
        const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0);
        const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);

        const inicioHoyTimestamp = Timestamp.fromDate(inicioHoy);

        // --- A. CITAS REGISTRADAS ---
        const qCitas = query(
          collection(db, "citas"),
          where("fecha", ">=", inicioHoyTimestamp), 
          orderBy("fecha", "asc")
        );
        const citasSnapshot = await getDocs(qCitas);

        let contadorCitasReg = 0;

        const citasProcesadas = citasSnapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              fecha: data.fecha.toDate(),
              dueño: data.nombrePropietario || "Sin nombre", 
              mascota: data.nombreMascota || "Mascota",
              doctor: data.doctor || "Por asignar",
              tipo: "Registrado"
            };
          })
          .filter((cita) => {
            const esHoy = cita.fecha <= finHoy;
            if (esHoy) contadorCitasReg++;
            return esHoy; 
          });

        // --- B. CITAS DE INVITADOS ---
        const qInvitados = query(
          collection(db, "invitaciones"),
          where("fecha", ">=", inicioHoyTimestamp),
          orderBy("fecha", "asc")
        );
        const invitadosSnapshot = await getDocs(qInvitados);
        let contadorInvitados = 0;

        const invitadosPromesas = invitadosSnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const nombreDoctor = await getNombreUsuario(data.idDoctor);
          return {
            id: doc.id,
            fecha: data.fecha.toDate(),
            dueño: data.nombreDueño || "Invitado",
            mascota: data.nombreMascota || "Mascota",
            doctor: nombreDoctor,
            tipo: "Invitado"
          };
        });

        let invitadosProcesados = await Promise.all(invitadosPromesas);
        invitadosProcesados = invitadosProcesados.filter(inv => {
            const esHoy = inv.fecha <= finHoy;
            if (esHoy) contadorInvitados++;
            return esHoy;
        });

        const listaFinal = [...citasProcesadas, ...invitadosProcesados].sort((a, b) => a.fecha - b.fecha);

        setCitasDelDia(listaFinal);
        setStats({ citasHoy: contadorCitasReg, invitadosHoy: contadorInvitados });

      } catch (error) {
        console.error("Error cargando citas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []);

  // --- LÓGICA DE FILTRADO ---
  // Filtramos la lista original basándonos en el texto escrito
  const citasFiltradas = citasDelDia.filter((cita) => {
    const termino = searchTerm.toLowerCase();
    return (
      cita.mascota.toLowerCase().includes(termino) || // Busca por nombre mascota
      cita.dueño.toLowerCase().includes(termino)      // O busca por nombre dueño
    );
  });

  const kpiData = [
    { title: 'Citas Registradas (Hoy)', value: stats.citasHoy, icon: <EventIcon />, color: '#4CAF50', loading },
    { title: 'Citas Invitados (Hoy)', value: stats.invitadosHoy, icon: <PersonAddIcon />, color: '#FF9800', loading },
  ];

  return (
    <Box className="dashboard-container">
      <Box className="dashboard-header" sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Agenda del Día
        </Typography>
        <Typography color="text.secondary">
          {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>

      {/* KPI GRID */}
      <Grid container spacing={2} className="kpi-grid" sx={{ mb: 3 }}>
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <KpiCard {...kpi} delay={index * 0.1} />
          </Grid>
        ))}
      </Grid>
      
      {/* LISTA DE CITAS CON BUSCADOR */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className="chart-card" elevation={1} sx={{ p: 0, overflow: 'hidden' }}>
            
            {/* HEADER DE LA TARJETA + BUSCADOR */}
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ color: '#333', mb: 2 }}>
                Pacientes de Hoy
              </Typography>

              {/* --- CAMPO DE BÚSQUEDA --- */}
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Buscar por mascota o dueño..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  style: { backgroundColor: 'white' } 
                }}
              />
            </Box>
            
            <Box sx={{ maxHeight: 450, overflow: 'auto' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {/* Usamos 'citasFiltradas' en lugar de 'citasDelDia' */}
                  {citasFiltradas.length > 0 ? (
                    citasFiltradas.map((cita, index) => (
                      <React.Fragment key={cita.id}>
                        <ListItem alignItems="flex-start" sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                          <ListItemAvatar>
                            <Avatar 
                              sx={{ 
                                bgcolor: cita.tipo === 'Invitado' ? '#FF9800' : '#2196F3',
                                width: 45, height: 45 
                              }}
                            >
                              {cita.tipo === 'Invitado' ? <PersonAddIcon /> : <PetIcon />}
                            </Avatar>
                          </ListItemAvatar>
                          
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" component="div" fontWeight="bold">
                                {cita.mascota} 
                                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                  (Prop: {cita.dueño})
                                </Typography>
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <VetIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.primary">
                                    Dr/a. {cita.doctor}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="primary" fontWeight="medium">
                                  Hora: {cita.fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < citasFiltradas.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))
                  ) : (
                    // Mensaje diferente si no hay resultados en la búsqueda o si no hay citas
                    <Box sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
                      <Typography>
                        {citasDelDia.length === 0 
                          ? "No hay citas programadas para hoy." 
                          : "No se encontraron coincidencias con tu búsqueda."}
                      </Typography>
                    </Box>
                  )}
                </List>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardRecepcionista;