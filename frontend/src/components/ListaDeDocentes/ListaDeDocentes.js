import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Table,
  Button,
  Collapse,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import {
  ArrowClockwise,
  CheckCircleFill,
  XSquareFill,
} from "react-bootstrap-icons";
import { AlertsContext } from "../Alert/AlertsContext";
import { getDocentes } from "../../services/Docente.service";
import {
  enviarNotificacionIndividual,
  enviarNotificacionGeneral,
} from "../../services/Notification.service";
import "./style.css"; // Asegúrate de importar tu archivo de estilos

const ListaDeSolicitudes = ({ tipoDeUsuario }) => {
  const [docentes, setDocentes] = useState([]);
  const { agregarAlert } = useContext(AlertsContext);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const reloadSolicitudes = async () => {
    await getDocentesData();
    agregarAlert({
      icon: <CheckCircleFill />,
      severidad: "success",
      mensaje: "Actualización exitosa",
    });
  };

  const getDocentesData = useCallback(async () => {
    try {
      const data = await getDocentes();
      setDocentes(data);
    } catch (error) {
      console.error("Error al obtener la lista de docentes:", error);
    }
  }, []);

  useEffect(() => {
    getDocentesData();
  }, [getDocentesData]);

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? -1 : index);
  };

  const handleNotificar = (docente) => {
    setSelectedDocente(docente);
    setShowModal(true);
  };

  const handleNotificacionGeneral = async () => {
    if (mensaje.trim()) {
      setLoading(true);
      const response = await enviarNotificacionGeneral(mensaje);
      if (response) {
        setLoading(false);
        agregarAlert({
          icon: <CheckCircleFill />,
          severidad: "success",
          mensaje: "Notificación general enviada exitosamente",
        });
        setShowModal(false);
        setMensaje("");
      } else {
        setLoading(false);
        agregarAlert({
          icon: <XSquareFill />,
          severidad: "error",
          mensaje: "Error al enviar la notificación general",
        });
      }
    } else {
      agregarAlert({
        icon: <XSquareFill />,
        severidad: "error",
        mensaje: "Por favor, ingresa un mensaje válido",
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDocente(null);
    setMensaje("");
  };

  const handleEnviarNotificacion = async () => {
    if (selectedDocente && mensaje.trim()) {
      setLoading(true);
      const response = await enviarNotificacionIndividual(
        selectedDocente.id,
        mensaje
      );
      if (response) {
        setLoading(false);
        agregarAlert({
          icon: <CheckCircleFill />,
          severidad: "success",
          mensaje: "Notificación enviada exitosamente",
        });
        setShowModal(false);
        setMensaje("");
      } else {
        setLoading(false);
        agregarAlert({
          icon: <XSquareFill />,
          severidad: "error",
          mensaje: "Error al enviar la notificación",
        });
      }
    } else {
      agregarAlert({
        icon: <XSquareFill />,
        severidad: "error",
        mensaje: "Por favor, ingresa un mensaje válido",
      });
    }
  };

  return (
    <Container fluid style={{ marginBottom: "1rem" }}>
      <Row sm className="text-white ListaDeDocentes-header">
        <Col
          xs="10"
          className="d-flex justify-content-start align-items-center"
        >
          <h5 style={{ fontWeight: "bold" }}>Lista de Docentes</h5>
        </Col>
        <Col
          xs="2"
          className="d-flex justify-content-end align-items-end"
          style={{ padding: 0 }}
        >
          <div
            onClick={reloadSolicitudes}
            className="ListaDeDocentes-header-button-cargar d-flex justify-content-center align-items-center"
          >
            <ArrowClockwise size={24} />
          </div>
        </Col>
      </Row>
      {tipoDeUsuario === "Admin" && (
        <Row className="ListaDeDocentes-body1 justify-content-end">
          <Col className="d-flex justify-content-end">
            <Button
              style={{ width: "300px" }}
              className="btn ListaDeDocentes-register"
              onClick={() => setShowModal(true)}
            >
              Notificación general
            </Button>
          </Col>
        </Row>
      )}
      <Row className="ListaDeDocentes-body">
        <div className="table-container">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nombre del Docente</th>
                <th>Correo Electrónico</th>
                <th style={{ width: "350px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {docentes.map((docente, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>{docente.nombre}</td>
                    <td>{docente.email}</td>
                    <td>
                      <Button
                        onClick={() => toggleExpand(index)}
                        className="btn ListaDeDocentes-register"
                        aria-controls={`expandable-row-${index}`}
                        aria-expanded={expandedIndex === index}
                      >
                        {expandedIndex === index ? "Ocultar" : "Ver"} Materias y Grupos
                      </Button>
                      {tipoDeUsuario === "Admin" && (
                        <Button
                          variant="info"
                          className="btn ListaDeDocentes-button-cancel"
                          style={{ marginLeft: "5px" }}
                          onClick={() => handleNotificar(docente)}
                        >
                          Notificar
                        </Button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <Collapse in={expandedIndex === index}>
                        <div id={`expandable-row-${index}`}>
                          <Table bordered>
                            <thead>
                              <tr>
                                <th>Materia</th>
                                <th>Grupos</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.keys(docente.materias).map((materia, idx) => (
                                <tr key={idx}>
                                  <td>{materia}</td>
                                  <td>{docente.materias[materia].grupos.join(", ")}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </Collapse>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </div>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Row sm className="text-white ListaDeDocentes-header">
          <Col
            xs="10"
            className="d-flex justify-content-start align-items-center"
            style={{ height: "100%" }}
          >
            <h4 style={{ fontWeight: "bold" }}>
              {selectedDocente ? `Notificar a ${selectedDocente.nombre}` : "Notificación general"}
            </h4>
          </Col>
          <Col
            xs="2"
            className="d-flex justify-content-end align-items-end"
            style={{ padding: 0 }}
          >
            <div
              onClick={handleCloseModal}
              className="ListaDeDocentes-header-button-close d-flex justify-content-center align-items-center"
            >
              <XSquareFill size={24} />
            </div>
          </Col>
        </Row>
        <Row className="ListaDeDocentes-body-Modal">
          <Form>
            <Form.Group controlId="formNotificacion">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Ingrese el mensaje a notificar"
                rows={3}
                value={mensaje}
                style={{ height: "5rem" }}
                onChange={(e) => setMensaje(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex justify-content-center mt-3">
              <Button
                className="btn ListaDeDocentes-register"
                onClick={selectedDocente ? handleEnviarNotificacion : handleNotificacionGeneral}
                disabled={loading}
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
              <div style={{ width: "10px" }}></div>{" "}
              <Button
                className="btn ListaDeDocentes-button-cancel"
                onClick={handleCloseModal}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Row>
      </Modal>
    </Container>
  );
};

export default ListaDeSolicitudes;
