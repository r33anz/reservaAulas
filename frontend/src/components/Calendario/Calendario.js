import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "./style.css";
import { recuperarFechasSolicitud, recuperarInformacionSolicitud } from "../../services/Fechas.service";
import { useState, useEffect, useRef } from "react";
import { Col, Modal, Row, Form, Pagination, Dropdown, Stack, Button } from "react-bootstrap";
import { XSquareFill } from "react-bootstrap-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  
  modificarPerio,
} from "../../../src/services/ModificarPeriodo.service";
import {
  getAmbientes,
  getPeriodosReservados,
} from "../../../src/services/Ambiente.service";
dayjs.locale("es");

function Calendario() {
  const localizer = dayjsLocalizer(dayjs);
  const [event, setEvent] = useState([]);
  const [datos, setDatos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [show, setShow] = useState(false);
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReservas, setFilteredReservas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
const reservasPerPage = 4; // Número de reservas por página
const indexOfLastReserva = currentPage * reservasPerPage;
const indexOfFirstReserva = indexOfLastReserva - reservasPerPage;
const currentReservas = filteredReservas.slice(indexOfFirstReserva, indexOfLastReserva);
const paginate = (pageNumber) => setCurrentPage(pageNumber);
const totalPages = Math.ceil(filteredReservas.length / reservasPerPage);


  const periodos = [
    { id: 1, hora: "6:45" },
    { id: 2, hora: "8:15" },
    { id: 3, hora: "9:45" },
    { id: 4, hora: "11:15" },
    { id: 5, hora: "12:45" },
    { id: 6, hora: "14:15" },
    { id: 7, hora: "15:45" },
    { id: 8, hora: "17:15" },
    { id: 9, hora: "18:45" },
    { id: 10, hora: "20:15" },
  ];
  
  const periodosF = [
    { id: 1, hora: "8:15" },
    { id: 2, hora: "9:45" },
    { id: 3, hora: "11:15" },
    { id: 4, hora: "12:45" },
    { id: 5, hora: "14:15" },
    { id: 6, hora: "15:45" },
    { id: 7, hora: "17:15" },
    { id: 8, hora: "18:45" },
    { id: 9, hora: "20:15" },
    { id: 10, hora: "21:45" },
  ];

  const [selectedDate, setSelectedDate] = useState(null);
  const [isSlotSelected, setIsSlotSelected] = useState(false);
  const [ambientes, setAmbientes] = useState([]);
  const [ambientesEncontradas, setAmbientesEncontradas] = useState([]);
  const [ambiente, setAmbiente] = useState({});
  const [show1, setShow1] = useState(false);
  const [selected, setSelected] = useState(null);
  const [periodosReservados, setPeriodosReservados] = useState([]);
  const refDropdownMenu = useRef(null);
  const refDropdownToggle = useRef(null);
  const refDropdown = useRef(null);
  const periodos1 = [
    { id: 1, hora: "6:45 - 8:15" },
    { id: 2, hora: "8:15 - 9:45" },
    { id: 3, hora: "9:45 - 11:15" },
    { id: 4, hora: "11:15 - 12:45" },
    { id: 5, hora: "12:45 - 14:15" },
    { id: 6, hora: "14:15 - 15:45" },
    { id: 7, hora: "15:45 - 17:15" },
    { id: 8, hora: "17:15 - 18:45" },
    { id: 9, hora: "18:45 - 20:15" },
    { id: 10, hora: "20:15 - 21:45" },
  ];




  const getPeriodo = (periodoInicioId, periodoFinId) => {
    const periodoInicio = periodos.find((periodo) => periodo.id === periodoInicioId);
    const periodoFin = periodosF.find((periodo) => periodo.id === periodoFinId);
    return (
      <>
        {periodoInicio ? periodoInicio.hora : "N/A"}-{periodoFin ? periodoFin.hora : "N/A"}
      </>
    );
  };

  const getFechas = async () => {
    const data = await recuperarFechasSolicitud();
    const fechas = data.listaFechas;
    setDatos(fechas);
    const events2 = [];

    fechas.forEach(fecha => {
      if (fecha.reservas.length > 0) {
        const eventoReserva = {
          start: dayjs(fecha.fecha).toDate(),
          end: dayjs(fecha.fecha).toDate(),
          title: `${fecha.reservas.length} ${fecha.reservas.length > 1 ? "reservas" : "reserva"}`,
          type: "reserva",
        };
        events2.push(eventoReserva);
      }

      if (fecha.solicitudes.length > 0) {
        const eventoSolicitud = {
          start: dayjs(fecha.fecha).toDate(),
          end: dayjs(fecha.fecha).toDate(),
          title: `${fecha.solicitudes.length} ${fecha.solicitudes.length > 1 ? "solicitudes" : "solicitud"}`,
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
  }, [searchTerm]);

  const filtrarReservas = () => {
    let filtered = reservas;
    if (searchTerm) {
      filtered = filtered.filter(reserva =>
        reserva.ambiente_nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredReservas(filtered);
  };

  const onSelectEvent = async (event) => {
    setFilteredReservas([]);
    const formattedDate = dayjs(event.start).format("YYYY-MM-DD");

    const datosEncontrados = datos.find(fechaObj => fechaObj.fecha === formattedDate);
    
    if (event.type === "reserva") {
      for (const reservaId of datosEncontrados.reservas) {
        const data = await recuperarInformacionSolicitud(reservaId);
        setReservas(prevReservas => [...prevReservas, data]);
        setFilteredReservas(prevReservas => [...prevReservas, data]);
      }
      setNombre("Detalle de Reservas");
      setMensaje("No hay reservas");
    } else if (event.type === "solicitud") {
      for (const solicitudId of datosEncontrados.solicitudes) {
        const data = await recuperarInformacionSolicitud(solicitudId);
        setReservas(prevReservas => [...prevReservas, data]);
        setFilteredReservas(prevReservas => [...prevReservas, data]);
        console.log(data);
      }
      console.log(filteredReservas);
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
    setSelectedDate(null);
    setIsSlotSelected(false);
    setAmbiente({});
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


  

  

  

  

  

  

  const fetchAmbientes = async () => {
    let { respuesta } = await getAmbientes();
    setAmbientes(respuesta);
  };

  
  useEffect(() => {
    fetchAmbientes();
  }, []);
  const handleInputChange = (e) => {
    const originalValue = e.target.value;
    const trimmedValue = originalValue.trim(); // Eliminar espacios al inicio y al final
  
    if (trimmedValue === "") {
      setSearchTerm("");
    } else if (!trimmedValue.startsWith(" ")) {
      const value = originalValue.toUpperCase(); // Convertir a mayúsculas si pasa la validación del espacio inicial
  
      if (/^[a-zA-Z0-9\s]*$/.test(value)) {
        // Si pasa la validación de caracteres especiales, establecer el valor en searchTerm
        setSearchTerm(value);
      }
    }
  };
  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (
        !refDropdownMenu.current?.contains(event.target) &&
        !refDropdown.current?.contains(event.target) &&
        !refDropdownToggle.current?.contains(event.target)
      ) {
        setShow1(false);
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [refDropdownMenu, refDropdown, refDropdownToggle]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Aquí va tu lógica para manejar la búsqueda
    }
  };

  
  return (
    <>
      <div
        style={{
          height: "505px",
          width: "1040px",
          backgroundColor:"white",
        }}
      >
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
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          show={show}
          onHide={handleClose}
          centered
        >
          <Row sm className="text-white RegistrarAmbiente-header">
            <Col
              xs="10"
              className="d-flex justify-content-start align-items-center"
              style={{ height: "100%" }}
            >
              <h4 style={{ fontWeight: "bold" }} className="">
                {isSlotSelected ? "Detalle ambiente" : nombre}
              </h4>
            </Col>
            <Col
              xs="2"
              className="d-flex justify-content-end align-items-end"
              style={{ padding: 0 }}
            >
              <div
                onClick={handleClose}
                className="RegistrarAmbiente-header-button-close d-flex justify-content-center align-items-center"
              >
                <XSquareFill size={24} />
              </div>
            </Col>
          </Row>
          <Row className="RegistrarAmbiente-body1 justify-content-center" style={{backgroundColor:"#D9D9D9"}}>
          
              <>
  <Form inline className="d-flex  mb-2">
    <Form.Group controlId="searchTerm" className="mr-2 d-flex align-items-center">
      <Form.Label className="mr-2">Buscar por Ambiente</Form.Label>
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

  {filteredReservas.length === 0 ? (
    <p>{mensaje}</p>
  ) : (
    filteredReservas.map((reserva, index) => (
      <div key={index} className="reserva">
        <div className="reserva-row">
          <h6>Docente:</h6>
          <p>{reserva.nombreDocente}</p>
        </div>
        <div className="reserva-row">
          <h6>Nombre del Ambiente:</h6>
          <p>{reserva.ambiente_nombre}</p>
        </div>
        <div className="reserva-row">
          <h6>Periodo:</h6>
          <p>{getPeriodo(reserva.periodo_ini_id, reserva.periodo_fin_id)}</p>
        </div>
        {index < filteredReservas.length - 1 && <hr />}
      </div>
    ))
  )}

  {filteredReservas.length > 0 && (
    <Pagination style={{ justifyContent: "center" }}>
      {renderPaginationItems()}
    </Pagination>
  )}
</>
           
          </Row>
          
        </Modal>
      </div>
    </>
  );
  
}

export default Calendario;
