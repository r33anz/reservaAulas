import React, { useEffect, useState } from "react";
import { Button, Col, Row, Stack, Tab, Tabs } from "react-bootstrap";
import Buscar from "../../components/Busquedanombre/Buscar";
import CancelarReservas from "../../components/CancelarReserva/CancelarReservas";
import SolcitarReserva from "../../components/SolicitudReserva/SolicitarReserva";
import { useParams } from "react-router-dom";
import { getDocente } from "../../services/SolicitarReserva.service";
import BuscarCantidad from "../../components/BusquedaCantidad/BusquedaPorCantidad";
import "./style.css";
import CalendarioDocente from "../../components/Calendariodocente/CalendarioDocente";

const DashboardDocente = ({ showCalendar }) => {
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

  return (
    <>
      <Stack gap={2}>
        <h5>
          INICIO
          <br />
          USUARIO: {docente.nombre}
        </h5>
        <Row xs="auto" sm="auto" xl="auto" xxl="auto">
          {!showCalendar ? (
            <>
              <Col sm="3" lg="3" xxl="3" style={{ paddingBottom: "1rem" }}>
                {solicitarReserva ? (
                  <SolcitarReserva
                    onClose={() => setSolicitarReserva(!solicitarReserva)}
                  />
                ) : (
                  <Stack direction="vertical" gap={2}>
                    <Button
                      style={{ width: "100%", background: "#003F70" }}
                      className="btn text-center align-middle"
                      onClick={() => setSolicitarReserva(!solicitarReserva)}
                    >
                      <h5 style={{ fontWeight: "bold" }}>
                        Reserva de Ambiente
                      </h5>
                    </Button>
                    <div>
                      <h5>
                        BUSQUEDA POR:{" "}
                      </h5>
                      <Tabs
                        defaultActiveKey="busqueda-por-nombre"
                        id="uncontrolled-tab-example"
                        className="mb-3 tabs-admin"
                      >
                        <Tab
                          eventKey="busqueda-por-nombre"
                          title={
                            <h5 style={{ fontWeight: "bold", margin: 0 }}>
                              Nombre
                            </h5>
                          }
                        >
                          <Buscar />
                        </Tab>
                        <Tab
                          eventKey="buqueda-por-cantidad"
                          title={
                            <h5 style={{ fontWeight: "bold", margin: 0 }}>
                              Cantidad
                            </h5>
                          }
                        >
                          <BuscarCantidad />
                        </Tab>
                      </Tabs>
                    </div>
                  </Stack>
                )}
              </Col>
              <Col sm="9" lg="9" xxl="9">
                <CancelarReservas
                  tipoDeUsuario="Docente"
                  titulo="Lista de Solicitudes y Reservas"
                />
              </Col>
            </>
          ) : (
            <CalendarioDocente />
          )}
        </Row>
      </Stack>
    </>
  );
};

export default DashboardDocente;
