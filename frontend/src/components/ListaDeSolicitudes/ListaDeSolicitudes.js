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
import {
  recuperarSolicitudesDeReserva,
  recuperarSolicitudesDeReservaAceptadas,
} from "../../services/Reserva.service";
import {
  ArrowClockwise,
  CardHeading,
  CheckCircleFill,
  XSquareFill,
} from "react-bootstrap-icons";
import { AlertsContext } from "../Alert/AlertsContext";

const ListaDeSolicitudes = ({ titulo, tipoDeUsuario }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitud, setSolicitud] = useState({});
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [estado, setEstado] = useState("");
  const { agregarAlert } = useContext(AlertsContext);
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

  const getPeriodo = (periodoInicioId, periodoFinId) => {
    const periodoReserva = periodos
      .filter((periodo) => {
        return periodo.id === periodoInicioId || periodo.id === periodoFinId;
      })
      .map((periodo) => periodo.hora);
    return (
      <>
        {periodoReserva[0]} <br /> {periodoReserva[1]}
      </>
    );
  };

  const reloadSolicitudes = async () => {
    await getSolicitudes();
    agregarAlert({
      icon: <CheckCircleFill />,
      severidad: "success",
      mensaje: "Actualizacion con exito",
    });
  };

  const getSolicitudes = useCallback(async () => {
      // const id = window.sessionStorage.getItem("admin_id");
      const data = await recuperarSolicitudesDeReserva(currentPage, estado);
      console.log(estado);
      console.log(data);
      setSolicitudes(data.contenido);
      setTotalPages(data.numeroPaginasTotal);
  }, [currentPage, estado]);

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
        <Row>
          <Col sm="3"></Col>
          <Col>
            <Row sm className="text-white ListaDeSolicitudes-header">
              <Col
                xs="10"
                className="d-flex justify-content-start align-items-center"
              >
                <h3 style={{ fontWeight: "bold" }} className="">
                  {titulo}
                </h3>
              </Col>
              <Col
                xs="2"
                className="d-flex justify-content-end align-items-end"
                style={{ padding: 0 }}
              >
                <OverlayTrigger
                  overlay={<Tooltip id="hi">Actualizar lista</Tooltip>}
                  placement="left"
                >
                  <div
                    onClick={reloadSolicitudes}
                    className="RegistrarAmbiente-header-button-close d-flex 
                                               justify-content-center align-items-center"
                  >
                    <ArrowClockwise size={24} />
                  </div>
                </OverlayTrigger>
              </Col>
            </Row>
            <Row className="ListaDeSolicitudes-body justify-content-center">
              <Form >
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
                    <th>Fecha Creada</th>
                    <th>Estado</th>
                    <th>Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map((item) => (
                    <tr>
                      <td>{item.ambiente_nombre}</td>
                      {tipoDeUsuario === "Admin" && (
                        <td>{item.nombreDocente}</td>
                      )}
                      <td>{item.materia}</td>
                      <td>
                        {getPeriodo(item.periodo_ini_id, item.periodo_fin_id)}
                      </td>
                      <td>{item.fechaReserva}</td>
                      <td>{item.fechaEnviada}</td>
                      <td>{item.estado}</td>
                      <td>
                        <CardHeading
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
        <Row sm className="text-white RegistrarAmbiente-header">
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
              className="RegistrarAmbiente-header-button-close d-flex justify-content-center align-items-center"
            >
              <XSquareFill size={24} />
            </div>
          </Col>
        </Row>
        <Row className="RegistrarAmbiente-body justify-content-center">
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
            {getPeriodo(solicitud.periodo_ini_id, solicitud.periodo_fin_id)}
          </p>
          <h6>Materia: </h6>
          <p>{solicitud.materia}</p>
          <h6>Fecha Reserva:</h6>
          <p>{solicitud.fechaReserva}</p>
          <h6>Cantidad: </h6>
          <p>{solicitud.cantidad}</p>
          <h6>Grupo: </h6>
          <p>{solicitud.grupo}</p>
          <h6>Razon: </h6>
          <p>{solicitud.razon}</p>
        </Row>
      </Modal>
    </>
  );
};

export default ListaDeSolicitudes;
