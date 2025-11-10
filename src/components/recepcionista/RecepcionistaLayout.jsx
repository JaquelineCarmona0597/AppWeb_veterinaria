import React, { useState } from 'react'; // <-- 1. IMPORTADO
import { Outlet, useLocation } from 'react-router-dom'; // <-- 1. IMPORTADO
import { Box, Paper } from '@mui/material'; // <-- 1. IMPORTADO
import SidebarRecep from './siderbarRecep'; // (Ya lo tenías)
import Header from '../admin/components/Header'; // (Ya lo tenías)
import '../../css/adminCss/adminlayout.css';
const drawerWidth = 240;

const RecepcionistaLayout = () => {
    // --- Lógica del componente ---
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    
    const handleToggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    }; // <-- 2. LLAVE FALTANTE AÑADIDA

    // --- 3. EL RETURN VA AQUÍ, FUERA DEL HANDLER ---
    return (
        <Box className="dashboard-layout" > {/* Recomendación: añadir display: 'flex' */}
            <SidebarRecep isSidebarOpen={isSidebarOpen} drawerWidth={drawerWidth} />
            
            <Box 
                component="main" 
                className="main-content"
                 // Recomendación: añadir flexGrow
            >
                {/* Este es el Header que queremos dejar fijo */}
                <Header 
                    className="hadercomponent"
                    isSidebarOpen={isSidebarOpen} 
                    handleToggleSidebar={handleToggleSidebar} 
                />

                {/* Contenido de la página */}
                <Box 
                    className="page-content" 
                    
                >
                    <Paper 
                        key={location.pathname}
                        component="header" // Nota: 'header' podría ser 'div' si no es un encabezado
                        elevation={0} 
                        className="content-card"
                    >
                        <Outlet />
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default RecepcionistaLayout;