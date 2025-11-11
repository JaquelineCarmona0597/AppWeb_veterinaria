// src/views/DashboardRecepcionista.jsx
import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Avatar, CircularProgress, List, ListItem, ListItemText, ListItemAvatar, Divider } from '@mui/material';
import { Event as EventIcon, PersonAdd as PersonAddIcon, Pets as PetIcon, MedicalServices as VetIcon } from '@mui/icons-material';
import '../../css/adminCss/Dashboard.css'; // Reutilizamos el mismo CSS

// --- IMPORTACIONES DE FIREBASE ---
import { db } from '../../firebase';
import { collection, getDocs, doc, getDoc, query, where, Timestamp, orderBy } from "firebase/firestore";

// Componente de Tarjeta KPI (reutilizado)
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

// Componente principal del Dashboard de Recepcionista
const DashboardRecepcionista = () => {
  const [stats, setStats] = useState({
    citasHoy: 0,
    invitadosHoy: 0,
  });
  const [proximasCitas, setProximasCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- LÓGICA PARA OBTENER DATOS DE FIRESTORE ---
  useEffect(() => {
    
    // --- FUNCIÓN DE AYUDA (MODIFICADA) ---
    // Ahora solo la necesitamos para buscar el doctor de las 'invitaciones'
    const getNombreUsuario = async (userId) => {
      // Si el ID no existe o es un string (como "Por asignar"), solo devolvemos ese valor
      if (!userId || typeof userId !== 'string' || userId.length < 10) {
        return userId || "No asignado";
      }
      
      try {
        const userDoc = await getDoc(doc(db, "usuarios", userId));
        return userDoc.exists() ? userDoc.data().nombre : "Usuario no encontrado";
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
        return "Error";
      }
    };

    // ¡Ya no necesitamos 'getNombreMascota'!

    const fetchCitas = async () => {
      try {
        setLoading(true);
        const hoy = new Date();
        const inicioHoy = new Date(hoy.setHours(0, 0, 0, 0));
        const finHoy = new Date(hoy.setHours(23, 59, 59, 999));

        const inicioHoyTimestamp = Timestamp.fromDate(inicioHoy);
        const finHoyTimestamp = Timestamp.fromDate(finHoy);

        let citasHoyCount = 0;
        let invitadosHoyCount = 0;
        let citasCombinadas = [];

        // --- 1. Obtener Citas de Usuarios Registrados (¡SIMPLIFICADO!) ---
        const qCitas = query(
          collection(db, "citas"),
          where("fecha", ">=", inicioHoyTimestamp), // Usamos 'fecha'
          orderBy("fecha", "asc")
        );
        const citasSnapshot = await getDocs(qCitas);

        // Ya no es una promesa, es un mapeo directo
        const proximasCitasResueltas = citasSnapshot.docs.map((citaDoc) => {
          const citaData = citaDoc.data();
          
          // Contar para el KPI
          if (citaData.fecha <= finHoyTimestamp) {
            citasHoyCount++;
          }

          // --- ¡CAMBIO CLAVE AQUÍ! ---
          // Usamos los campos que vienen directo del documento 'citas'
          return {
            id: citaDoc.id,
            fecha: citaData.fecha.toDate(),
            dueño: citaData.nombrePropietario, // <--- CAMBIO
            mascota: citaData.nombreMascota, // <--- CAMBIO
            doctor: citaData.doctor,           // <--- CAMBIO
            tipo: "Registrado"
          };
        });

        // --- 2. Obtener Citas de Invitados (SIN CAMBIOS) ---
        // Esta lógica asume que 'invitaciones' SÍ necesita buscar el 'idDoctor'
        const qInvitados = query(
          collection(db, "invitaciones"),
          where("fecha", ">=", inicioHoyTimestamp),
          orderBy("fecha", "asc")
        );
        const invitadosSnapshot = await getDocs(qInvitados);
        
        // Esta parte SÍ sigue siendo asíncrona
        const invitadosPromises = invitadosSnapshot.docs.map(async (invDoc) => {
          const invData = invDoc.data();

          if (invData.fecha <= finHoyTimestamp) {
            invitadosHoyCount++;
          }

          // Asumimos que 'invitaciones' guarda el ID del doctor
          const nombreDoctor = await getNombreUsuario(invData.idDoctor);

          return {
            id: invDoc.id,
            fecha: invData.fecha.toDate(),
            dueño: invData.nombreDueño,
            mascota: invData.nombreMascota,
            doctor: nombreDoctor,
            tipo: "Invitado"
          };
        });

        // --- 3. Resolver y Combinar ---
        const proximasInvitacionesResueltas = await Promise.all(invitadosPromises);

        citasCombinadas = [...proximasCitasResueltas, ...proximasInvitacionesResueltas];
        citasCombinadas.sort((a, b) => a.fecha - b.fecha);

        setProximasCitas(citasCombinadas);
        setStats({
          citasHoy: citasHoyCount,
          invitadosHoy: invitadosHoyCount,
        });

      } catch (error) {
        console.error("Error al cargar citas: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []); // Se ejecuta una vez

  // Datos para las tarjetas KPI
  const kpiData = [
    { title: 'Citas de Clientes (Hoy)', value: stats.citasHoy, icon: <EventIcon />, color: 'var(--color-primario)', loading },
    { title: 'Citas de Invitados (Hoy)', value: stats.invitadosHoy, icon: <PersonAddIcon />, color: 'var(--color-acento)', loading },
  ];

  return (
    <Box className="dashboard-container">
      {/* --- SECCIÓN DE BIENVENIDA --- */}
      <Box className="dashboard-header" sx={{ textAlign: 'center' }}>
        <Typography variant="h5" component="h1" className="dashboard-title">
          Dashboard de Recepción
        </Typography>
        <Typography className="dashboard-subtitle">
          Gestión de citas y pacientes del día.
        </Typography>
      </Box>

      {/* --- SECCIÓN DE TARJETAS KPI (CORREGIDO) --- */}
      <Grid container spacing={3} className="kpi-grid">
        {kpiData.map((kpi, index) => (
          // ¡CAMBIO! Se quita 'item' y se usa 'xs' y 'sm' directo
          <Grid xs={12} sm={6} key={index}> 
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
      
      {/* --- SECCIÓN DE LISTA DE CITAS (CORREGIDO) --- */}
      <Grid container spacing={3} className="main-content-grid">
        {/* ¡CAMBIO! Se quita 'item' y se usa 'xs' directo */}
        <Grid xs={12}>
          <Paper 
            className="chart-card" 
            elevation={0} 
            variant="outlined" 
            style={{ animationDelay: '0.2s', opacity: 0 }}
          >
            <Typography 
              variant="h6" 
              className="card-title" 
              sx={{ textAlign: 'center', paddingTop: '16px' }}
            >
              Próximas Citas (Registrados e Invitados)
            </Typography>
            <Box className="chart-container" sx={{ maxHeight: 400, overflow: 'auto' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List sx={{ padding: 2 }}>
                  {proximasCitas.length > 0 ? (
                    proximasCitas.map((cita, index) => (
                      <React.Fragment key={cita.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: cita.tipo === 'Invitado' ? 'var(--color-acento)' : 'var(--color-primario)' }}>
                              {cita.tipo === 'Invitado' ? <PersonAddIcon /> : <PetIcon />}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography component="span" variant="body1" color="text.primary">
                                {`Mascota: ${cita.mascota} (Dueño: ${cita.dueño})`}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography component="span" sx={{ display: 'block' }} variant="body2">
                                  {cita.fecha.toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })}
                                </Typography>
                                <Typography component="span" sx={{ display: 'block' }} variant="body2">
                                  <VetIcon sx={{ fontSize: '1rem', verticalAlign: 'middle' }} /> {` Doctor: ${cita.doctor}`}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        {index < proximasCitas.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))
                  ) : (
                    // Este mensaje ahora sí debería aparecer
                    <Typography sx={{ textAlign: 'center', padding: 3 }}>
                      No hay próximas citas programadas.
                    </Typography>
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