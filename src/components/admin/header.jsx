import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import '../../css/adminCss/Header.css'; // Importa el nuevo archivo CSS

const Header = () => {
  return (
    <>
      <div className="header-container">
        <Container fluid>
          <div>
            <Row>
              <Col lg="6" xl="3">
                <Card className="stat-card">
                  <CardBody className="stat-card-body">
                    <Row>
                      <div className="col">
                        <CardTitle className="stat-card-title">
                          Tráfico
                        </CardTitle>
                        <span className="stat-card-value">
                          350,897
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="stat-icon-container icon-color-accion">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                    <p className="stat-card-footer">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 3.48%
                      </span>
                      <span className="text-nowrap">Desde el mes pasado</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="stat-card">
                  <CardBody className="stat-card-body">
                    <Row>
                      <div className="col">
                        <CardTitle className="stat-card-title">
                          Nuevos usuarios
                        </CardTitle>
                        <span className="stat-card-value">2,356</span>
                      </div>
                      <Col className="col-auto">
                        <div className="stat-icon-container icon-color-salud">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col>
                    </Row>
                    <p className="stat-card-footer">
                      <span className="text-danger mr-2">
                        <i className="fas fa-arrow-down" /> 3.48%
                      </span>
                      <span className="text-nowrap">Desde la semana pasada</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="stat-card">
                  <CardBody className="stat-card-body">
                    <Row>
                      <div className="col">
                        <CardTitle className="stat-card-title">
                          Ventas
                        </CardTitle>
                        <span className="stat-card-value">924</span>
                      </div>
                      <Col className="col-auto">
                        <div className="stat-icon-container icon-color-base">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                    <p className="stat-card-footer">
                      <span className="text-warning mr-2">
                        <i className="fas fa-arrow-down" /> 1.10%
                      </span>
                      <span className="text-nowrap">Desde ayer</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="stat-card">
                  <CardBody className="stat-card-body">
                    <Row>
                      <div className="col">
                        <CardTitle className="stat-card-title">
                          Rendimiento
                        </CardTitle>
                        <span className="stat-card-value">49,65%</span>
                      </div>
                      <Col className="col-auto">
                        <div className="stat-icon-container icon-color-confianza">
                          <i className="fas fa-percent" />
                        </div>
                      </Col>
                    </Row>
                    <p className="stat-card-footer">
                      <span className="text-success mr-2">
                        <i className="fas fa-arrow-up" /> 12%
                      </span>
                      <span className="text-nowrap">Desde el mes pasado</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;