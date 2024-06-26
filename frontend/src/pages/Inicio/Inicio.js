import React, { useCallback, useEffect, useState } from "react";
import { Button, Nav, Container, Row, Col } from "react-bootstrap";
import { ChevronDoubleLeft, List } from "react-bootstrap-icons";
import logo from "../../assets/images/image.png";
import "./style.css"; // Archivo CSS para estilos del sidebar
import { logout } from "../../services/Authenticacion.service";
import { useNavigate, useParams } from "react-router-dom";
import Home from "../Home";
import Buscar from "../../components/Busquedanombre/Buscar";
import ListaDeSolicitudes from "../../components/ListaDeSolicitudes";
import Modificarperdiodo from "../../components/ModificarPorPeriodo/ModicarPeriodo";
import RegistrarAmbiente from "../../components/RegistrarAmbiente";
import BuscarCantidad from "../../components/BusquedaCantidad/BusquedaPorCantidad";
import Calendario from "../../components/Calendario";
import CalendarioB from "../../components/CalendarioBusqueda";
import ListaDeDocentes from "../../components/ListaDeDocentes/ListaDeDocentes";
import ListaDeAtencionDeSolicitudes from "../../components/AtenderSolicitud/ListaDeAtencionDeSolicitudes";
import SolicitarReserva from "../../components/SolicitudReserva/SolicitarReserva";
import ListaDeNotificaciones from "../../components/ListaDeNotificaciones/ListaDeNotificaciones";
import CancelarReservas from "../../components/CancelarReserva/CancelarReservas";
import { getDocente } from "../../services/SolicitarReserva.service";

