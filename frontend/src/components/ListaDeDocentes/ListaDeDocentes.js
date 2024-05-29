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
} from "react-bootstrap";
import {
  ArrowClockwise,
  CheckCircleFill,
  XSquareFill,
} from "react-bootstrap-icons";
import { AlertsContext } from "../Alert/AlertsContext";
import { getDocentes } from "../../services/Docente.service";
import "./style.css";  // Asegúrate de importar tu archivo de estilos

const ListaDeSolicitudes = ({ titulo, tipoDeUsuario }) => {
  const [docentes, setDocentes] = useState([]);
  const { agregarAlert } = useContext(AlertsContext);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState(null);

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

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDocente(null);
  };

  return (
    <Container fluid>
      <Row>
        <Col sm="3"></Col>
        <Col>
          <Row sm className="text-white ListaDeSolicitudes-header">
            <Col
              xs="10"
              className="d-flex justify-content-start align-items-center"
            >
              <h3 style={{ fontWeight: "bold" }}>{titulo}</h3>
            </Col>
            <Col
              xs="2"
              className="d-flex justify-content-end align-items-end"
              style={{ padding: 0 }}
            >
              <div
                onClick={reloadSolicitudes}
                className="RegistrarAmbiente-header-button-close d-flex 
                                           justify-content-center align-items-center"
              >
                <ArrowClockwise size={24} />
              </div>
            </Col>
          </Row>
          <Row className="ListaDeSolicitudes-body justify-content-center">
            <div className="table-container">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Nombre del Docente</th>
                    <th style={{ width: "350px" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {docentes.map((docente, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{docente.nombre}</td>
                        <td>
                          <Button
                            onClick={() => toggleExpand(index)}
                            className="btn RegistrarAmbiente-button-register"
                            aria-controls={`expandable-row-${index}`}
                            aria-expanded={expandedIndex === index}
                          >
                            {expandedIndex === index ? "Ocultar" : "Ver"} Materias y Grupos
                          </Button>
                          {tipoDeUsuario === "Admin" && (
                            <Button
                              variant="info"
                              className="btn RegistrarAmbiente-button-cancel"
                              style={{ marginLeft: "5px" }}
                              onClick={() => handleNotificar(docente)}
                            >
                              Notificar
                            </Button>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">
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
        </Col>
      </Row>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
      >
        <Row sm className="text-white RegistrarAmbiente-header">
          <Col
            xs="10"
            className="d-flex justify-content-start align-items-center"
            style={{ height: "100%" }}
          >
            <h4 style={{ fontWeight: "bold" }} className="">
              Notificar a {selectedDocente?.nombre}
            </h4>
          </Col>
          <Col
            xs="2"
            className="d-flex justify-content-end align-items-end"
            style={{ padding: 0 }}
          >
            <div
              onClick={handleCloseModal}
              className="RegistrarAmbiente-header-button-close d-flex justify-content-center align-items-center"
            >
              <XSquareFill size={24} />
            </div>
          </Col>
        </Row>
        <Row className="RegistrarAmbiente-body justify-content-center">
          <Form>
            <Form.Group controlId="formNotificacion">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
            <div className="d-flex justify-content-center mt-3">
              <Button
                className="btn RegistrarAmbiente-button-register"
                onClick={handleCloseModal}
              >
                Aceptar
              </Button>
              <div style={{ width: "10px" }}></div> {/* Espacio entre botones */}
              <Button
                className="btn RegistrarAmbiente-button-cancel"
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
