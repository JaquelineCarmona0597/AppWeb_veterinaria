import React from 'react';
import { useNavigate } from 'react-router-dom';
import './landing.css';
import logoM from '../../assets/logoM.png';

// --- Iconos (para no depender de archivos externos) ---
// (Estos componentes SVG permanecen igual, ya que son parte de la estructura de React)

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

// --- 1. Componente Navbar ---
function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container navbar__content">
        {/* Logo y Título */}
        <a href="#home" className="navbar__logo">
          <img src={logoM} alt="logo" className="navbar__logo-img" />
          Patita Feliz
        </a>

        {/* Links de Navegación (Escritorio) */}
        <div className="navbar__menu">
          <a href="#home" className="navbar__link">Inicio</a>
          <a href="#features" className="navbar__link">Características</a>
          <a href="#project" className="navbar__link">El Proyecto</a>
          <a
            href="/auth/login"
            className="navbar__cta-button"
            onClick={(e) => {
              e.preventDefault();
              navigate('/auth/login');
            }}
          >
            Acceder
          </a>
        </div>

        {/* Botón de Menú (Móvil) */}
        <div className="navbar__mobile-toggle">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="navbar__mobile-button"
          >
            <Menu className="navbar__mobile-icon" />
          </button>
        </div>
      </div>

      {/* Menú Desplegable (Móvil) */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          <a href="#home" className="navbar__mobile-link">Inicio</a>
          <a href="#features" className="navbar__mobile-link">Características</a>
          <a href="#project" className="navbar__mobile-link">El Proyecto</a>
          <a
            href="/auth/login"
            className="navbar__mobile-link-cta"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              navigate('/auth/login');
            }}
          >
            Acceder
          </a>
        </div>
      )}
    </nav>
  );
}

// --- 2. Componente Hero ---
function HeroSection() {
  return (
    <section id="home" className="hero">
      <div className="container hero__grid">
        {/* Columna de Texto */}
        <div className="hero__text">
          <h1 className="hero__headline">
            Gestión Veterinaria Digital
          </h1>
          <p className="hero__description">
            Un proyecto integrador que conecta a veterinarios y dueños de mascotas a través de una app nativa y un sistema de gestión web.
          </p>
          <div className="hero__actions">
            <a
              href="#features"
              className="button button--primary"
            >
              Conoce Más
            </a>
            <span className="hero__cta-secondary">
              Próximamente...
            </span>
          </div>
        </div>
        
        {/* Columna de Imagen/Mockup */}
        <div className="hero__image-container">
          <div className="hero__mockup">
             {/* Placeholder para tu mockup de la app */}
             <div className="hero__mockup-placeholder">
               [Mockup de la App Android
               <br />
               y el Dashboard Web]
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
      icon: <CalendarDays className="feature-card__icon-svg" />,
      title: "Gestión de Citas",
      description: "Permite a los dueños de mascotas agendar citas fácilmente desde la app móvil. Los veterinarios administran la agenda desde sus dispositivo movil Android.",
    },
    {
      icon: <LineChart className="feature-card__icon-svg" />,
      title: "Rendimiento del Negocio",
      description: "El panel web ofrece estadísticas y reportes sobre el rendimiento de la clínica, pacientes atendidos, flujo de usuarios y más.",
    },
    {
      icon: <Smartphone className="feature-card__icon-svg" />,
      title: "App Móvil y Web",
      description: "Una solución integral con una app nativa para clientes (Android) y un potente sistema de gestión (CRUD) para la veterinaria.",
    },
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="features__header">
          <h2 className="features__title">Todo lo que tu clínica necesita</h2>
          <p className="features__subtitle">
            Una plataforma unificada para optimizar tu gestión y mejorar la atención.
          </p>
        </div>

        <div className="features__grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className="feature-card__icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__description">{feature.description}</p>
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
    <section id="project" className="project">
      <div className="container project__grid">
        {/* Columna para Veterinarios */}
        <div className="project-card">
          <h3 className="project-card__title">Para Veterinarios</h3>
          <p className="project-card__description">
            Simplifica la administración de tu clínica. Con nuestro panel web, podrás gestionar citas, historiales de pacientes y, lo más importante, monitorear el rendimiento de tu negocio con reportes claros.
          </p>
          <ul className="project-card__list">
            <li className="project-card__list-item">✔<span>Optimiza tu agenda</span></li>
            <li className="project-card__list-item">✔<span>Accede a historiales clínicos</span></li>
            <li className="project-card__list-item">✔<span>Analiza el crecimiento de tu negocio</span></li>
          </ul>
        </div>

        {/* Columna para Dueños de Mascotas */}
        <div className="project-card">
          <h3 className="project-card__title">Para Dueños de Mascotas</h3>
          <p className="project-card__description">
            La salud de tu mascota en la palma de tu mano. Nuestra app móvil te permite agendar citas, recibir recordatorios de vacunas y tener toda la información de tus mascotas en un solo lugar.
          </p>
          <ul className="project-card__list">
            <li className="project-card__list-item">✔<span>Agenda citas desde la comodidad de tu casa</span></li>
            <li className="project-card__list-item">✔<span>Recibe recordatorios importantes</span></li>
            <li className="project-card__list-item">✔<span>Consulta el historial de tu mascota</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// --- 5. Componente CTA (Call to Action) ---
function CtaSection() {
  return (
    <section className="cta">
      <div className="container cta__content">
        <h2 className="cta__title">
          ¿Listo para transformar la gestión de tu veterinaria?
        </h2>
        <p className="cta__subtitle">
          Descubre cómo nuestra plataforma puede ayudarte a crecer y a ofrecer un mejor servicio.
        </p>
        <a
          href="#"
          className="button button--secondary"
          onClick={(e) => e.preventDefault()}
        >
          Contáctanos (Próximamente)
        </a>
      </div>
    </section>
  );
}

// --- 6. Componente Footer ---
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__content">
        <p className="footer__copyright">&copy; {new Date().getFullYear()} Vet-App. Todos los derechos reservados.</p>
        <p className="footer__subtitle">Un proyecto integrador.</p>
      </div>
    </footer>
  );
}


// --- Componente Principal APP ---
export default function App() {
  return (
    <div className="app-wrapper">
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