import React, { useState } from "react";
import { Col, Nav, Row } from "react-bootstrap";
import logo from "../../assets/images/image.png";
import Home from "../Home";
import Buscar from "../../components/Busquedanombre/Buscar";
import ListaDeSolicitudes from "../../components/ListaDeSolicitudes";
import Modificarperdiodo from "../../components/ModificarPorPeriodo/ModicarPeriodo";
import ModificarEstadoDelAmbientePorFecha from "../../components/ModificarAmbiente/EstadoPorFecha/ModificarEstadoDelAmbientePorFecha";
import RegistrarAmbiente from "../../components/RegistrarAmbiente";
import BuscarCantidad from "../../components/BusquedaCantidad/BusquedaPorCantidad";
import Calendario from "../../components/Calendario";
import CalendarioB from "../../components/CalendarioBusqueda";
import { AlertsProvider } from "../../components/Alert/AlertsContext";
import "./style.css";

const Inicio = ({ showCalendar }) => {
  const [showModalPeriodo, setShowModalPeriodo] = useState(true);
  const [showModalFecha, setShowModalFecha] = useState(false);
  const [activeTab, setActiveTab] = useState("inicio");

  const renderContent = () => {
    switch (activeTab) {
      case "registrarAmbiente":
        return <RegistrarAmbiente />;
      case "listaDeSolicitudes":
        return <ListaDeSolicitudes tipoDeUsuario="Docente" titulo="Lista de Solicitudes" />;
      case "busquedaPorNombre":
        return <Buscar />;
      case "busquedaPorCantidad":
        return <BuscarCantidad />;
      case "modificarPorPeriodo":
        return <Modificarperdiodo onClose={() => setShowModalPeriodo(false)} />;
      case "modificarPorFecha":
        return <ModificarEstadoDelAmbientePorFecha onclose={() => setShowModalFecha(false)} />;
      case "Calendario":
        return <Calendario />;
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
                <h5>USUARIO: Admin</h5>
              </div>
              <div className="separador"></div>
              <div className="nav-container">
                <Nav className="flex-column">
                  <Nav.Link onClick={() => setActiveTab("inicio")}>Inicio</Nav.Link>
                  <Nav.Link onClick={() => setActiveTab("registrarAmbiente")}>Registrar Ambiente</Nav.Link>
                  <Nav.Link onClick={() => setActiveTab("listaDeSolicitudes")}>Lista de Solicitudes</Nav.Link>
                  <Nav.Link onClick={() => setActiveTab("busquedaPorNombre")}>Busqueda por Nombre</Nav.Link>
                  <Nav.Link onClick={() => setActiveTab("busquedaPorCantidad")}>Busqueda por Cantidad</Nav.Link>
                  <Nav.Link onClick={() => { setActiveTab("modificarPorPeriodo"); setShowModalPeriodo(true); }}>
                    Modificar por Periodo
                  </Nav.Link>
                  <Nav.Link onClick={() => { setActiveTab("modificarPorFecha"); setShowModalFecha(true); }}>
                    Modificar por Fecha
                  </Nav.Link>
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
          <Calendario />
        )}
      </Row>
    </div>
  );
};

export default Inicio;
