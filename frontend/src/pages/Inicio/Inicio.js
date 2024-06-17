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
  const [usuarioId, setUsuarioId] = useState(null);
  const navigate = useNavigate();

  const fetchDocente = useCallback( async () => {
    getDocente(usuarioId)
      .then((data) => {
        setDocente(data);
        window.sessionStorage.setItem("docente_id", usuarioId);
      })
      .catch((error) => {
        console.log("Error al buscar los ambientes:", error);
      });
    setDocente(docente);
  }, [docente, setDocente, usuarioId]);

  const handleLogout = useCallback(async () => {
    const response = await logout();
    if (response) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (id !== undefined) {
      setUsuarioId(id);
      fetchDocente();
    }
  }, [fetchDocente, id]);

  const isAuthenticated = () => {
    const auth = sessionStorage.getItem("auth");
    if(auth !== null && auth === "false") {
      navigate("/login");
    }
  }

  const renderContent = () => {
    isAuthenticated();
    switch (activeTab) {
      case "registrarAmbiente":
        return <RegistrarAmbiente />;
      case "registrarReserva":
        return <SolicitarReserva />;
      case "listaDeSolicitudes":
        return (
          <ListaDeSolicitudes
            tipoDeUsuario="Admin"
            titulo="Lista de Solicitudes"
          />
        );
      case "misSolicitudes":
        return (
          <ListaDeSolicitudes
            tipoDeUsuario="Docente"
            titulo="Lista de Solicitudes"
          />
        );
      case "busquedaPorNombre":
        return <Buscar />;
      case "busquedaPorCantidad":
        return <BuscarCantidad />;
      case "modificarPorPeriodo":
        return <Modificarperdiodo />;
      case "listaDeDocentes":
        return <ListaDeDocentes tipoDeUsuario="Admin" />;
      case "calendario":
        return <Calendario />;
      case "busquedaPorCalendario":
        return <CalendarioB />;
      case "notificaciones":
        return (
          <ListaDeNotificaciones
            id={id}
            fetchNotifications={fetchNotifications}
            notifications={notifications}
          />
        );
      case "atencionDeSolicitudes":
        return <ListaDeAtencionDeSolicitudes />;
      default:
        return (
          <div className="logo-background">
            <h1 style={{ fontWeight: "bold" }}>
              Bienvenidos al sistema Gestor de ambientes
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
        <Col style={{ paddingRight: "0px", paddingLeft: "0px" }}>
          <Home fetchNotifications={fetchNotifications}>{renderContent()}</Home>
        </Col>
      </Row>
    </div>
  );
};

export default Inicio;
