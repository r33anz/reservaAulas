import React, { useEffect, useState } from "react";
import { Button, Col, Row, Stack, Tab, Tabs , Nav} from "react-bootstrap";
import logo from "../../assets/images/image.png";
import Home from "../Home";
import { AlertsProvider } from "../../components/Alert/AlertsContext";
import Buscar from "../../components/Busquedanombre/Buscar";
import CancelarReservas from "../../components/CancelarReserva/CancelarReservas";
import SolcitarReserva from "../../components/SolicitudReserva/SolicitarReserva";
import { useParams } from "react-router-dom";
import { getDocente } from "../../services/SolicitarReserva.service";
import BuscarCantidad from "../../components/BusquedaCantidad/BusquedaPorCantidad";
import "./style.css";
import CalendarioDocente from "../../components/Calendariodocente/CalendarioDocente";
import CalendarioB from "../../components/CalendarioBusqueda";

const IniDocente = ({ showCalendar }) => {
  const [registrarAmbiente, setRegistrarAmbiente] = useState(false);
  const [showModalPeriodo, setShowModalPeriodo] = useState(true);
  const [showModalFecha, setShowModalFecha] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');
  const [solicitarReserva, setSolicitarReserva] = useState(false);
  const [docente, setDocente] = useState({});
  const { id } = useParams("id");
  window.sessionStorage.setItem("docente_id", id);
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
    fetchDocente();
  }, [id]);
  const renderContent = () => {
    switch (activeTab) {
      case 'registrarAmbiente':
        return (
            <SolcitarReserva
            //onClose={() => setSolicitarReserva(solicitarReserva)}
          />
        );
      case 'listaDeSolicitudes':
        return (
            <CancelarReservas
            tipoDeUsuario="Docente"
            titulo="Lista de Solicitudes y Reservas"
          />
        );
      case 'busquedaPorNombre':
        return <Buscar />;
      case 'busquedaPorCantidad':
        return <BuscarCantidad />;
      case 'modificarPorPeriodo':
        return "";
      case 'modificarPorFecha':
        case "Calendario":
        return <CalendarioDocente />;
      case "CalendarioB":
        return <CalendarioB />;
      case "notificaciones":
        return <h1>not</h1>;
      default:
        return <h4>Bienvenidos</h4>;
    }
  };

  return (
    <div className="inicio-container">
      <Row className="prueba">
        {!showCalendar ? (
          <>
            <Col sm="2" className="sidebar">
              <div className="logo-container">
                <img src={logo} className="App-logo" alt="logo" />
                <div className="titulo-header">
                  <h4>Intelligence<br />Software</h4>
                </div>
              </div>
              <div className="separador"></div>
              <div className="usuario-header">
                <h5>USUARIO: {docente.nombre}</h5>
              </div>
              <div className="separador"></div>
              <div className="nav-container">
            <Nav className="flex-column">
              <Nav.Link onClick={() => setActiveTab('inicio')}>Inicio</Nav.Link>
              <Nav.Link onClick={() => {setActiveTab('registrarAmbiente');setSolicitarReserva(solicitarReserva);}}>Registrar Ambiente</Nav.Link>
              <Nav.Link onClick={() => setActiveTab('listaDeSolicitudes')}>Lista de Solicitudes</Nav.Link>
              <Nav.Link onClick={() => setActiveTab('busquedaPorNombre')}>Busqueda por Nombre</Nav.Link>
              <Nav.Link onClick={() => setActiveTab('busquedaPorCantidad')}>Busqueda por Cantidad</Nav.Link>
              <Nav.Link onClick={() => { setActiveTab('modificarPorPeriodo'); setShowModalPeriodo(true); }}>Modificar por Periodo</Nav.Link>

              <Nav.Link onClick={() => {setActiveTab('modificarPorFecha');setShowModalFecha(true);}}>Modificar por Fecha</Nav.Link>
              <Nav.Link onClick={() => setActiveTab("Calendario")}>Calendario</Nav.Link>
                  <Nav.Link onClick={() => setActiveTab("CalendarioB")}>Busqueda calendario</Nav.Link>
                  <Nav.Link onClick={() => setActiveTab("notificaciones")}>Notificaciones</Nav.Link>
            </Nav>
            </div>
            </Col>
            <Col style={{ paddingRight: "0px", paddingLeft: "0px" }}>
              <AlertsProvider>
                <Home showCalendar={showCalendar}>
                  {renderContent()}
                </Home>
              </AlertsProvider>
            </Col>
          </>
        ) : (
          <CalendarioDocente />
        )}
      </Row>
    </div>
  );
};

export default IniDocente;
