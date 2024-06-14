import React, { useState } from "react";
import { Button, Col, Modal, Row, Stack, Tab, Tabs, Nav } from "react-bootstrap";
import Buscar from "../../components/Busquedanombre/Buscar";
import ListaDeSolicitudes from "../../components/ListaDeSolicitudes";
import Modificarperdiodo from "../../components/ModificarPorPeriodo/ModicarPeriodo";
import ModificarEstadoDelAmbientePorFecha from "../../components/ModificarAmbiente/EstadoPorFecha/ModificarEstadoDelAmbientePorFecha";
import RegistrarAmbiente from "../../components/RegistrarAmbiente";
import BuscarCantidad from "../../components/BusquedaCantidad/BusquedaPorCantidad";
import Calendario from "../../components/Calendario";
import "./style.css";

const Inicio = ({ showCalendar }) => {
  const [registrarAmbiente, setRegistrarAmbiente] = useState(false);
  const [showModalPeriodo, setShowModalPeriodo] = useState(true);
  const [showModalFecha, setShowModalFecha] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');

  const renderContent = () => {
    switch (activeTab) {
      case 'registrarAmbiente':
        return (
          <RegistrarAmbiente
            
          />
        );
      case 'listaDeSolicitudes':
        return (
          <ListaDeSolicitudes
            tipoDeUsuario="Docente"
            titulo="Lista de Solicitudes"
          />
        );
      case 'busquedaPorNombre':
        return <Buscar />;
      case 'busquedaPorCantidad':
        return <BuscarCantidad />;
      case 'modificarPorPeriodo':
        return (
            
            
            <Modificarperdiodo
              onClose={() => setShowModalPeriodo(false)}
            />
          
        );
      case 'modificarPorFecha':
        return (
            <ModificarEstadoDelAmbientePorFecha
              onclose={() => setShowModalFecha(false)}
            />
        );
        case 'Calendario':
        return (
            
            
          <Calendario />
          
        );
      default:
        return <h4>Bienvenidos</h4>;
    }
  };

  return (
    <>
      <Stack gap={2}>
      <Row >
      {!showCalendar ? (
            <>
        
        
        <Row>
          <Col sm="3" lg="3" xxl="3" style={{ paddingBottom: "1rem" }}>
            <Nav className="flex-column">
              <Nav.Link onClick={() => setActiveTab('inicio')}>Inicio</Nav.Link>
              <Nav.Link onClick={() => {setActiveTab('registrarAmbiente');}}>Registrar Ambiente</Nav.Link>
              <Nav.Link onClick={() => setActiveTab('listaDeSolicitudes')}>Lista de Solicitudes</Nav.Link>
              <Nav.Link onClick={() => setActiveTab('busquedaPorNombre')}>Busqueda por Nombre</Nav.Link>
              <Nav.Link onClick={() => setActiveTab('busquedaPorCantidad')}>Busqueda por Cantidad</Nav.Link>
              <Nav.Link onClick={() => { setActiveTab('modificarPorPeriodo'); setShowModalPeriodo(true); }}>Modificar por Periodo</Nav.Link>

              <Nav.Link onClick={() => {setActiveTab('modificarPorFecha');setShowModalFecha(true);}}>Modificar por Fecha</Nav.Link>
              <Nav.Link onClick={() => {setActiveTab('Calendario');}}>Calendario</Nav.Link>
            </Nav>
          </Col>
          <Col sm="9" lg="9" xxl="9">
            {renderContent()}
          </Col>
        </Row>
        </>
          ) : (
            <Calendario />
          )}
        </Row>
      </Stack>
    </>
  );
};

export default Inicio;
