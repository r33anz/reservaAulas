import React, { useCallback, useEffect, useState } from "react";
import { Col, Nav, Row } from "react-bootstrap";
import logo from "../../assets/images/image.png";
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
import "./style.css";
import SolicitarReserva from "../../components/SolicitudReserva/SolicitarReserva";
import ListaDeNotificaciones from "../../components/ListaDeNotificaciones/ListaDeNotificaciones";
import { getDocente } from "../../services/SolicitarReserva.service";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../../services/Authenticacion.service";

const Inicio = ({
  fetchNotifications,
  notifications,
  notificationsIdNotRead,
}) => {
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

  useEffect(() => {
    if (id !== null) {
      fetchDocente(id);
    }
  }, []);

  const isAuthenticated = () => {
    const auth = sessionStorage.getItem("auth");
    if (auth !== null && auth === "false") {
      navigate("/login");
    }
  };

  const renderContent = () => {
    isAuthenticated();
    switch (activeTab) {
      case "registrarAmbiente":
        return (
          <div style={{ padding: "1rem" }}>
            <RegistrarAmbiente />
          </div>
        );
      case "registrarReserva":
        return (
          <div style={{ padding: "1rem" }}>
            <SolicitarReserva />
          </div>
        );
      case "listaDeSolicitudes":
        return (
          <div style={{ padding: "1rem" }}>
            <ListaDeSolicitudes
              tipoDeUsuario="Admin"
              titulo="Lista de Solicitudes"
            />
          </div>
        );
      case "misSolicitudes":
        return (
          <div style={{ padding: "1rem" }}>
            <ListaDeSolicitudes
              tipoDeUsuario="Docente"
              titulo="Lista de Solicitudes"
            />
          </div>
        );
      case "busquedaPorNombre":
        return (
          <div style={{ padding: "1rem" }}>
            <Buscar />
          </div>
        );
      case "busquedaPorCantidad":
        return (
          <div style={{ padding: "1rem" }}>
            <BuscarCantidad />
          </div>
        );
      case "modificarPorPeriodo":
        return (
          <div style={{ padding: "1rem" }}>
            <Modificarperdiodo />
          </div>
        );
      case "listaDeDocentes":
        return (
          <div style={{ padding: "1rem" }}>
            <ListaDeDocentes tipoDeUsuario="Admin" />
          </div>
        );
      case "calendario":
        return (
          <div style={{ padding: "1rem" }}>
            {" "}
            <Calendario />{" "}
          </div>
        );
      case "busquedaPorCalendario":
        return (
          <div style={{ padding: "1rem" }}>
            <CalendarioB />
          </div>
        );
      case "notificaciones":
        return (
          <div style={{ padding: "1rem" }}>
            <ListaDeNotificaciones
              id={id}
              fetchNotifications={fetchNotifications}
              notifications={notifications}
            />
          </div>
        );
      case "atencionDeSolicitudes":
        return (
          <div style={{ padding: "1rem" }}>
            <ListaDeAtencionDeSolicitudes />
          </div>
        );
      default:
        return (
          <div className="logo-background">
            <h1 style={{ fontWeight: "bold" }}>
              Bienvenidos al Sistema de Gestion de Ambientes
            </h1>
            <h4>
              Disfruta de una experiencia única en tu reserva de ambientes
            </h4>
          </div>
        );
    }
  };

  return (
    <div className="inicio-container">
      <Row className="prueba">
        <Col sm="2" className="sidebar">
          <div className="logo-container">
            <img src={logo} className="App-logo" alt="logo" />
            <div className="titulo-header">
              <h4>
                Intelligence
                <br />
                Software
              </h4>
            </div>
          </div>
          <div className="separador"></div>
          <div className="usuario-header">
            <p>USUARIO: {docente.nombre}</p>
          </div>
          <div className="separador"></div>
          <div className="nav-container">
            <Nav className="flex-column">
              <Nav.Link onClick={() => setActiveTab("inicio")}>Inicio</Nav.Link>
              <Nav.Link
                onClick={() => {
                  setActiveTab("notificaciones");
                }}
              >
                <Row>
                  <Col xxl="10">Notificaciones</Col>
                  <Col xxl="2">
                    {notificationsIdNotRead &&
                      notificationsIdNotRead.length > 0 && (
                        <span class="IniDocente-notification-count text-center">
                          {notificationsIdNotRead.length < 100
                            ? notificationsIdNotRead.length
                            : "99+"}
                        </span>
                      )}
                  </Col>
                </Row>
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab("registrarAmbiente")}>
                Registrar Ambiente
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab("registrarReserva")}>
                Registrar Reserva
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab("listaDeSolicitudes")}>
                Solicitudes
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab("misSolicitudes")}>
                Mis Solicitudes
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab("busquedaPorNombre")}>
                Busqueda por Nombre
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab("busquedaPorCantidad")}>
                Busqueda por Cantidad
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  setActiveTab("modificarPorPeriodo");
                }}
              >
                Modificar por Periodo
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab("listaDeDocentes")}>
                Lista de Docentes
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab("calendario")}>
                Calendario
              </Nav.Link>
              <Nav.Link onClick={() => setActiveTab("busquedaPorCalendario")}>
                Busqueda calendario
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  setActiveTab("atencionDeSolicitudes");
                }}
              >
                Atencion de Solicitudes
              </Nav.Link>
              <div className="separador"></div>
              <Nav.Link onClick={handleLogout}>Cerrar Sesion</Nav.Link>
              <div className="separador"></div>
            </Nav>
          </div>
        </Col>
        <Col className="Inicio-components">
          <Home fetchNotifications={fetchNotifications}>{renderContent()}</Home>
        </Col>
      </Row>
    </div>
  );
};

export default Inicio;
