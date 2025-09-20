import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './siderbar.jsx';
import AdminNavbar from './AdminNavbar.jsx';
import Header from './header.jsx';
import Footer from '../../components/admin/Footer.jsx'; // --- 1. Importa el Footer ---
import logo from '../../assets/react.svg';

const adminRoutes = [
  { path: "/dashboard", name: "Dashboard", icon: "fa-solid fa-chart-pie", layout: "/admin" },
  { path: "/veterinarios", name: "Veterinarios", icon: "fa-solid fa-user-doctor", layout: "/admin" },
  { path: "/horarios", name: "Horarios", icon: "fa-solid fa-calendar-days", layout: "/admin" },
];

const mainContentStyle = {
  marginLeft: '250px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh' // Asegura que el contenedor ocupe toda la altura
};

const contentWrapperStyle = {
  flex: '1 0 auto' // Permite que este div crezca y ocupe el espacio disponible
}

const AdminPanel = () => {
  const location = useLocation();
  
  const getBrandText = () => {
    for (let i = 0; i < adminRoutes.length; i++) {
      if (location.pathname.indexOf(adminRoutes[i].layout + adminRoutes[i].path) !== -1) {
        return adminRoutes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        routes={adminRoutes}
        logo={{
          innerLink: "/admin/dashboard",
          imgSrc: logo,
          imgAlt: "Logo",
        }}
      />
      <div style={mainContentStyle} className="main-content">
        <div style={contentWrapperStyle}>
          <AdminNavbar brandText={getBrandText()} />
          <Header />
          <div style={{ padding: '2rem', marginTop: '-7rem' }}>
            <Outlet />
          </div>
        </div>
        
        {/* --- 2. Añade el componente Footer al final --- */}
        <Footer />
      </div>
    </>
  );
};

export default AdminPanel;