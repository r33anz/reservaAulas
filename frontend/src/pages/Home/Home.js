import React from "react";
import {
  Container,
  Stack,
  Image,
  Dropdown,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import {
  BellFill,
  Calendar3,
  EnvelopeFill,
  EnvelopeOpen,
} from "react-bootstrap-icons";
import "./style.css";
import logo from "../../assets/images/image.png";
import "../../components/Busquedanombre/Style.css";
import { Outlet } from "react-router-dom";

const Home = ({ setShowCalendar, showCalendar }) => {
  const formatDistanceToNow = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - messageDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const daysAgo = diffDays === 1 ? "1 día" : `${diffDays} días`;
    const hoursAgo = diffHours === 1 ? "1 hora" : `${diffHours} horas`;
    return `Hace: ${diffDays > 0 ? `${daysAgo} y ` : ""}${hoursAgo}`;
  };

  return (
    <>
      <header className="App-header">
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          onClick={() => setShowCalendar(false)}
        />
        <div className="titulo-header" onClick={() => setShowCalendar(false)}>
          <h3>
            Intelligence
            <br />
            Software
          </h3>
        </div>
        <div className="ico-header">
          <Dropdown autoClose="outside">
            <Dropdown.Toggle as="div" className="home-dropdown">
              <div class="notification-icon">
                <BellFill color="white" size={30} />
                <span class="notification-count">3</span>
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu
              style={{
                background: "#D9D9D9",
                padding: 0,
              }}
            >
              <Container fluid style={{ padding: 0 }}>
                <Row
                  style={{ height: "3rem", paddingLeft: "1rem" }}
                  className="align-items-center"
                >
                  <Col>
                    <Button size="sm" className="Home-button-marcar-todas">Marcar todo como leidas</Button>
                  </Col>
                </Row>
                <div
                  style={{
                    maxHeight: "20rem",
                    overflowY: "auto",
                    overflowX: "hidden",
                    width: "27rem",
                  }}
                >
                  <Col>
                    <Row
                      style={{
                        height: "3rem",
                        background: "rgb(0, 63, 112)",
                        color: "white",
                        paddingLeft: "1rem",
                      }}
                      className="align-items-center"
                    >
                      <Stack direction="horizontal" gap={2}>
                        <Col xs={1}>
                          <EnvelopeFill size={20} />
                        </Col>
                        <Col
                          xs={7}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          Cras justo
                          odioooooooooooooooooooooooooooooooooooooooooooooo
                        </Col>
                        <Col>
                          <small>
                            {formatDistanceToNow("2023-06-05T14:48:00.000Z", {
                              addSuffix: true,
                            })}
                          </small>
                        </Col>
                      </Stack>
                    </Row>
                    <Row
                      style={{
                        height: "3rem",
                        background: "rgba(0, 63, 112, 0.3)",
                        color: "gray",
                        border: "1px solid #003F70",
                        paddingLeft: "1rem",
                      }}
                      className="align-items-center"
                    >
                      <Stack direction="horizontal" gap={2}>
                        <Col xs={1}>
                          <EnvelopeOpen size={20} />
                        </Col>
                        <Col
                          xs={7}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          Cras justo
                          odioooooooooooooooooooooooooooooooooooooooooooooo
                        </Col>
                        <Col>
                          <small>
                            {formatDistanceToNow("2024-06-05T14:48:00.000Z", {
                              addSuffix: true,
                            })}
                          </small>
                        </Col>
                      </Stack>
                    </Row>
                    <Row
                      style={{
                        height: "3rem",
                        background: "#003F70",
                        color: "white",
                        paddingLeft: "1rem",
                      }}
                      className="align-items-center"
                    >
                      <Stack direction="horizontal" gap={2}>
                        <Col xs={1}>
                          <EnvelopeFill size={20} />
                        </Col>
                        <Col
                          xs={7}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          Cras justo
                          odioooooooooooooooooooooooooooooooooooooooooooooo
                        </Col>
                        <Col>
                          <small>
                            {formatDistanceToNow("2024-06-05T14:48:00.000Z", {
                              addSuffix: true,
                            })}
                          </small>
                        </Col>
                      </Stack>
                    </Row>
                    <Row
                      style={{
                        height: "3rem",
                        background: "#003F70",
                        color: "white",
                        paddingLeft: "1rem",
                      }}
                      className="align-items-center"
                    >
                      <Stack direction="horizontal" gap={2}>
                        <Col xs={1}>
                          <EnvelopeFill size={20} />
                        </Col>
                        <Col
                          xs={7}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          Cras justo
                          odioooooooooooooooooooooooooooooooooooooooooooooo
                        </Col>
                        <Col>
                          <small>
                            {formatDistanceToNow("2024-06-05T14:48:00.000Z", {
                              addSuffix: true,
                            })}
                          </small>
                        </Col>
                      </Stack>
                    </Row>
                    <Row
                      style={{
                        height: "3rem",
                        background: "#003F70",
                        color: "white",
                        paddingLeft: "1rem",
                      }}
                      className="align-items-center"
                    >
                      <Stack direction="horizontal" gap={2}>
                        <Col xs={1}>
                          <EnvelopeFill size={20} />
                        </Col>
                        <Col
                          xs={7}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          Cras justo
                          odioooooooooooooooooooooooooooooooooooooooooooooo
                        </Col>
                        <Col>
                          <small>
                            {formatDistanceToNow("2024-06-05T14:48:00.000Z", {
                              addSuffix: true,
                            })}
                          </small>
                        </Col>
                      </Stack>
                    </Row>
                    <Row
                      style={{
                        height: "3rem",
                        background: "#003F70",
                        color: "white",
                        paddingLeft: "1rem",
                      }}
                      className="align-items-center"
                    >
                      <Stack direction="horizontal" gap={2}>
                        <Col xs={1}>
                          <EnvelopeFill size={20} />
                        </Col>
                        <Col
                          xs={7}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          Cras justo
                          odioooooooooooooooooooooooooooooooooooooooooooooo
                        </Col>
                        <Col>
                          <small>
                            {formatDistanceToNow("2024-06-05T14:48:00.000Z", {
                              addSuffix: true,
                            })}
                          </small>
                        </Col>
                      </Stack>
                    </Row>
                    <Row
                      style={{
                        height: "3rem",
                        background: "#003F70",
                        color: "white",
                        paddingLeft: "1rem",
                      }}
                      className="align-items-center"
                    >
                      <Stack direction="horizontal" gap={2}>
                        <Col xs={1}>
                          <EnvelopeFill size={20} />
                        </Col>
                        <Col
                          xs={7}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          Cras justo
                          odioooooooooooooooooooooooooooooooooooooooooooooo
                        </Col>
                        <Col>
                          <small>
                            {formatDistanceToNow("2024-06-05T14:48:00.000Z", {
                              addSuffix: true,
                            })}
                          </small>
                        </Col>
                      </Stack>
                    </Row>
                    <Row
                      style={{
                        height: "3rem",
                        background: "#003F70",
                        color: "white",
                        paddingLeft: "1rem",
                      }}
                      className="align-items-center"
                    >
                      <Stack direction="horizontal" gap={2}>
                        <Col xs={1}>
                          <EnvelopeFill size={20} />
                        </Col>
                        <Col
                          xs={7}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          Cras justo
                          odioooooooooooooooooooooooooooooooooooooooooooooo
                        </Col>
                        <Col>
                          <small>
                            {formatDistanceToNow("2024-06-05T14:48:00.000Z", {
                              addSuffix: true,
                            })}
                          </small>
                        </Col>
                      </Stack>
                    </Row>
                  </Col>
                </div>
              </Container>
            </Dropdown.Menu>
          </Dropdown>
          <Calendar3
            color="white"
            size={30}
            style={{ marginLeft: "20px" }}
            onClick={() => setShowCalendar(!showCalendar)}
          />
        </div>
      </header>
      <Container fluid className="Home-body">
        <Outlet />
      </Container>
      <footer className="App-footer">
        <Container fluid="xs" style={{ padding: "5px" }}>
          <Stack direction="horizontal" gap={1}>
            <Image
              roundedCircle
              src={logo}
              style={{ height: "2rem", width: "2rem" }}
            />
            <small style={{ fontSize: ".6em" }}>
              Copyright ©2024 <br />
              Intelligence Software S.R.L. <br />
              Todos los derechos reservados.
            </small>
          </Stack>
        </Container>
      </footer>
    </>
  );
};

export default Home;
