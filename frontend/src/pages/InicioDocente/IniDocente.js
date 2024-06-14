import React, { useEffect, useState } from "react";
import { Button, Col, Row, Stack, Tab, Tabs , Nav} from "react-bootstrap";
import Buscar from "../../components/Busquedanombre/Buscar";
import CancelarReservas from "../../components/CancelarReserva/CancelarReservas";
import SolcitarReserva from "../../components/SolicitudReserva/SolicitarReserva";
import { useParams } from "react-router-dom";
import { getDocente } from "../../services/SolicitarReserva.service";
import BuscarCantidad from "../../components/BusquedaCantidad/BusquedaPorCantidad";
import "./style.css";
import CalendarioDocente from "../../components/Calendariodocente/CalendarioDocente";

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
        
      case 'modificarPorFecha':
        
      default:
        return <h4>Bienvenidos</h4>;
    }
  };

  return (
    <>
      <Stack gap={2}>
      <Row >
      <h5>
          Bienvenido
          <br />
          USUARIO: {docente.nombre}
        </h5>
      {!showCalendar ? (
            <>
        
        
        <Row>
          <Col sm="3" lg="3" xxl="3" style={{ paddingBottom: "1rem" }}>
            <Nav className="flex-column">
              <Nav.Link onClick={() => setActiveTab('inicio')}>Inicio</Nav.Link>
              <Nav.Link onClick={() => {setActiveTab('registrarAmbiente');setSolicitarReserva(solicitarReserva);}}>Registrar Ambiente</Nav.Link>
              <Nav.Link onClick={() => setActiveTab('listaDeSolicitudes')}>Lista de Solicitudes</Nav.Link>
              <Nav.Link onClick={() => setActiveTab('busquedaPorNombre')}>Busqueda por Nombre</Nav.Link>
              <Nav.Link onClick={() => setActiveTab('busquedaPorCantidad')}>Busqueda por Cantidad</Nav.Link>
              <Nav.Link onClick={() => { setActiveTab('modificarPorPeriodo'); setShowModalPeriodo(true); }}>Modificar por Periodo</Nav.Link>

              <Nav.Link onClick={() => {setActiveTab('modificarPorFecha');setShowModalFecha(true);}}>Modificar por Fecha</Nav.Link>
            </Nav>
          </Col>
          <Col sm="9" lg="9" xxl="9">
            {renderContent()}
          </Col>
        </Row>
        </>
          ) : (
            <CalendarioDocente />
          )}
        </Row>
      </Stack>
    </>
  );
};

export default IniDocente;
