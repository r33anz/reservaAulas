import React, { useState } from "react";
import { Button, Col, Modal, Row, Stack, Tab, Tabs } from "react-bootstrap";
import Buscar from "../../components/Busquedanombre/Buscar";
import ListaDeSolicitudes from "../../components/ListaDeSolicitudes";
import Modificarperdiodo from "../../components/ModificarPorPeriodo/ModicarPeriodo";
import ModificarEstadoDelAmbientePorFecha from "../../components/ModificarAmbiente/EstadoPorFecha/ModificarEstadoDelAmbientePorFecha";
import RegistrarAmbiente from "../../components/RegistrarAmbiente";
import BuscarCantidad from "../../components/BusquedaCantidad/BusquedaPorCantidad";
import "./style.css";

const DashboardAdmin = () => {
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
          <Col className="d-flex justify-content-end align-items-center">
            MODIFICAR POR:
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
                PERIODO
              </Button>
              <Modal
                size="xs"
                aria-labelledby="contained-modal-title-vcenter"
                show={showModalPeriodo}
                onHide={() => setShowModalPeriodo(false)}
                centered
              >
                <Modificarperdiodo onClose={() => setShowModalPeriodo(false)} />
              </Modal>
              <Button
                className="btn text-center align-middle ModificarEstadoDelAmbientePorFecha-button-fecha"
                onClick={() => setShowModalFecha(true)}
              >
                FECHA
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
        </Row>
        <Row xs="auto" sm="auto" xl="auto" xxl="auto">
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
                  <h5 style={{ fontWeight: "bold" }}>
                    RegistrarAmbiente de Ambiente
                  </h5>
                </Button>
                <div>
                  <Tabs
                    defaultActiveKey="busqueda-por-nombre"
                    id="uncontrolled-tab-example"
                    className="mb-3 tabs-admin"
                  >
                    <Tab
                      eventKey="busqueda-por-nombre"
                      title="Busqueda por nombre"
                    >
                      <Buscar />
                    </Tab>
                    <Tab
                      eventKey="buqueda-por-cantidad"
                      title="Busqueda por cantidad"
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
          </Col>
        </Row>
      </Stack>
    </>
  );
};

export default DashboardAdmin;
