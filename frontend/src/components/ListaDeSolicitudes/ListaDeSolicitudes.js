import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Col,
  Container,
  Form,
  Modal,
  OverlayTrigger,
  Pagination,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import "./style.css";
import { recuperarSolicitudesDeReserva } from "../../services/Reserva.service";
import {
  ArrowClockwise,
  CardHeading,
  CheckCircleFill,
  EnvelopeExclamation,
  XSquareFill,
} from "react-bootstrap-icons";
import { AlertsContext } from "../Alert/AlertsContext";
import AtenderSolicitud from "../AtenderSolicitud/AtenderSolicitud";

const ListaDeSolicitudes = ({ titulo, tipoDeUsuario }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitud, setSolicitud] = useState({});
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [estado, setEstado] = useState("");
  const { agregarAlert } = useContext(AlertsContext);

  const reloadSolicitudes = async () => {
    await getSolicitudes();
    agregarAlert({
      icon: <CheckCircleFill />,
      severidad: "success",
      mensaje: "Actualizacion con exito",
    });
  };

  const getSolicitudes = useCallback(async () => {
    const data = await recuperarSolicitudesDeReserva(currentPage, estado);
    console.log(estado);
    console.log(data);
    setSolicitudes(data.contenido);
    setTotalPages(data.numeroPaginasTotal);
  }, [currentPage, estado]);

  useEffect(() => {
    setCurrentPage(1);
  }, [estado]);

  useEffect(() => {
    getSolicitudes();
  }, [getSolicitudes]);

  const renderPaginationItems = () => {
    const items = [];

    items.push(
      <Pagination.First
        key="first"
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        className="color-blue"
      />
    );
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="color-blue"
      />
    );

    if (currentPage > 3) {
      items.push(
        <Pagination.Ellipsis key="ellipsis-left" className="color-blue" />
      );
    }

    for (
      let i = Math.max(1, currentPage - 2);
      i <= Math.min(currentPage + 2, totalPages);
      i++
    ) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
          className="color-blue"
        >
          {i}
        </Pagination.Item>
      );
    }

    if (currentPage < totalPages - 2) {
      items.push(<Pagination.Ellipsis key="ellipsis-right" />);
    }

    items.push(
      <Pagination.Next
        key="next"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="color-blue"
      />
    );

    items.push(
      <Pagination.Last
        key="last"
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
        className="color-blue"
      />
    );

    return items;
  };

  return (
    <>
      <Container fluid>
        <Row sm className="text-white ListaDeSolicitudes-header">
          <Col
            xs="10"
            className="d-flex justify-content-start align-items-center"
          >
            <h5 style={{ fontWeight: "bold" }}>{titulo}</h5>
          </Col>
          <Col
            xs="2"
            className="justify-content-end align-items-end"
            style={{ padding: 0, display: "flex" }}
          >
            <OverlayTrigger
              overlay={<Tooltip id="hi">Actualizar lista</Tooltip>}
              placement="left"
            >
              <div
                onClick={reloadSolicitudes}
                className="ListaDeSolicitudes-header-button-cargar d-flex 
                                               justify-content-center align-items-center"
              >
                <ArrowClockwise size={24} />
              </div>
            </OverlayTrigger>
          </Col>
        </Row>
        <Row className="ListaDeSolicitudes-body justify-content-center">
          <Form>
            {["radio"].map((type) => (
              <div key={`inline-${type}`} className="mb-3">
                <strong>Estado: </strong>
                <Form.Check
                  inline
                  checked={estado === ""}
                  onClick={() => setEstado("")}
                  label="Todos"
                  name="estado"
                  type={type}
                  id={`inline-${type}-1`}
                />
                <Form.Check
                  inline
                  checked={estado === "en espera"}
                  onClick={() => setEstado("en espera")}
                  label="en espera"
                  name="estado"
                  type={type}
                  id={`inline-${type}-1`}
                />
                <Form.Check
                  inline
                  checked={estado === "canceladas"}
                  onClick={() => setEstado("canceladas")}
                  label="cancelados"
                  name="estado"
                  type={type}
                  id={`inline-${type}-1`}
                />
                <Form.Check
                  inline
                  checked={estado === "aprobadas"}
                  label="aprobadas"
                  onClick={() => setEstado("aprobadas")}
                  name="estado"
                  type={type}
                  id={`inline-${type}-2`}
                />
                <Form.Check
                  inline
                  checked={estado === "rechazadas"}
                  label="rechazadas"
                  onClick={() => setEstado("rechazadas")}
                  name="estado"
                  type={type}
                  id={`inline-${type}-3`}
                />
              </div>
            ))}
          </Form>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Ambiente</th>
                {tipoDeUsuario === "Admin" && <th>Docente</th>}
                <th>Materia</th>
                <th>Periodo</th>
                <th>Fecha de Reserva</th>
                {(estado === "" || estado === "canceladas") && (
                  <th>Fecha de Actualizacion</th>
                )}
                {estado === "en espera" && <th>Fecha de Enviada</th>}
                {(estado === "rechazadas" || estado === "aprobadas") && (
                  <th>Fecha de Atencion</th>
                )}
                <th>Estado</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((item) => (
                <tr>
                  <td>{item.ambiente_nombre}</td>
                  {tipoDeUsuario === "Admin" && <td>{item.nombreDocente}</td>}
                  <td>{item.materia}</td>
                  <td>
                    {`${item.periodo_ini_id} hasta ${item.periodo_fin_id}`}
                  </td>
                  <td>{item.fechaReserva}</td>
                  {(estado === "" || estado === "canceladas") && (
                    <td>{item.updated_at}</td>
                  )}
                  {estado === "en espera" && <td>{item.fechaEnviada}</td>}
                  {(estado === "rechazadas" || estado === "aprobadas") && (
                    <td>{item.fechaAtendida}</td>
                  )}
                  <td>{item.estado}</td>
                  <td>
                    <CardHeading
                      className="ListaDeSolicitudes-button-detalle"
                      size={30}
                      onClick={() => {
                        setSolicitud(item);
                        setShow(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination style={{ justifyContent: "center" }}>
            {renderPaginationItems()}
          </Pagination>
        </Row>
      </Container>
      <Modal
        size="xs"
        aria-labelledby="contained-modal-title-vcenter"
        show={show}
        onHide={() => setShow(false)}
        centered
      >
        <Row sm className="text-white ListaDeSolicitudes-header">
          <Col
            xs="10"
            className="d-flex justify-content-start align-items-center"
            style={{ height: "100%" }}
          >
            <h5 style={{ fontWeight: "bold" }} className="">
              Detalle de la Solicitud de Reserva
            </h5>
          </Col>
          <Col
            xs="2"
            className="d-flex justify-content-end align-items-end"
            style={{ padding: 0 }}
          >
            <div
              onClick={() => setShow(false)}
              className="ListaDeSolicitudes-header-button-close d-flex justify-content-center align-items-center"
            >
              <XSquareFill size={24} />
            </div>
          </Col>
        </Row>
        <Row className="ListaDeSolicitudes-body justify-content-center">
          <div style={{ background: "white", padding: "1rem" }}>
            <h6>Nombre del Ambiente:</h6>
            <p>{solicitud.ambiente_nombre}</p>
            {tipoDeUsuario === "Admin" && (
              <>
                <h6>Nombre del Docente: </h6>
                <p>{solicitud.nombre_docente}</p>
              </>
            )}
            <h6>Periodo: </h6>
            <p>
              {`${solicitud.periodo_ini_id} hasta ${solicitud.periodo_fin_id}`}
            </p>
            <h6>Materia: </h6>
            <p>{solicitud.materia}</p>
            <h6>Fecha Reserva:</h6>
            <p>{solicitud.fechaReserva}</p>
            {(solicitud.estado === "" || solicitud.estado === "canceladas") && (
              <>
                <h6>Fecha de Actualizacion:</h6>
                <p>{solicitud.updated_at}</p>
              </>
            )}
            {solicitud.estado === "en espera" && (
              <>
                <h6>Fecha de Enviada:</h6>
                <p>{solicitud.fechaEnviada}</p>
              </>
            )}
            {(solicitud.estado === "rechazadas" ||
              solicitud.estado === "aprobadas") && (
              <>
                <h6>Fecha Atendida:</h6>
                <p>{solicitud.fechaAtendida}</p>
              </>
            )}
            <h6>Cantidad: </h6>
            <p>{solicitud.cantidad}</p>
            <h6>Grupo: </h6>
            <p>{solicitud.grupo}</p>
            <h6>Razon: </h6>
            <p>{solicitud.razon}</p>
          </div>
        </Row>
      </Modal>
    </>
  );
};

export default ListaDeSolicitudes;
