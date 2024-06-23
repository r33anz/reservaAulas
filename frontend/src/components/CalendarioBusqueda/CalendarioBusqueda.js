import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "./style.css";
import {
  recuperarFechasSolicitud,
  recuperarInformacionSolicitud,
} from "../../services/Fechas.service";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Col,
  Modal,
  Row,
  Form,
  Pagination,
  Dropdown,
  Stack,
  Button,
} from "react-bootstrap";
import { ArrowClockwise, XSquareFill } from "react-bootstrap-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  estadoinhabilitado,
  habilita,
  modificarPerio,
  getPeriodosReservados,
  getPeriodosSolicitados,
} from "../../services/ModificarPeriodo.service";
import { getAmbientes } from "../../services/Ambiente.service";
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
  const currentReservas = filteredReservas.slice(
    indexOfFirstReserva,
    indexOfLastReserva
  );
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
  const [showMensajeDeConfirmacion, setShowMensajeDeConfirmacion] =
    useState(false);
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
    const periodoInicio = periodos.find(
      (periodo) => periodo.id === periodoInicioId
    );
    const periodoFin = periodosF.find((periodo) => periodo.id === periodoFinId);
    return (
      <>
        {periodoInicio ? periodoInicio.hora : "N/A"}-
        {periodoFin ? periodoFin.hora : "N/A"}
      </>
    );
  };

  useEffect(() => {
    filtrarReservas();
  }, [searchTerm]);

  const filtrarReservas = () => {
    let filtered = reservas;
    if (searchTerm) {
      filtered = filtered.filter((reserva) =>
        reserva.ambiente_nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredReservas(filtered);
  };

  const onSelectSlot = (slotInfo) => {
    console.log("Slot selected: ", slotInfo);
    setSelectedDate(dayjs(slotInfo.start).format("YYYY-MM-DD")); // Set the selected date
    setIsSlotSelected(true);
    setReservas([]); // Clear reservations when a slot is selected
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

  const [periodosSolicitados, setPeriodosSolicitados] = useState([]);
  const [periodosModificados, setPeriodosModificados] = useState([]);

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
    const response2 = await getPeriodosSolicitados(ambiente.id, fecha);

    if (response) {
      setPeriodosReservados(response.periodosReservados);
      console.log(response);
    }
    if (response2) {
      setPeriodosSolicitados(response2.periodosReservados);
      console.log(response2);
    }

    if (data != null) {
      setAmbiente({
        id: ambiente.id,
        nombre: ambiente.nombre,
        fecha,
        periodos: data.periodos,
      });
      setPeriodosModificados(data.periodos);
      cambiarColorLabels();
      //setConsultarPresionado(true);
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
    let response = await getAmbientes();
    if (response !== null) {
      setAmbientes(response.respuesta);
    }
  };

  const cambiarColorLabels = useCallback(
    (periodoId) => {
      // Verificar si el periodo está en periodosReservados
      const esReservado = periodosReservados.some((periodoReservado) =>
        periodoReservado.periodos.includes(periodoId)
      );
      const esSolictado = periodosSolicitados.some((periodoSolicitado) =>
        periodoSolicitado.periodos.includes(periodoId)
      );

      if (esReservado) {
        return "periodos-reservado";
      } else if (esSolictado) {
        return "periodos-solicitado";
      }

      const periodoModificado = periodosModificados.includes(periodoId);
      return periodoModificado
        ? "periodos-inhabilitados"
        : "periodos-habilitados";
    },
    [periodosModificados, periodosReservados]
  );

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

  const cambiarTextoLabels = useCallback(
    (periodoId) => {
      // Verificar si el periodo está en periodosReservados
      const esReservado = periodosReservados.some((periodoReservado) =>
        periodoReservado.periodos.includes(periodoId)
      );

      // Verificar si el periodo está modificado
      const periodoModificado = periodosModificados.includes(periodoId);

      // Verificar si el periodo está inhabilitado
      const esSolicitado = periodosSolicitados.some((periodoReservado) =>
        periodoReservado.periodos.includes(periodoId)
      );

      // Determinar el texto del estado
      let textoEstado = "";
      if (esReservado) {
        textoEstado = "Reservado";
      } else if (periodoModificado) {
        textoEstado = "Inhabilitado";
      } else if (esSolicitado) {
        textoEstado = "Solicitado";
      } else {
        textoEstado = "Habilitado";
      }

      return textoEstado;
    },
    [periodosModificados, periodosReservados, periodosSolicitados]
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          background: "rgb(11 63 111)",
          color: "white",
          height: "3rem",
        }}
      >
        <h5
          style={{
            marginBottom: "0",
            marginLeft: "10px",
            alignContent: "center",
            fontWeight: "bold",
          }}
        >
          Calendario
        </h5>
      </div>
      <div
        style={{
          height: "88vh",
          width: "100%",
          backgroundColor: "#D9D9D9",
          paddingTop: "1rem",
        }}
      >
        <Calendar
          localizer={localizer}
          events={event}
          views={["month"]}
          defaultView="month"
          culture="es"
          selectable={true}
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
                className="CalendarioBusqueda-header-button-close d-flex justify-content-center align-items-center"
              >
                <XSquareFill size={24} />
              </div>
            </Col>
          </Row>
          <Row className="CalendarioBusqueda-body justify-content-center">
            <Form
              onSubmit={formik.handleSubmit}
              style={{ backgroundColor: "#D9D9D9" }}
            >
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="ambiente"
                style={{ marginTop: "0.5rem" }}
              >
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
                    className="btn CalendarioBusqueda-button-consultar"
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
                  <div className="periodos-container1">
                    <div className="periodos-grid">
                      <div className="periodos">
                        <h6>Mañana</h6>
                        {[1, 2, 3, 4].map((periodo, index, array) => {
                          const esReservado = periodosReservados.some(
                            (reservado) => reservado.periodos.includes(periodo)
                          );
                          // Mostrar checkbox solo para el primer periodo reservado

                          return (
                            <div key={periodo}>
                              <label
                                htmlFor={periodo.toString()}
                                className={`periodo-label1 ${cambiarColorLabels(
                                  periodo
                                )}`}
                              >
                                {`${
                                  periodo === 1
                                    ? "6:45-8:15"
                                    : periodo === 2
                                    ? "8:15-9:45"
                                    : periodo === 3
                                    ? "9:45-11:15"
                                    : "11:15-12:45"
                                }`}
                                <p>{cambiarTextoLabels(periodo)}</p>
                              </label>
                            </div>
                          );
                        })}
                      </div>

                      <div className="periodos">
                        <h6>Tarde</h6>
                        {[5, 6, 7, 8].map((periodo, index, array) => {
                          const esReservado = periodosReservados.some(
                            (reservado) => reservado.periodos.includes(periodo)
                          );

                          // Mostrar checkbox solo para el primer periodo reservado

                          return (
                            <div key={periodo}>
                              <label
                                htmlFor={periodo.toString()}
                                className={cambiarColorLabels(periodo)}
                              >
                                {`${
                                  periodo === 5
                                    ? "12:45-14:15"
                                    : periodo === 6
                                    ? "14:15-15:45"
                                    : periodo === 7
                                    ? "15:45-17:15"
                                    : "17:15-18:45"
                                }`}
                                <p>{cambiarTextoLabels(periodo)}</p>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                      <div className="periodos">
                        <h6>Noche</h6>
                        {[9, 10].map((periodo, index, array) => {
                          const esReservado = periodosReservados.some(
                            (reservado) => reservado.periodos.includes(periodo)
                          );

                          // Mostrar checkbox solo para el primer periodo reservado

                          return (
                            <div key={periodo}>
                              <label
                                htmlFor={periodo.toString()}
                                className={cambiarColorLabels(periodo)}
                              >
                                {`${
                                  periodo === 9 ? "18:45-20:15" : "20:15-21:45"
                                }`}
                                <p>{cambiarTextoLabels(periodo)}</p>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
            </Form>
          </Row>
        </Modal>
      </div>
    </>
  );
}

export default Calendario;
