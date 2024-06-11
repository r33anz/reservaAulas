import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
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

const AtenderSolicitud = ({ solicitudId, onClose }) => {
  const [show, setShow] = useState(false);
  const [esSolicitudAtentida, setEsSolicitudAtentida] = useState(false);
  const [razonRechazo, setRazonRechazo] = useState();
  const [mostrarMensajeDeVerificacion, setMostrarMensajeDeVerificacion] =
    useState(null);
  const { agregarAlert } = useContext(AlertsContext);
  const [solicitud, setSolicitud] = useState({});
  const [loading, setLoading] = useState(false);
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
        setMostrarMensajeDeVerificacion(response[0]);
        validarSolicitud(solicitudId);
        if (response[0].estado) {
          agregarAlert({
            icon: <ExclamationCircleFill />,
            severidad: "warning",
            mensaje: response[0].mensaje,
          });
        }
      } else {
        agregarAlert({
          icon: <ExclamationCircleFill />,
          severidad: "danger",
          mensaje: "Error al verificar disponibilidad.",
        });
      }
    } else {
      agregarAlert({
        icon: <ExclamationCircleFill />,
        severidad: "warning",
        mensaje: "Hay solicitud para realizar la verificacion.",
      });
    }
  };

  const onClickRechazarSolicitud = async () => {
    setLoading(true);
    let response = await rechazarSolicitud(solicitudId, razonRechazo);
    if (response !== null) {
      agregarAlert({
        icon: <CheckCircleFill />,
        severidad: "success",
        mensaje: "Solicitud rechazada enviada.",
      });
      setLoading(false);
      setShow(false);
      onClose();
      setEsSolicitudAtentida(true);
    } else {
      agregarAlert({
        icon: <ExclamationCircleFill />,
        severidad: "warning",
        mensaje: "No se pudo enviar la solicitud rechazada.",
      });
    }
  };

  const onClickAceptarSolicitud = async () => {
    setLoading(true);
    let response = await aceptarSolicitud(solicitudId);
    if (response !== null) {
      setLoading(false);
      setShow(false);
      onClose();
      agregarAlert({
        icon: <CheckCircleFill />,
        severidad: "success",
        mensaje: response.mensaje,
      });

      setEsSolicitudAtentida(true);
    } else {
      agregarAlert({
        icon: <ExclamationCircleFill />,
        severidad: "warning",
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
    setMostrarMensajeDeVerificacion(null);
    loadSolicitudPorId(solicitudId);
  }, [solicitudId]);

  return (
    <>
      <Container fluid>
        <Row sm className="text-white AtenderSolicitud-header">
          <Col
            xs="10"
            className="d-flex justify-content-start align-items-center"
            style={{ height: "100%" }}
          >
            <h4 style={{ fontWeight: "bold" }} className="">
              Detalle de la Solicitud de Reserva
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
              <XSquareFill size={24} onClick={onClose} />
            </div>
          </Col>
        </Row>
        <Row className="AtenderSolicitud-body justify-content-center">
          <Stack gap={3}>
            <Row style={{ margin: 0 }}>
              <Row style={{ background: "white", margin: 0 }}>
                <h5>
                  <strong>Detalles del Ambiente</strong>
                </h5>
              </Row>
              <Row style={{ background: "white", margin: 0 }}>
                <div>
                  <strong>Nombre del ambiente:</strong>{" "}
                  {solicitud.ambiente_nombre}
                </div>
                <div>
                  <strong>Cantidad Maxima de Alumnos:</strong>{" "}
                  {solicitud.ambienteCantidadMax}
                </div>
              </Row>
            </Row>
            <Row style={{ margin: 0 }}>
              <Row style={{ background: "white", margin: 0 }}>
                <h5>
                  <strong>Detalles Peticion docente</strong>
                </h5>
              </Row>
              <Row style={{ background: "white", margin: 0 }}>
                <div>
                  <strong>Nombre del docente:</strong> {solicitud.nombreDocente}
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
                  <strong>Cantidad de Alumnos:</strong> {solicitud.cantidad}
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
            </Row>
          </Stack>
          <Row
            xs="auto"
            sm="auto"
            style={{ padding: 0, paddingTop: "0.5rem" }}
            className="justify-content-end"
          >
            <div
              style={{ width: "60%" }}
              className="justify-content-start text-left"
            >
              {Object.getOwnPropertyNames(solicitud).length > 0 &&
              mostrarMensajeDeVerificacion !== null
                ? mostrarMensajeDeVerificacion.alerta === "exito"
                  ? "Ambiente disponible"
                  : mostrarMensajeDeVerificacion.alerta === "advertencia"
                  ? mostrarMensajeDeVerificacion.mensaje
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
          <Row xs="auto" style={{ paddingTop: "1rem" }}>
            <Stack direction="horizontal" gap={2}>
              {mostrarMensajeDeVerificacion !== null && (
                <>
                  <Button
                    size="sm"
                    className="btn AtenderSolicitud-button-rechazar"
                    onClick={() => setShow(!show)}
                  >
                    Rechazar
                  </Button>
                  {mostrarMensajeDeVerificacion.alerta === "exito" && (
                    <Button
                      size="sm"
                      className="btn AtenderSolicitud-button-aceptar"
                      onClick={onClickAceptarSolicitud}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="grow" size="sm" />
                          Enviando...
                        </>
                      ) : (
                        "Aceptar"
                      )}
                    </Button>
                  )}
                </>
              )}
            </Stack>
          </Row>
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
                {loading ? (
                  <>
                    <Spinner animation="grow" size="sm" />
                    Enviando...
                  </>
                ) : (
                  "Enviar"
                )}
              </Button>
            </Stack>
          </Row>
        </Row>
      </Modal>
    </>
  );
};

export default AtenderSolicitud;
