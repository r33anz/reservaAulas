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

const ListaDeAtencionDeSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitud, setSolicitud] = useState({});
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
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
    const data = await recuperarSolicitudesDeReserva(currentPage, "en espera");
    console.log(data);
    setSolicitudes(data.contenido);
    setTotalPages(data.numeroPaginasTotal);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

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
            <h5 style={{ fontWeight: "bold" }}>Atencion de Solicitudes</h5>
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
                className="AtenderSolicitud-header-button-close d-flex 
                                               justify-content-center align-items-center"
              >
                <ArrowClockwise size={24} />
              </div>
            </OverlayTrigger>
          </Col>
        </Row>
        <Row className="ListaDeSolicitudes-body justify-content-center">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Ambiente</th>
                <th>Docente</th>
                <th>Materia</th>
                <th>Periodo</th>
                <th>Fecha de Reserva</th>
                <th>Estado</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((item) => (
                <tr>
                  <td>{item.ambiente_nombre}</td>
                  <td>{item.nombreDocente}</td>
                  <td>{item.materia}</td>
                  <td>
                    {`${item.periodo_ini_id} hasta ${item.periodo_fin_id}`}
                  </td>
                  <td>{item.fechaReserva}</td>
                  <td>{item.estado}</td>
                  <td>
                    <EnvelopeExclamation
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
        <AtenderSolicitud
          solicitudId={solicitud.id}
          onClose={() => {
            setShow(false);
            getSolicitudes();
          }}
        />
      </Modal>
    </>
  );
};

export default ListaDeAtencionDeSolicitudes;
