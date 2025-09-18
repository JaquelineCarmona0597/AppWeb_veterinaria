// src/components/admin/sidebar.jsx

import { useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import "../../css/adminCss/Sidebar.css";

// reactstrap components
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState(false);

  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };

  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout !== "/admin") {
        return null;
      }
      return (
        <NavItem key={key} className="sidebar__item">
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={closeCollapse}
            end={prop.path === "/dashboard"}
            className={({ isActive }) =>
              "sidebar__link" + (isActive ? " sidebar__link--active" : "")
            }
          >
            <i className={prop.icon} />
            <span>{prop.name}</span>
          </NavLink>
        </NavItem>
      );
    });
  };

  const { routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  // Clases condicionales para el Navbar principal
  const sidebarClasses = `sidebar ${collapseOpen ? 'sidebar--open' : ''}`;

  return (
    <Navbar
      className={sidebarClasses}
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="sidebar__toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="sidebar__toggler-icon" />
        </button>
        
        {/* Brand */}
        {logo ? (
          <NavbarBrand className="sidebar__brand" {...navbarBrandProps}>
            <img
              alt={logo.imgAlt}
              className="sidebar__logo-img"
              src={logo.imgSrc}
            />
          </NavbarBrand>
        ) : null}
        
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="sidebar__mobile-header">
            <Row>
              {logo ? (
                <Col className="sidebar__mobile-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="sidebar__mobile-close" xs="6">
                <button
                  className="sidebar__toggler sidebar__toggler--close"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>

          {/* Navigation */}
          <Nav navbar className="sidebar__nav">{createLinks(routes)}</Nav>

 
          
          {/* Navigation */}
          <Nav className="sidebar__nav sidebar__nav--docs" navbar>

          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // ... (PropTypes sin cambios)
};

export default Sidebar;