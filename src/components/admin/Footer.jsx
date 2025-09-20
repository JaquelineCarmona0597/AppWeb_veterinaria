import { Row, Col, Nav, NavItem, NavLink } from "reactstrap";
import '../../css/adminCss/Footer.css'; // Importamos los estilos del footer

const Footer = () => {
  return (
    <footer className="footer-container">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="6">
          <div className="copyright-text">
            © {new Date().getFullYear()}{" "}
            <a
              className="font-weight-bold ml-1"
              href="#" // Puedes poner aquí el enlace principal de tu app
              rel="noopener noreferrer"
              target="_blank"
            >
              Patita Feliz
            </a>
          </div>
        </Col>

        <Col xl="6">
          <Nav className="footer-nav">
            <NavItem>
              <NavLink href="#">
                Inicio
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="#">
                Sobre Nosotros
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="#">
                Blog
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;