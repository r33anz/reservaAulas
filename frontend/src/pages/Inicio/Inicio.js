import React, { useEffect, useState } from "react";
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
import { AlertsProvider } from "../../components/Alert/AlertsContext";
import ListaDeAtencionDeSolicitudes from "../../components/AtenderSolicitud/ListaDeAtencionDeSolicitudes";
import "./style.css";
import SolicitarReserva from "../../components/SolicitudReserva/SolicitarReserva";
import ListaDeNotificaciones from "../../components/ListaDeNotificaciones/ListaDeNotificaciones";
import { getDocente } from "../../services/SolicitarReserva.service";
import { useParams } from "react-router-dom";

const Inicio = ({
  fetchNotifications,
  notifications,
  notificationsIdNotRead,
}) => {
  const [activeTab, setActiveTab] = useState("inicio");
  const [docente, setDocente] = useState({});
  const { id } = useParams("id");
  const [usuarioId, setUsuarioId] = useState(null);

  const fetchDocente = async () => {
    getDocente(id)
      .then((data) => {
        setDocente(data);
      })
      .catch((error) => {
        console.log("Error al buscar los ambientes:", error);
      });
    setDocente(docente);
  };

  useEffect(() => {
    if (id !== undefined) {
      window.sessionStorage.setItem("docente_id", id);
      setUsuarioId(id);
    }
    fetchDocente();
  }, [id]);

  const renderContent = () => {
    switch (activeTab) {
      case "registrarAmbiente":
        return <RegistrarAmbiente />;
      case "registrarReserva":
        return <SolicitarReserva />;
      case "listaDeSolicitudes":
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
        return <h4>Bienvenidos</h4>;
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
            <h5>USUARIO: {docente.nombre}</h5>
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
                  <Col xxl="10">Lista de Notificaciones</Col>
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
                Lista de Solicitudes
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
            </Nav>
          </div>
        </Col>
        <Col style={{ paddingRight: "0px", paddingLeft: "0px" }}>
            <Home fetchNotifications={fetchNotifications} >{renderContent()}</Home>
        </Col>
      </Row>
    </div>
  );
};

export default Inicio;
