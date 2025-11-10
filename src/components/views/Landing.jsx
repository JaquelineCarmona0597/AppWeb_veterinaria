import React from 'react';
import { useNavigate } from 'react-router-dom';
import './landing.css';

// --- Iconos (para no depender de archivos externos) ---
// Normalmente los importarías de 'lucide-react', pero para un solo archivo,
// los definimos aquí como componentes SVG.

// Icono para el Logo (Patita)
const PawPrint = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="4" r="2" />
    <circle cx="18" cy="8" r="2" />
    <circle cx="20" cy="16" r="2" />
    <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-7 0V15a5 5 0 0 1 5-5z" />
    <path d="M4.5 16.5a3.5 3.5 0 0 1 0-7H6" />
  </svg>
);

// Icono para "Gestión de Citas"
const CalendarDays = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);

// Icono para "Rendimiento del Negocio"
const LineChart = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

// Icono para "App Móvil"
const Smartphone = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
);

// Icono para "Menú Móvil"
const Menu = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

// Icono de Usuario (profile)
const UserIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// --- 1. Componente Navbar ---
function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    navigate('/auth/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="#home" className="navbar-logo">
          <img src="/logoM.png" alt="Patita Feliz" className="navbar-logo-img" />
          <span>Patita Feliz</span>
        </a>

        <div className="nav-menu">
          <a href="#home" className="nav-links">Inicio</a>
          <a href="#features" className="nav-links">Características</a>
          <a href="#project" className="nav-links">El Proyecto</a>
        </div>

        <div className="nav-item-login">
          <button className="nav-links-btn" onClick={handleLogin}>
            <span className="user-icon"><UserIcon /></span>
            <span>Acceder</span>
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="mobile-toggle">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
            <Menu />
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <a href="#home" className="nav-links">Inicio</a>
            <a href="#features" className="nav-links">Características</a>
            <a href="#project" className="nav-links">El Proyecto</a>
            <button className="nav-links-btn" onClick={(e) => { e.preventDefault(); handleLogin(); setMenuOpen(false); }}>Acceder</button>
          </div>
        )}
      </div>
    </nav>
  );
}

// --- 2. Componente Hero ---
function HeroSection() {
  return (
    <section id="home">
      <div className="hero-container">
        <div className="hero-text">
          <h1>Gestión Veterinaria Digital</h1>
          <p>
            Un proyecto integrador que conecta a veterinarios y dueños de mascotas a través de una app nativa y un sistema de gestión web.
          </p>
          <div style={{ marginTop: 24 }}>
            <button className="hero-btn" onClick={() => { window.location.hash = '#features'; }}>Conoce Más</button>
            <span className="cta-chip">Próximamente...</span>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="image-placeholder">
            <div className="mockup-frame">
              <img
                src="/src/assets/mockup-screen.png"
                alt="Mockup pantalla"
                className="mockup-screen"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentNode;
                  const placeholder = document.createElement('div');
                  placeholder.className = 'mockup-fallback';
                  placeholder.innerText = 'Mockup de la App Android\ny el Dashboard Web';
                  parent.appendChild(placeholder);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 3. Componente Características ---
function FeaturesSection() {
  const features = [
    {
      icon: <CalendarDays className="h-8 w-8 text-white" />,
      title: "Gestión de Citas",
      description: "Permite a los dueños de mascotas agendar citas fácilmente desde la app móvil. Los veterinarios administran la agenda desde el panel web.",
    },
    {
      icon: <LineChart className="h-8 w-8 text-white" />,
      title: "Rendimiento del Negocio",
      description: "El panel web ofrece estadísticas y reportes sobre el rendimiento de la clínica, pacientes atendidos, ingresos y más.",
    },
    {
      icon: <Smartphone className="h-8 w-8 text-white" />,
      title: "App Móvil y Web",
      description: "Una solución integral con una app nativa para clientes (Android) y un potente sistema de gestión (CRUD) para la veterinaria.",
    },
  ];

  return (
    <section id="features" className="features-section">
      <div className="max-width">
        <div className="text-center mb-16">
          <h2>Todo lo que tu clínica necesita</h2>
          <p className="features-sub">Una plataforma unificada para optimizar tu gestión y mejorar la atención.</p>
        </div>

        <div className="features-list">
          {features.map((feature) => (
            <div key={feature.title} className="project-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 64, width: 64, borderRadius: '999px', background: 'var(--primary)', color: '#fff', marginBottom: 12 }}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- 4. Componente "Para Quién" (Proyecto) ---
function ProjectSection() {
  return (
    <section id="project" className="">
      <div className="max-width project-grid">
        <div className="project-card">
          <h3>Para Veterinarios</h3>
          <p className="features-sub">Simplifica la administración de tu clínica. Con nuestro panel web, podrás gestionar citas, historiales de pacientes y, lo más importante, monitorear el rendimiento de tu negocio con reportes claros.</p>
          <ul>
            <li>✔ Optimiza tu agenda</li>
            <li>✔ Accede a historiales clínicos</li>
            <li>✔ Analiza el crecimiento de tu negocio</li>
          </ul>
        </div>

        <div className="project-card">
          <h3>Para Dueños de Mascotas</h3>
          <p className="features-sub">La salud de tu mascota en la palma de tu mano. Nuestra app móvil te permite agendar citas, recibir recordatorios de vacunas y tener toda la información de tus mascotas en un solo lugar.</p>
          <ul>
            <li>✔ Agenda citas 24/7</li>
            <li>✔ Recibe recordatorios importantes</li>
            <li>✔ Consulta el historial de tu mascota</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// --- 5. Componente CTA (Call to Action) ---
function CtaSection() {
  return (
    <section className="cta-section">
      <div className="max-width text-center">
        <h2>¿Listo para transformar la gestión de tu veterinaria?</h2>
        <p>Descubre cómo nuestra plataforma puede ayudarte a crecer y a ofrecer un mejor servicio.</p>
        <a href="#" className="cta-section .cta-button" onClick={(e) => e.preventDefault()}>Contáctanos (Próximamente)</a>
      </div>
    </section>
  );
}

// --- 6. Componente Footer ---
function Footer() {
  return (
    <footer className="site-footer">
      <div className="max-width">
        <p>&copy; {new Date().getFullYear()} Vet-App. Todos los derechos reservados.</p>
        <p className="mt-2">Un proyecto integrador.</p>
      </div>
    </footer>
  );
}


// --- Componente Principal APP ---
// Este es el componente que renderiza toda la página
export default function Landing() {
  return (
    <div className="landing-root">
      {/* Para usar Tailwind, asegúrate de tenerlo configurado en tu proyecto
        o incluye el script de Tailwind CDN en tu index.html para prototipado rápido:
        <script src="https://cdn.tailwindcss.com"></script>
      */}
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProjectSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}