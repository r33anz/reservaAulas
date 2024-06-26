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
  const [loadingRechazo, setLoadingRechazo] = useState(false);
  const [loadingAceptar, setLoadingAceptar] = useState(false);

  const loadSolicitudPorId = async (solicitudId) => {
    const response = await getSolicitudPorId(solicitudId);
    if (response) {
      setSolicitud(response);
    }
  };

  const onClickParaVerificarDisponibilidad = async () => {
    if (Object.getOwnPropertyNames(solicitud).length > 0) {
      const response = await vertificarDisponibilidad(
        solicitudId,
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
    setLoadingRechazo(true);
    let response = await rechazarSolicitud(solicitudId, razonRechazo);
    setLoadingRechazo(false);
    if (response !== null) {
      agregarAlert({
        icon: <CheckCircleFill />,
        severidad: "success",
        mensaje: "Solicitud rechazada enviada.",
      });
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
    setLoadingAceptar(true);
    let response = await aceptarSolicitud(solicitudId);
    setLoadingAceptar(false);
    if (response !== null) {
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
                  {`${solicitud.periodo_ini_id} hasta ${solicitud.periodo_fin_id}`}
                </div>
              </Row>
            </Row>
          </Stack>
          <Row xs="auto" sm="auto" style={{ padding: 0, paddingTop: "0.5rem" }}>
            <div className="justify-content-start text-left">
              {Object.getOwnPropertyNames(solicitud).length > 0 &&
              mostrarMensajeDeVerificacion !== null
                ? mostrarMensajeDeVerificacion.alerta === "exito"
                  ? mostrarMensajeDeVerificacion.mensaje
                  : mostrarMensajeDeVerificacion.mensaje
                : ""}
            </div>
          </Row>
          <Row xs="auto" sm="auto" style={{ padding: 0, paddingTop: "0.5rem" }}>
            <Stack direction="horizontal" gap={2}>
              <Button
                size="sm"
                className="btn AtenderSolicitud-button-disponibilidad"
                onClick={onClickParaVerificarDisponibilidad}
              >
                Verificar Disponibilidad
              </Button>
              {mostrarMensajeDeVerificacion !== null && (
                <>
                  <Button
                    size="sm"
                    className="btn AtenderSolicitud-button-rechazar"
                    onClick={() => setShow(!show)}
                    disabled={loadingAceptar}
                  >
                    Rechazar
                  </Button>
                  {mostrarMensajeDeVerificacion.alerta === "exito" && (
                    <Button
                      size="sm"
                      className="btn AtenderSolicitud-button-aceptar"
                      onClick={onClickAceptarSolicitud}
                      disabled={loadingAceptar}
                    >
                      {loadingAceptar ? (
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
                disabled={loadingRechazo}
              >
                Cancelar
              </Button>
              <Button
                className="btn AtenderSolicitud-button-enviar"
                onClick={onClickRechazarSolicitud}
                disabled={loadingRechazo}
              >
                {loadingRechazo ? (
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
