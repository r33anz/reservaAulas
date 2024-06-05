import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Stack,
} from "react-bootstrap";
import {
  CheckCircleFill,
  ExclamationCircleFill,
  XSquareFill,
} from "react-bootstrap-icons";
import "./style.css";
import { AlertsContext } from "../Alert/AlertsContext";
import {
  aceptarSolicitud,
  getSolicitudPorId,
  rechazarSolicitud,
  validarSolicitudAtentida,
  vertificarDisponibilidad,
} from "../../services/AtenderSolicitud.service";
import { useParams } from "react-router-dom";

const AtenderSolicitud = ({solicitudId}) => {
  const { id } = useParams("id");
  const [show, setShow] = useState(false);
  const [esSolicitudAtentida, setEsSolicitudAtentida] = useState(false);
  const [razonRechazo, setRazonRechazo] = useState();
  const [mostrarMensajeDeVerificacion, setMostrarMensajeDeVerificacion] =
    useState(null);
  const { agregarAlert } = useContext(AlertsContext);
  const [solicitud, setSolicitud] = useState({});
  const periodos = [
    { id: 1, hora: "6:45 - 8:15", isHabilitado: true },
    { id: 2, hora: "8:15 - 9:45", isHabilitado: true },
    { id: 3, hora: "9:45 - 11:15", isHabilitado: true },
    { id: 4, hora: "11:15 - 12:45", isHabilitado: true },
    { id: 5, hora: "12:45 - 14:15", isHabilitado: true },
    { id: 6, hora: "14:15 - 15:45", isHabilitado: true },
    { id: 7, hora: "15:45 - 17:15", isHabilitado: false },
    { id: 8, hora: "17:15 - 18:45", isHabilitado: false },
    { id: 9, hora: "18:45 - 20:15", isHabilitado: false },
    { id: 10, hora: "20:15 - 21:45", isHabilitado: false },
  ];

  const loadSolicitudPorId = async (solicitudId) => {
    const response = await getSolicitudPorId(solicitudId);
    if (response) {
      setSolicitud(response);
    }
  };

  const getPeriodoPorId = (periodoInicioId, periodoFinId) => {
    const periodoReserva = periodos
      .filter((periodo) => {
        return periodo.id === periodoInicioId || periodo.id === periodoFinId;
      })
      .map((periodo) => periodo.hora);
    return (
      <>
        {" "}
        De {periodoReserva[0]} a {periodoReserva[1]}
      </>
    );
  };

  const onClickParaVerificarDisponibilidad = async () => {
    if (Object.getOwnPropertyNames(solicitud).length > 0) {
      const response = await vertificarDisponibilidad(
        solicitud.fecha,
        solicitud.id_ambiente,
        [solicitud.periodo_ini_id, solicitud.periodo_fin_id]
      );
      if (response) {
        setMostrarMensajeDeVerificacion(response);
        validarSolicitud(id);
      }
    } else {
      agregarAlert({
        icon: <ExclamationCircleFill />,
        severidad: "danger",
        mensaje: "Hay solicitud para realizar la verificacion.",
      });
    }
  };

  const onClickRechazarSolicitud = async () => {
    setShow(false);
    let response = await rechazarSolicitud(id, razonRechazo);
    if (response !== null) {
      agregarAlert({
        icon: <CheckCircleFill />,
        severidad: "success",
        mensaje: "Solicitud rechazada enviada.",
      });
      setEsSolicitudAtentida(true);
    } else {
      agregarAlert({
        icon: <ExclamationCircleFill />,
        severidad: "danger",
        mensaje: "No se pudo enviar la solicitud rechazada.",
      });
    }
  };

  const onClickAceptarSolicitud = async () => {
    setShow(false);
    let response = await aceptarSolicitud(id);
    if (response !== null) {
      agregarAlert({
        icon: <CheckCircleFill />,
        severidad: "success",
        mensaje: response.mensaje,
      });
      setEsSolicitudAtentida(true);
    } else {
      agregarAlert({
        icon: <ExclamationCircleFill />,
        severidad: "danger",
        mensaje: "No se pudo enviar la solicitud aceptada.",
      });
    }
  };

  const validarSolicitud = useCallback(async (solicitudId) => {
    const response = await validarSolicitudAtentida(solicitudId);
    if (response) {
      setEsSolicitudAtentida(response.atendida);
    }
  }, []);

  useEffect(() => {
    loadSolicitudPorId(id);
    validarSolicitud(id);
  }, [id]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col sm="4">
            <Row sm className="text-white AtenderSolicitud-header">
              <Col
                xs="12"
                className="d-flex justify-content-start align-items-center"
                style={{ height: "100%" }}
              >
                <h3 style={{ fontWeight: "bold" }} className="">
                  Atender Solicitud
                </h3>
              </Col>
            </Row>
            <Row className="AtenderSolicitud-body justify-content-center">
              <Col sm>
                <Container fluid>
                  <Row sm>
                    <Col sm="6">
                      <Row style={{ background: "white" }}>
                        <h5>
                          <strong>Detalles Peticion docente</strong>
                        </h5>
                      </Row>
                      <Row style={{ background: "white" }}>
                        <div>
                          <strong>Nombre del docente:</strong>{" "}
                          {solicitud.nombreDocente}
                        </div>
                        <div>
                          <strong>Materia:</strong> {solicitud.materia}
                        </div>
                        <div>
                          <strong>Grupo</strong> {solicitud.grupo}
                        </div>
                        <div>
                          <strong>Nombre del ambiente:</strong>{" "}
                          {solicitud.ambiente_nombre}
                        </div>
                        <div>
                          <strong>Cantidad de Alumnos:</strong>{" "}
                          {solicitud.cantidad}
                        </div>
                        <div>
                          <strong>Razon:</strong> {solicitud.razon}
                        </div>
                        <div>
                          <strong>Fecha:</strong> {solicitud.fecha}
                        </div>
                        <div>
                          <strong>Periodos:</strong>
                        </div>
                        <div>
                          {solicitud.periodo_ini_id && solicitud.periodo_fin_id
                            ? getPeriodoPorId(
                                solicitud.periodo_ini_id,
                                solicitud.periodo_fin_id
                              )
                            : ""}
                        </div>
                      </Row>
                    </Col>
                    <Col sm="1"></Col>
                    <Col sm="5" style={{ background: "white" }}>
                      <Row style={{ background: "white" }}>
                        <h5>
                          <strong>Detalles del Ambiente</strong>
                        </h5>
                      </Row>
                      <Row style={{ background: "white" }}>
                        <div>
                          <strong>Nombre del ambiente:</strong>{" "}
                          {solicitud.ambiente_nombre}
                        </div>
                        <div>
                          <strong>Cantidad Maxima de Alumnos:</strong>{" "}
                          {solicitud.ambienteCantidadMax}
                        </div>
                      </Row>
                    </Col>
                  </Row>
                  {esSolicitudAtentida && (
                    <Row
                      style={{ paddingTop: "1rem" }}
                    >
                      Solicitud atendida
                    </Row>
                  )}
                  {!esSolicitudAtentida &&
                  <>
                    <Row
                      xs="auto"
                      sm="auto"
                      style={{ paddingTop: "1rem" }}
                    >
                      <div
                        style={{ width: "71%", padding: 0 }}
                        className="justify-content-start text-left"
                      >
                        {Object.getOwnPropertyNames(solicitud).length > 0 &&
                        mostrarMensajeDeVerificacion !== null
                          ? mostrarMensajeDeVerificacion.valido
                            ? "Ambiente disponible"
                            : "Ambiente no disponible"
                          : ""}
                      </div>
                      <Button
                        size="sm"
                        className="btn AtenderSolicitud-button-disponibilidad"
                        onClick={onClickParaVerificarDisponibilidad}
                      >
                        Verificar Disponibilidad
                      </Button>
                    </Row>
                    {mostrarMensajeDeVerificacion && (
                      <Row xs="auto" style={{ paddingTop: "1rem" }}>
                        <Stack direction="horizontal" gap={2}>
                          <Button
                            size="sm"
                            className="btn AtenderSolicitud-button-rechazar"
                            onClick={() => setShow(!show)}
                          >
                            Rechazar
                          </Button>
                          {mostrarMensajeDeVerificacion !== null &&
                            mostrarMensajeDeVerificacion.valido && (
                              <Button
                                size="sm"
                                className="btn AtenderSolicitud-button-aceptar"
                                onClick={onClickAceptarSolicitud}
                              >
                                Aceptar
                              </Button>
                            )}
                        </Stack>
                      </Row>
                    )}
                  </>}
                </Container>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Modal
        size="xs"
        aria-labelledby="contained-modal-title-vcenter"
        show={show}
        onHide={() => setShow(false)}
        centered
      >
        <Row sm className="text-white AtenderSolicitud-modal-header">
          <Col
            xs="10"
            className="d-flex justify-content-start align-items-center"
            style={{ height: "100%" }}
          >
            <h4 style={{ fontWeight: "bold" }} className="">
              Razon de rechazo
            </h4>
          </Col>
          <Col
            xs="2"
            className="d-flex justify-content-end align-items-end"
            style={{ padding: 0 }}
          >
            <div
              onClick={() => setShow(false)}
              className="AtenderSolicitud-header-button-close d-flex justify-content-center align-items-center"
            >
              <XSquareFill size={24} />
            </div>
          </Col>
        </Row>
        <Row className="AtenderSolicitud-modal-body justify-content-center">
          <Row>
            <Col style={{ paddingBottom: "0.5rem" }}>
              <Form.Control
                as="textarea"
                placeholder="Escriba la razon por el cual esta rechazando esta solicitud"
                style={{ height: "100px" }}
                onChange={(e) => setRazonRechazo(e.target.value)}
                onBlur={(e) => setRazonRechazo(e.target.value)}
                value={razonRechazo}
              />
            </Col>
          </Row>
          <Row xs="auto" className="justify-content-md-end">
            <Stack direction="horizontal" gap={2}>
              <Button
                className="btn AtenderSolicitud-button-cancel"
                onClick={() => setShow(!show)}
              >
                Cancelar
              </Button>
              <Button
                className="btn AtenderSolicitud-button-enviar"
                onClick={onClickRechazarSolicitud}
              >
                Enviar
              </Button>
            </Stack>
          </Row>
        </Row>
      </Modal>
    </>
  );
};

export default AtenderSolicitud;
