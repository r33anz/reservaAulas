import React, { useState } from "react";
import { Button, Col, Modal, Row, Stack, Tab, Tabs } from "react-bootstrap";
import Buscar from "../../components/Busquedanombre/Buscar";
import ListaDeSolicitudes from "../../components/ListaDeSolicitudes";
import Modificarperdiodo from "../../components/ModificarPorPeriodo/ModicarPeriodo";
import ModificarEstadoDelAmbientePorFecha from "../../components/ModificarAmbiente/EstadoPorFecha/ModificarEstadoDelAmbientePorFecha";
import RegistrarAmbiente from "../../components/RegistrarAmbiente";
import BuscarCantidad from "../../components/BusquedaCantidad/BusquedaPorCantidad";
import "./style.css";
import Calendario from "../../components/Calendario";

const DashboardAdmin = ({ showCalendar }) => {
  const [registrarAmbiente, setRegistrarAmbiente] = useState(false);
  const [showModalPeriodo, setShowModalPeriodo] = useState(false);
  const [showModalFecha, setShowModalFecha] = useState(false);

  return (
    <>
      <Stack gap={2}>
        <Row>
          <Col sm={8}>
            <h4>INICIO</h4>
          </Col>
          {!showCalendar && (
            <>
              <Col className="d-flex justify-content-end align-items-end">
                <h5>MODIFICAR POR:</h5>
              </Col>
              <Col
                className="justify-content-end align-items-end"
                style={{ display: "flex" }}
              >
                <Stack direction="horizontal" gap={2}>
                  <Button
                    className="btn text-center align-middle ModificarPorPeriodo-button-periodo"
                    onClick={() => setShowModalPeriodo(true)}
                  >
                    <h5 style={{ fontWeight: "bold", margin: 0 }}>Periodo</h5>
                  </Button>
                  <Modal
                    size="xs"
                    aria-labelledby="contained-modal-title-vcenter"
                    show={showModalPeriodo}
                    onHide={() => setShowModalPeriodo(false)}
                    centered
                  >
                    <Modificarperdiodo
                      onClose={() => setShowModalPeriodo(false)}
                    />
                  </Modal>
                  <Button
                    className="btn text-center align-middle ModificarEstadoDelAmbientePorFecha-button-fecha"
                    onClick={() => setShowModalFecha(true)}
                  >
                    <h5 style={{ fontWeight: "bold", margin: 0 }}>Fecha</h5>
                  </Button>
                  <Modal
                    size="xs"
                    aria-labelledby="contained-modal-title-vcenter"
                    show={showModalFecha}
                    onHide={() => setShowModalFecha(false)}
                    centered
                  >
                    <ModificarEstadoDelAmbientePorFecha
                      onclose={() => setShowModalFecha(false)}
                    />
                  </Modal>
                </Stack>
              </Col>
            </>
          )}
        </Row>
        <Row xs="auto" sm="auto" xl="auto" xxl="auto">
          {!showCalendar ? (
            <>
              {" "}
              <Col sm="3" lg="3" xxl="3" style={{ paddingBottom: "1rem" }}>
                {registrarAmbiente ? (
                  <RegistrarAmbiente
                    onClose={() => setRegistrarAmbiente(!registrarAmbiente)}
                  />
                ) : (
                  <Stack direction="vertical" gap={2}>
                    <Button
                      style={{ width: "100%", background: "#003F70" }}
                      className="btn text-center align-middle"
                      onClick={() => setRegistrarAmbiente(!registrarAmbiente)}
                    >
                      <h5 style={{ fontWeight: "bold" }}>Registrar Ambiente</h5>
                    </Button>
                    <div>
                      <h5>BUSQUEDA POR: </h5>
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
                <ListaDeSolicitudes
                  tipoDeUsuario="Docente"
                  titulo="Lista de Solicitudes"
                />
              </Col>{" "}
            </>
          ) : (
            <Calendario />
          )}
        </Row>
      </Stack>
    </>
  );
};

export default DashboardAdmin;