const Sidebar = ({
  fetchNotifications,
  notifications,
  notificationsIdNotRead,
}) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState("inicio");
  const [docente, setDocente] = useState({});
  const { id } = useParams("id");
  const navigate = useNavigate();

  const fetchDocente = useCallback(
    async (usuarioId) => {
      getDocente(usuarioId)
        .then((data) => {
          setDocente(data);
          window.sessionStorage.setItem("docente_id", usuarioId);
        })
        .catch((error) => {
          console.log("Error al buscar los ambientes:", error);
        });
      setDocente(docente);
    },
    [docente, setDocente]
  );

  const handleLogout = useCallback(async () => {
    const response = await logout();
    if (response) {
      navigate("/login");
    }
  }, [navigate]);

  const isAuthenticated = () => {
    const auth = sessionStorage.getItem("auth");
    if (auth !== null && auth === "false") {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (id !== null) {
      fetchDocente(id);
    }
  }, []);

  const renderContent = () => {
    isAuthenticated();
    switch (activeTab) {
      case "registrarAmbiente":
        return (
          <div style={{ padding: "1rem" }}>
            {!showSidebar && (
              <div className="Inicio-sidebar-boton-open">
                <Button
                  className="button-list"
                  variant="primary"
                  onClick={() => setShowSidebar(true)}
                >
                  <List />
                </Button>
              </div>
            )}
            <RegistrarAmbiente />
          </div>
        );
      case "registrarReserva":
        return (
          <div
            style={{ padding: "1rem", paddingLeft: "120px", height: "250px" }}
          >
            {!showSidebar && (
              <div className="Inicio-sidebar-boton-open">
                <Button
                  className="button-list"
                  variant="primary"
                  onClick={() => setShowSidebar(true)}
                >
                  <List />
                </Button>
              </div>
            )}
            <SolicitarReserva />
          </div>
        );
      case "listaDeSolicitudes":
        return (
          <div style={{ padding: "1rem" }}>
            {!showSidebar && (
              <div className="Inicio-sidebar-boton-open">
                <Button
                  className="button-list"
                  variant="primary"
                  onClick={() => setShowSidebar(true)}
                >
                  <List />
                </Button>
              </div>
            )}
            <ListaDeSolicitudes
              tipoDeUsuario="Admin"
              titulo="Lista de Solicitudes"
            />
          </div>
        );
      case "misSolicitudes":
        return (
          <div style={{ padding: "1rem" }}>
            {!showSidebar && (
              <div className="Inicio-sidebar-boton-open">
                <Button
                  className="button-list"
                  variant="primary"
                  onClick={() => setShowSidebar(true)}
                >
                  <List />
                </Button>
              </div>
            )}
            <ListaDeSolicitudes
              tipoDeUsuario="Docente"
              titulo="Mis Solicitudes"
            />
          </div>
        );
      case "busquedaPorNombre":
        return (
          <div style={{ padding: "1rem" }}>
            {!showSidebar && (
              <div className="Inicio-sidebar-boton-open">
                <Button
                  className="button-list"
                  variant="primary"
                  onClick={() => setShowSidebar(true)}
                >
                  <List />
                </Button>
              </div>
            )}
            <Buscar />
          </div>
        );
      case "busquedaPorCantidad":
        return (
          <div style={{ padding: "1rem" }}>
            {!showSidebar && (
              <div className="Inicio-sidebar-boton-open">
                <Button
                  className="button-list"
                  variant="primary"
                  onClick={() => setShowSidebar(true)}
                >
                  <List />
                </Button>
              </div>
            )}
            <BuscarCantidad />
          </div>
        );
      case "modificarPorPeriodo":
        return (
          <div style={{ padding: "1rem" }}>
            {!showSidebar && (
              <div className="Inicio-sidebar-boton-open">
                <Button
                  className="button-list"
                  variant="primary"
                  onClick={() => setShowSidebar(true)}
                >
                  <List />
                </Button>
              </div>
            )}
            <Modificarperdiodo showSidebar={showSidebar} />
          </div>
        );
      case "listaDeDocentes":
        return (
          <div style={{ padding: "1rem" }}>
            {!showSidebar && (
              <div className="Inicio-sidebar-boton-open">
                <Button
                  className="button-list"
                  variant="primary"
                  onClick={() => setShowSidebar(true)}
                >
                  <List />
                </Button>
              </div>
            )}
            <ListaDeDocentes tipoDeUsuario="Admin" showSidebar={showSidebar} />
          </div>
        );
      case "calendario":
        return (
          <div style={{ padding: "1rem" }}>
            {!showSidebar && (
              <div className="Inicio-sidebar-boton-open">
                <Button
                  className="button-list"
                  variant="primary"
                  onClick={() => setShowSidebar(true)}
                >
                  <List />
                </Button>
              </div>
            )}
            <Calendario showSidebar={showSidebar} />
          </div>
        );
      case "busquedaPorCalendario":
        return (
          <div style={{ padding: "1rem" }}>
            {!showSidebar && (
              <div className="Inicio-sidebar-boton-open">
                <Button
                  className="button-list"
                  variant="primary"
                  onClick={() => setShowSidebar(true)}
                >
                  <List />
                </Button>
              </div>
            )}
            <CalendarioB showSidebar={showSidebar} />
          </div>
        );
      case "cancelarReserva":
        return (
          <div style={{ padding: "1rem" }}>
            {!showSidebar && (
              <div className="Inicio-sidebar-boton-open">
                <Button
                  className="button-list"
                  variant="primary"
                  onClick={() => setShowSidebar(true)}
                >
                  <List />
                </Button>
              </div>
            )}
            <CancelarReservas showSidebar={showSidebar} />
          </div>
        );
      case "notificaciones":
        return (
          <div style={{ padding: "1rem" }}>
            {!showSidebar && (
              <div className="Inicio-sidebar-boton-open">
                <Button
                  className="button-list"
                  variant="primary"
                  onClick={() => setShowSidebar(true)}
                >
                  <List />
                </Button>
              </div>
            )}
            <ListaDeNotificaciones
              id={id}
              fetchNotifications={fetchNotifications}
              notifications={notifications}
              showSidebar={showSidebar}
            />
          </div>
        );
      case "atencionDeSolicitudes":
        return (
          <div style={{ padding: "1rem" }}>
            {!showSidebar && (
              <div className="Inicio-sidebar-boton-open">
                <Button
                  className="button-list"
                  variant="primary"
                  onClick={() => setShowSidebar(true)}
                >
                  <List />
                </Button>
              </div>
            )}
            <ListaDeAtencionDeSolicitudes showSidebar={showSidebar} />
          </div>
        );
      default:
        return (
          <div className="logo-background"  style={{ padding: "1rem" }}>
            {!showSidebar && (
              <div className="Inicio-sidebar-boton-open">
                <Button
                  className="button-list"
                  variant="primary"
                  onClick={() => setShowSidebar(true)}
                >
                  <List />
                </Button>
              </div>
            )}
            <div
              className={
                showSidebar ? "Inicio-welcome-sidebar" : "Inicio-welcome"
              }
            >
              <span className="justify-items-center">
                <h1 style={{ fontWeight: "bold" }}>
                  Bienvenidos al Sistema de Gestion de Ambientes
                </h1>
                <h4>
                  Disfruta de una experiencia única en tu reserva de ambientes
                </h4>
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        {showSidebar && (
          <Col
            sm={3}
            className={`sidebar ${showSidebar ? "open" : ""}`}
            style={{ overflowY: "scroll" }}
          >
            <div className="logo-container">
              <h4 className="Inicio-aulapro">
                <img src={logo} className="Inicio-logo" alt="logo" />
                AulaPro
              </h4>
              <Button
                onClick={() => setShowSidebar(false)}
                className="sidebar-button-close"
              >
                <ChevronDoubleLeft />
              </Button>
            </div>
            <div className="separador"></div>
            <div className="usuario-header">
              <p>USUARIO: {docente.nombre}</p>
            </div>
            <div className="separador"></div>
            <Nav className="flex-column sidebar-nav">
              <Nav.Link
                active={"inicio" === activeTab}
                eventKey={"inicio"}
                onClick={() => setActiveTab("inicio")}
              >
                Inicio
              </Nav.Link>
              <Nav.Link
                eventKey={"notificaciones"}
                onClick={() => {
                  setActiveTab("notificaciones");
                }}
              >
                <Row>
                  <Col xxl="10">Notificaciones</Col>
                  <Col xxl="2">
                    {notificationsIdNotRead &&
                      notificationsIdNotRead.length > 0 && (
                        <span class="Inicio-notification-count text-center">
                          {notificationsIdNotRead.length < 100
                            ? notificationsIdNotRead.length
                            : "99+"}
                        </span>
                      )}
                  </Col>
                </Row>
              </Nav.Link>
              <Nav.Link
                eventKey={"registrarAmbiente"}
                onClick={() => setActiveTab("registrarAmbiente")}
              >
                Registrar Ambiente
              </Nav.Link>
              <Nav.Link
                eventKey={"registrarReserva"}
                onClick={() => setActiveTab("registrarReserva")}
              >
                Registrar Solicitud de Reserva
              </Nav.Link>
              <Nav.Link
                eventKey={"listaDeSolicitudes"}
                onClick={() => setActiveTab("listaDeSolicitudes")}
              >
                Solicitudes
              </Nav.Link>
              <Nav.Link
                eventKey={"misSolicitudes"}
                onClick={() => setActiveTab("misSolicitudes")}
              >
                Mis Solicitudes
              </Nav.Link>
              <Nav.Link
                eventKey={"busquedaPorNombre"}
                onClick={() => setActiveTab("busquedaPorNombre")}
              >
                Busqueda por Nombre
              </Nav.Link>
              <Nav.Link
                eventKey={"busquedaPorCorreo"}
                onClick={() => setActiveTab("busquedaPorCantidad")}
              >
                Busqueda por Cantidad
              </Nav.Link>
              <Nav.Link
                eventKey={"modificarPorPeriodo"}
                onClick={() => {
                  setActiveTab("modificarPorPeriodo");
                }}
              >
                Modificacion de Periodos
              </Nav.Link>
              <Nav.Link
                eventKey={"listaDeDocentes"}
                onClick={() => setActiveTab("listaDeDocentes")}
              >
                Lista de Docentes
              </Nav.Link>
              <Nav.Link
                eventKey={"calendario"}
                onClick={() => setActiveTab("calendario")}
              >
                Calendario
              </Nav.Link>
              <Nav.Link
                eventKey={"busquedaPorCalendario"}
                onClick={() => setActiveTab("busquedaPorCalendario")}
              >
                Busqueda calendario
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab("cancelarReserva")}>
                Cancelacion de Reservas/Solicitudes
              </Nav.Link>
              <Nav.Link
                eventKey={"atencionDeSolicitudes"}
                onClick={() => {
                  setActiveTab("atencionDeSolicitudes");
                }}
              >
                Atencion de Solicitudes
              </Nav.Link>
              <div className="separador"></div>
              <Nav.Link eventKey={"cerrarSesion"} onClick={handleLogout}>
                Cerrar Sesion
              </Nav.Link>
            </Nav>
          </Col>
        )}

        {/* Contenido */}
        <Col
          sm={!showSidebar ? 12 : 9}
          className={`${
            !showSidebar ? "content" : "sidebar-content"
          } Inicio-components`}
        >
          <Home
            fetchNotifications={fetchNotifications}
            showSidebar={showSidebar}
          >
            {renderContent()}
          </Home>
        </Col>
      </Row>
    </Container>
  );
};

export default Sidebar;