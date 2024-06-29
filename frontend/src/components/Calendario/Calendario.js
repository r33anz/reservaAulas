import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "./style.css";
import {
  recuperarFechasSolicitud,
  recuperarReserva,
  recuperarSolicitud,
} from "../../services/Fechas.service";
import { useState, useEffect, useRef } from "react";
import { Col, Modal, Row, Form, Pagination } from "react-bootstrap";
import { XSquareFill, ArrowClockwise } from "react-bootstrap-icons";

dayjs.locale("es");

function Calendario({ showSidebar }) {
  const localizer = dayjsLocalizer(dayjs);
  const [event, setEvent] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [filteredReservas, setFilteredReservas] = useState([]);
  const [show, setShow] = useState(false);
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reservasPerPage = 4; // Número de reservas por página

  const [isSlotSelected, setIsSlotSelected] = useState(false);
  const refDropdownMenu = useRef(null);
  const refDropdownToggle = useRef(null);
  const refDropdown = useRef(null);


  const getFechas = async () => {
    const data = await recuperarFechasSolicitud();
    const fechas = data.listaFechas;
    const events2 = [];

    fechas.forEach((fecha) => {
      if (fecha.reservas.length > 0) {
        const eventoReserva = {
          start: dayjs(fecha.fecha).toDate(),
          end: dayjs(fecha.fecha).toDate(),
          title: `${fecha.reservas.length} ${
            fecha.reservas.length > 1 ? "reservas" : "reserva"
          }`,
          type: "reserva",
        };
        events2.push(eventoReserva);
      }

      if (fecha.solicitudes.length > 0) {
        const eventoSolicitud = {
          start: dayjs(fecha.fecha).toDate(),
          end: dayjs(fecha.fecha).toDate(),
          title: `${fecha.solicitudes.length} ${
            fecha.solicitudes.length > 1 ? "solicitudes" : "solicitud"
          }`,
          type: "solicitud",
        };
        events2.push(eventoSolicitud);
      }
    });

    setEvent(events2);
  };

  const eventPropGetter = (event) => {
    let backgroundColor = event.type === "reserva" ? "#d81a0b" : "#0b3f6f";
    return { style: { backgroundColor } };
  };

  useEffect(() => {
    getFechas();
  }, []);

  useEffect(() => {
    filtrarReservas();
  }, [searchTerm, reservas]);

  const filtrarReservas = () => {
    let filtered = reservas;
    if (searchTerm) {
      filtered = filtered.filter((reserva) =>
        reserva.ambiente_nombres.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredReservas(filtered);
  };

  const onSelectEvent = async (event) => {
    setFilteredReservas([]);
    const formattedDate = dayjs(event.start).format("YYYY-MM-DD");

    if (event.type === "reserva") {
      const data = await recuperarReserva(formattedDate);
      setReservas(data);
      setFilteredReservas(data);
      setNombre("Detalle de Reservas");
      setMensaje("No hay reservas");
    } else if (event.type === "solicitud") {
      const data = await recuperarSolicitud(formattedDate);
      setReservas(data);
      setFilteredReservas(data);
      setNombre("Detalle de Solicitudes");
      setMensaje("No hay solicitudes");
    }
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSearchTerm("");
    setReservas([]);
    setFilteredReservas([]);
    setIsSlotSelected(false);

  };

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
      items.push(<Pagination.Ellipsis key="ellipsis-left" className="color-blue" />);
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





  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchTerm(value);
    setCurrentPage(1); // Ajusta la página actual a 1 cada vez que se cambia el término de búsqueda
  };
  

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (
        !refDropdownMenu.current?.contains(event.target) &&
        !refDropdown.current?.contains(event.target) &&
        !refDropdownToggle.current?.contains(event.target)
      ) {

      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [refDropdownMenu, refDropdown, refDropdownToggle]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handleReload = () => {
    getFechas(); // Llamar a la función de recarga
  };

  const indexOfLastReserva = currentPage * reservasPerPage;
  const indexOfFirstReserva = indexOfLastReserva - reservasPerPage;
  const currentReservas = filteredReservas.slice(indexOfFirstReserva, indexOfLastReserva);
  const totalPages = Math.ceil(filteredReservas.length / reservasPerPage);

  return (
    <>
      <div className={`${showSidebar ? "Calendario-sidebar-header-container" : "Calendario-header-container"}`}>
        <h5 style={{ marginBottom: "0", marginLeft: "10px", alignContent: "center", fontWeight: "bold" }}>
          Calendario{" "}
        </h5>
        <div className="Calendario-header-button-close align-items-center justify-content-center d-flex">
          <ArrowClockwise size={24} onClick={handleReload} style={{ cursor: "pointer", fontWeight: "bold" }} />
        </div>
      </div>
      <div className={`${showSidebar ? "Calendario-sidebar-body" : "Calendario-body"}`}>
        <Calendar
          localizer={localizer}
          events={event}
          views={["month"]}
          defaultView="month"
          culture="es"
          selectable={true}
          onSelectEvent={onSelectEvent}
          eventPropGetter={eventPropGetter}
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            more: "más",
          }}
        />
        <Modal aria-labelledby="contained-modal-title-vcenter" show={show} onHide={handleClose} centered>
          <Row sm className="text-white Calendario-header">
            <Col xs="10" className="d-flex justify-content-start align-items-center">
              <h4 style={{ fontWeight: "bold" }} className="">
                {isSlotSelected ? "Detalle ambiente" : nombre}
              </h4>
            </Col>
            <Col xs="2" className="d-flex justify-content-end align-items-end" style={{ padding: 0 }}>
              <div
                onClick={handleClose}
                className="Calendario-header-button-close d-flex justify-content-center align-items-center"
              >
                <XSquareFill size={24} />
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center" style={{ backgroundColor: "#D9D9D9" }}>
            <Form inline className="d-flex  mb-2">
              <Form.Group controlId="searchTerm" className="mr-2 d-flex align-items-center" style={{ paddingTop: "0.5rem" }}>
                <Form.Label style={{ width: "100%" }}>Buscar por Ambiente</Form.Label>
                <Form.Control
                  type="text"
                  value={searchTerm}
                  onKeyDown={handleKeyDown}
                  onChange={handleInputChange}
                  placeholder="Nombre del Ambiente"
                  style={{ width: "100%" }}
                />
              </Form.Group>
            </Form>

            {currentReservas.length === 0 ? (
              <p>{mensaje}</p>
            ) : (
              currentReservas.map((reserva, index) => (
                <div key={index} className="reserva">
                  <div className="reserva-row">
                    <h6>Docente:</h6>
                    <p>{reserva.nombreDocente}</p>
                  </div>
                  <div className="reserva-row">
                    <h6>Nombre del Ambiente:</h6>
                    <p>{reserva.ambiente_nombres}</p>
                  </div>
                  <div className="reserva-row">
                    <h6>Periodo:</h6>
                    <p>
                      {reserva.periodo_ini}-{reserva.periodo_fin}
                    </p>
                  </div>
                  {index < currentReservas.length - 1 && <hr />}
                </div>
              ))
            )}
            {filteredReservas.length > 0 && (
              <Pagination style={{ justifyContent: "center" }}>{renderPaginationItems()}</Pagination>
            )}
          </Row>
        </Modal>
      </div>
    </>
  );
}

export default Calendario;
