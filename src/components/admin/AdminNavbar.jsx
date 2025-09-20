import { Link } from "react-router-dom";
import avatarImage from "../../assets/react.svg";
// --- 1. Importa tu nuevo archivo CSS ---
import "../../css/adminCss/AdminNavbar.css";

// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";

const AdminNavbar = (props) => {
  return (
    <>
      {/* --- 2. Reemplaza los classNames por los nuevos --- */}
      <Navbar className="admin-navbar" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="admin-navbar__brand"
            to="/"
          >
            {props.brandText}
          </Link>
          <Form className="admin-navbar__search-form">
            <FormGroup>
              <InputGroup>
                <InputGroupText>
                  <i className="fas fa-search" />
                </InputGroupText>
                <Input placeholder="Search" type="text" />
              </InputGroup>
            </FormGroup>
          </Form>
          <Nav className="admin-navbar__nav" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle nav>
                <Media className="user-profile">
                  <img
                    alt="..."
                    src={avatarImage}
                    className="user-profile__avatar"
                  />
                  <Media className="user-profile__media">
                    <span className="user-profile__name">
                      Jessica Jones
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="dropdown-header" header tag="div">
                  <h6 className="dropdown-header__title">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Activity</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Support</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;