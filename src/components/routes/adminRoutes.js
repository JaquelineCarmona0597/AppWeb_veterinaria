// src/routes/adminRoutes.js



// Definimos las rutas del panel de administración

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary", // Ícono de la plantilla original
    layout: "/admin",
  },
  {
    path: "/pacientes",
    name: "Pacientes",
    icon: "ni ni-bullet-list-67 text-red",
    layout: "/admin",
  },
  {
    path: "/nuevo-paciente",
    name: "Nuevo Paciente",
    icon: "ni ni-fat-add text-blue",
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    layout: "/auth",
  },
];

export default routes;