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
  estadoinhabilitado,
  habilita,
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
  const [estado, setEstado] = useState("");
  const [showMensajeDeConfirmacion, setShowMensajeDeConfirmacion] = useState(false);
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
    } else if (event.type === "solicitud") {
      for (const solicitudId of datosEncontrados.solicitudes) {
        const data = await recuperarInformacionSolicitud(solicitudId);
        setReservas(prevReservas => [...prevReservas, data]);
        setFilteredReservas(prevReservas => [...prevReservas, data]);
        console.log(data);
      }
      console.log(filteredReservas);
      setNombre("Detalle de Solicitudes");
    }
    setShow(true);
  };

  const onSelectSlot = (slotInfo) => {
    console.log("Slot selected: ", slotInfo);
    setSelectedDate(dayjs(slotInfo.start).format("YYYY-MM-DD"));  // Set the selected date
    setIsSlotSelected(true);
    setReservas([]);  // Clear reservations when a slot is selected
    setFilteredReservas([]);
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
    formik.resetForm();
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


  const formik = useFormik({
    initialValues: {
      ambiente: { nombre: "", id: "" },
    },
    validationSchema: Yup.object({
      ambiente: Yup.object().shape({
        nombre: Yup.string()
          .required("Obligatorio")
          .matches(
            "^([a-zA-Z]+|\\d+|[a-zA-Z0-9]+)(?:\\s([a-zA-Z]+|\\d+))*$",
            "Solo letras y numeros"
          )
          .trim("No se admiten valores vacios")
          .strict(true),
      }),
    }),
    onSubmit: (values) => {
      if (ambiente.id) {
        getAmbientPorFecha(values.ambiente, selectedDate);
        console.log(values.ambiente);
        console.log(selectedDate);
      }
      setShow1(false);
    },
  });

  const buscarAmbiente = async (event) => {
    if (
      event.hasOwnProperty("target") &&
      event.target.hasOwnProperty("value")
    ) {
      const value = event.target.value;
      if (value === "") {
        setAmbientesEncontradas([]);
        setShow1(false);
      } else {
        setShow1(true);
        setSelected(null);
        let ambientesEncontradas = ambientes.filter((ambiente) =>
          ambiente.nombre.toLowerCase().includes(value.toLowerCase())
        );
        setAmbientesEncontradas(ambientesEncontradas);
      }
      formik.setFieldValue("ambiente", {
        id: "",
        nombre: value,
      });
      setAmbiente({});
    }
  };

  const setNombreDelAmbiente = (ambiente) => {
    if (ambiente !== undefined) {
      let data = {
        id: ambiente.id,
        nombre: ambiente.nombre,
      };
      formik.setFieldValue("ambiente", data);
      setShow1(false);
      setAmbiente(data);
    }
  };

  const getAmbientPorFecha = async (ambiente, fecha) => {
    const data = await modificarPerio(ambiente.id, fecha);
    const response = await getPeriodosReservados(ambiente.id, fecha);
    if (response) {
      setPeriodosReservados(response.periodosReservados);
      console.log(periodosReservados);
    }
    if (data != null) {
      setAmbiente({
        id: ambiente.id,
        nombre: ambiente.nombre,
        fecha,
        periodos: data.periodos,
      });
    }
  };

  const handlerOnClickAmbiente = ({ target }) => {
    let ambiente = ambientesEncontradas.find(
      (item) => item.nombre === target.value
    );
    setNombreDelAmbiente(ambiente);
    setSelected(target.value);
    setShow1(false);
    setAmbientesEncontradas([]);
  };

  const handleKeyUp = ({ code }) => {
    if (code === "Enter" && ambientesEncontradas.length > 0) {
      let ambiente = ambientesEncontradas[0];
      if (selected !== null) {
        ambiente = ambientesEncontradas.find(
          (item) => item.nombre === selected
        );
      } else {
        setSelected(ambiente.nombre);
      }
      setNombreDelAmbiente(ambiente);
      setAmbientesEncontradas([]);
    }
  };

  const fetchAmbientes = async () => {
    let { respuesta } = await getAmbientes();
    setAmbientes(respuesta);
  };

  const isReservado = (periodoId) => {
    return (
      periodosReservados.filter((periodoReservado) => {
        return periodoReservado.periodos.includes(periodoId);
      }).length > 0
    );
  };

  useEffect(() => {
    fetchAmbientes();
  }, []);

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



  
  return (
    <>
      <div
        style={{
          height: "505px",
          width: "1040px",
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
          onSelectSlot={onSelectSlot}
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
          <Row className="RegistrarAmbiente-body1 justify-content-center">
          {isSlotSelected ? (
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group as={Row} className="mb-3" controlId="ambiente">
                  <Form.Label column sm="2">
                    Nombre
                  </Form.Label>
                  <Col sm="10" onBlur={() => console.log("col")} id="ambientes">
                    <Dropdown
                      ref={refDropdown}
                      id="ambientes"
                      show1
                      onBlur={() => console.log("dropdown")}
                      onSelect={(e) => {
                        setSelected(e);
                        let ambiente = ambientesEncontradas.find(
                          (item) => item.nombre === e
                        );
                        setNombreDelAmbiente(ambiente);
                        setAmbientesEncontradas([]);
                      }}
                    >
                      <Dropdown.Toggle
                        ref={refDropdownToggle}
                        as={"input"}
                        id="ambientes"
                        type="text"
                        placeholder="Ingrese el nombre del ambiente"
                        onChange={buscarAmbiente}
                        onBlur={(e) => {
                          console.log("input");
                          formik.handleBlur(e);
                        }}
                        value={formik.values.ambiente.nombre}
                        onFocus={() => setShow(true)}
                        onKeyUp={(e) => handleKeyUp(e)}
                        className="form-control"
                        bsPrefix="dropdown-toggle"
                      />
                      {show && ambientesEncontradas.length > 0 && (
                        <Dropdown.Menu
                          ref={refDropdownMenu}
                          id="ambientes"
                          style={{
                            width: "100%",
                            overflowY: "auto",
                            maxHeight: "5rem",
                          }}
                          onBlur={(e) => console.log("menu")}
                        >
                          {ambientesEncontradas.map((ambiente) => (
                            <Dropdown.Item
                              eventKey={ambiente.nombre}
                              key={ambiente.nombre}
                              onClick={(e) => handlerOnClickAmbiente(e)}
                            >
                              <option>{ambiente.nombre}</option>
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      )}
                    </Dropdown>
                    <Form.Text className="text-danger">
                      {formik.touched.ambiente && formik.errors.ambiente ? (
                        <div className="text-danger">
                          {formik.errors.ambiente.nombre}
                        </div>
                      ) : formik.values.ambiente.nombre !== "" &&
                        selected === null &&
                        ambientesEncontradas.length === 0 ? (
                        "No exite el ambiente"
                      ) : formik.values.ambiente.nombre !== "" &&
                        selected === null &&
                        ambientesEncontradas.length > 0 ? (
                        "Seleccione un ambiente"
                      ) : null}
                    </Form.Text>
                  </Col>
                </Form.Group>
                <Row xs="auto" className="justify-content-md-end">
                  <Stack direction="horizontal" gap={2}>
                    <Button
                      className="btn ModificarEstadoDelAmbientePorFecha-button-consultar"
                      type="submit"
                    >
                      Consultar
                    </Button>
                  </Stack>
                </Row>
                {ambiente &&
                  Object.keys(ambiente).length > 0 &&
                  ambiente.periodos &&
                  ambiente.periodos && <h6>Periodos</h6>}
                {ambiente &&
                  Object.keys(ambiente).length > 0 &&
                  ambiente.periodos &&
                  ambiente.periodos && (
                    <Row>
                      <Col sm={4}>
                        <h6>Mañana</h6>
                        {ambiente.periodos &&
                          periodos1.map((item) => (
                            <>
                              {item.id >= 1 && item.id <= 4 && (
                                <div
                                  key={item.id}
                                  style={{
                                    border: "1px solid black",
                                    width: "100px",
                                    padding: "2px",
                                    textAlign: "center",
                                    color: `${
                                      ambiente.periodos.includes(item.id)
                                        ? "white"
                                        : "black"
                                    }`,
                                    background: `${
                                      isReservado(item.id)
                                        ? "red"
                                        : ambiente.periodos.includes(item.id)
                                        ? "gray"
                                        : "white"
                                    }`,
                                    marginBottom: "5px",
                                  }}
                                >
                                  {item.hora}
                                </div>
                              )}
                            </>
                          ))}
                      </Col>
                      <Col sm={4}>
                        <h6>Tarde</h6>
                        {ambiente.periodos &&
                          periodos1.map((item) => (
                            <>
                              {item.id >= 5 && item.id <= 8 && (
                                <div
                                  key={item.id}
                                  style={{
                                    border: "1px solid black",
                                    width: "105px",
                                    padding: "2px",
                                    textAlign: "center",
                                    color: `${
                                      ambiente.periodos.includes(item.id)
                                        ? "white"
                                        : "black"
                                    }`,
                                    background: `${
                                      isReservado(item.id)
                                        ? "red"
                                        : ambiente.periodos.includes(item.id)
                                        ? "gray"
                                        : "white"
                                    }`,
                                    marginBottom: "5px",
                                  }}
                                >
                                  {item.hora}
                                </div>
                              )}
                            </>
                          ))}
                      </Col>
                      <Col sm={4}>
                        <h6>Noche</h6>
                        {ambiente.periodos &&
                          periodos1.map((item) => (
                            <>
                              {item.id >= 9 && item.id <= 10 && (
                                <div
                                  key={item.id}
                                  style={{
                                    border: "1px solid black",
                                    width: "105px",
                                    padding: "2px",
                                    textAlign: "center",
                                    color: `${
                                      ambiente.periodos.includes(item.id)
                                        ? "white"
                                        : "black"
                                    }`,
                                    background: `${
                                      isReservado(item.id)
                                        ? "red"
                                        : ambiente.periodos.includes(item.id)
                                        ? "gray"
                                        : "white"
                                    }`,
                                    marginBottom: "5px",
                                  }}
                                >
                                  {item.hora}
                                </div>
                              )}
                            </>
                          ))}
                      </Col>
                    </Row>
                  )}
              </Form>
            ) : (
              <>
                <Form inline className="d-flex  mb-2">
                  <Form.Group controlId="searchTerm" className="mr-2 d-flex align-items-center">
                    <Form.Label className="mr-2">Buscar por Ambiente</Form.Label>
                    <Form.Control
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nombre del Ambiente"
                      style={{ width: "100%" }}
                    />
                  </Form.Group>
                </Form>
                {filteredReservas.map((reserva, index) => (
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
                ))}
                <Pagination style={{ justifyContent: "center" }}>
                  {renderPaginationItems()}
                </Pagination>
              </>
            )}
          </Row>
          
        </Modal>
      </div>
    </>
  );
  
}

export default Calendario;
