import React, { useContext, useEffect, useState, useRef } from "react";
import {
  getBloques,
  getGruposPorBloque,
  postReserva,
  postReserva2,
  getDocente,
  recuperarAmbientePorID,
} from "../../services/SolicitarReserva.service";
import { buscarAmbientePorNombre } from "../../services/Busqueda.service";
import {
  Container,
  Row,
  Modal,
  Col,
  Form,
  Button,
  Stack,
  Dropdown,
  FormControl,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  CheckCircleFill,
  ExclamationCircleFill,
  QuestionCircleFill,
  XSquareFill,
} from "react-bootstrap-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./style.css";
import { AlertsContext } from "../Alert/AlertsContext";

const SolicitarReserva = ({ onClose }) => {
  const inputAmbienteRef = useRef();
  const [showDropdown, setShowDropdown] = useState(false);
  const [
    capacidadDelAmbienteSeleccionado,
    setCapacidadDelAmbienteSeleccionado,
  ] = useState(null);
  const [ida, setidambiente] = useState(null);
  const [materiasData, setMateriasData] = useState({});
  const [bloques, setBloques] = useState([]);
  const [docentes, setDocente] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const { agregarAlert } = useContext(AlertsContext);
  const [nombreAmbiente, setNombreAmbiente] = useState(""); // Estado para almacenar el nombre del ambiente
  const [ambienteOptions, setAmbienteOptions] = useState([]); // Estado para almacenar las opciones de ambiente
  const [loading, setLoading] = useState(false);
  const [periodos, setPeriodos] = useState([
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
  ]);
  const [periodos1, setPeriodos1] = useState([
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
  ]);
  const [razon, setRazon] = useState([
    { id: 1, name: "Primer Parcial" },
    { id: 2, name: "Segundo Parcial" },
    { id: 3, name: "Examen Final" },
    { id: 4, name: "Segunda Instancia" },
    { id: 5, name: "Examen de mesa" },
  ]);
  const [periodosFin, setPeriodosFin] = useState(periodos1);
  const [step, setStep] = useState(1); // Nuevo estado para manejar los pasos del formulario
  const [estado, setEstado] = useState("");
  const [showMensajeDeConfirmacion, setShowMensajeDeConfirmacion] =
    useState(false);

  // Función para buscar los ambientes que coinciden con el nombre
  const buscarAmbiente = async (event) => {
    if (
      event.hasOwnProperty("target") &&
      event.target.hasOwnProperty("value")
    ) {
      const originalValue = event.target.value;
      const trimmedValue = originalValue.trim(); // Eliminar espacios al inicio y al final

      if (trimmedValue === "") {
        formik.setFieldValue("nombreAmbiente", ""); // Actualiza el estado directamente con una cadena vacía
        setShowDropdown(false); // Oculta el desplegable si el valor está vacío
      } else if (!trimmedValue.startsWith(" ")) {
        // Verificar si el primer carácter no es un espacio
        const value = originalValue.toUpperCase(); // Convertir a mayúsculas si pasa la validación del espacio inicial

        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
          formik.setFieldValue("nombreAmbiente", value); // Actualiza el estado directamente con el nombre
          setShowDropdown(true); // Muestra el desplegable si el valor es válido
          setCapacidadDelAmbienteSeleccionado(null);

          const matchingOption = ambienteOptions.find(
            (option) => option.nombre === value
          );
          if (matchingOption) {
            console.log(matchingOption);
            setNombreDelAmbiente(matchingOption);
            // Aquí puedes usar matchingOption para acceder a toda la información de la opción que coincide
          }
        }
      }
    }
  };

  const buscar = async (nombre) => {
    const { respuesta } = await buscarAmbientePorNombre(nombre);
    setAmbienteOptions(respuesta);
    console.log(ambienteOptions);
  };

  const docente = (nombre) => {
    getDocente(nombre)
      .then((data) => {
        setDocente(data.nombre);

        // Obtener los nombres de las materias
        const materiasNombres = Object.keys(data.materias);
        setBloques(materiasNombres);

        // Guardar los datos de las materias para su uso posterior
        setMateriasData(data.materias);

        console.log(data, "qa"); // Actualizar las opciones de ambiente con los datos obtenidos
      })
      .catch((error) => {
        console.log("Error al buscar los ambientes:", error);
        setAmbienteOptions([]); // Limpiar las opciones de ambiente en caso de error
      });
  };

  // Función para seleccionar un ambiente de la lista de opciones
  const validosKey = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "Backspace",
    "Tab",
  ];
  const formik = useFormik({
    initialValues: {
      razon: "",
      capacidad: "",
      materia: "",
      nombreAmbiente: "",
      grupo: "", // Nuevo campo para el grupo
      fechaReserva: "",
      periodoInicio: "",
      periodoFin: "",
    },
    validationSchema: Yup.object({
      nombreAmbiente: Yup.string() // Validar como cadena en lugar de objeto
        .test("existe-ambiente", "No existe el ambiente", function (value) {
          const ambientes = ambienteOptions.map((ambiente) => ambiente.nombre);
          //setCapacidadDelAmbienteSeleccionado(null);
          return ambientes.includes(value);
        })
        .required("Obligatorio"),
      razon: Yup.string().required("Obligatorio"),
      periodoInicio: Yup.string().required("Obligatorio"),
      periodoFin: Yup.string().required("Obligatorio"),
      capacidad: Yup.number()
        .positive("Debe ser mayor a 0")
        .required("Obligatorio")
        .max(
          capacidadDelAmbienteSeleccionado,
          "No puede ser mayor que otro número"
        ),
      materia: Yup.string().required("Obligatorio"),
      grupo: Yup.string().required("Obligatorio"),
      fechaReserva: Yup.date()
        .min(
          new Date(new Date().setDate(new Date().getDate() - 1)),
          "La fecha no puede ser anterior a la fecha actual"
        )
        .test(
          "is-not-sunday",
          "No puedes reservar para un domingo",
          function (value) {
            // Verificar si la fecha seleccionada es un domingo (domingo = 0)
            return value.getDay() !== 0;
          }
        )
        .required("Obligatorio"),
    }),
    onSubmit: (values) => {
      const id = window.sessionStorage.getItem("docente_id");
      const periodoInicioID = parseInt(values.periodoInicio, 10);
      const periodoFinID = parseInt(values.periodoFin, 10);

      // Combinar los IDs de periodoInicio y periodoFin en un solo array
      const periodoIDs = [periodoInicioID, periodoFinID];

      // Asignar la lista de IDs a values.periodos
      values.periodos = periodoIDs;
      values.ambiente = ida;
      values.idDocente = id;
      console.log(periodoIDs);
      setLoading(true);
      postReserva(values)
        .then((response) => {
          if (response.mensaje === "Resgistro existoso") {
            console.log("Registro exitoso");
            agregarAlert({
              icon: <CheckCircleFill />,
              severidad: "success",
              mensaje: "Se realizo la solicitud correctamente",
            });
            formik.resetForm();
            setCapacidadDelAmbienteSeleccionado(null);
            setStep(1);
            setLoading(false);
          } else if (response[0].alerta === "advertencia") {
            agregarAlert({
              icon: <ExclamationCircleFill />,
              severidad: "danger",
              mensaje: response[0].mensaje,
            });
            setLoading(false);
          } else if (response[0].alerta === "alerta") {
            setEstado("estado");

            setShowMensajeDeConfirmacion(true);
            agregarAlert({
              icon: <ExclamationCircleFill />,
              severidad: "warning",
              mensaje: response[0].mensaje,
            });
            setLoading(false);
          } else {
            setLoading(false);
            // Manejar otros casos no esperados
            throw new Error("Estado no esperado en la respuesta");
          }
        })
        .catch((error) => {
          console.log("Error capturado:", error);
          agregarAlert({
            icon: <ExclamationCircleFill />,
            severidad: "danger",
            mensaje: error.message || "Ha ocurrido un error",
          });
        });
    },
  });

  const handleKeyPress = (event) => {
    if (
      event.code === "Enter" &&
      formik.values.nombreAmbiente !== "" &&
      document.activeElement === inputAmbienteRef.current
    ) {
      const ambienteEncontrado = ambienteOptions.find((ambiente) =>
        ambiente.nombre
          .toLowerCase()
          .includes(formik.values.nombreAmbiente.trim().toLowerCase())
      );
      if (ambienteEncontrado) {
        setNombreDelAmbiente(ambienteEncontrado);
        setShowDropdown(false);
        if (document.activeElement === inputAmbienteRef.current) {
          inputAmbienteRef.current.blur();
        }
        console.log(ambienteEncontrado);
      }
    }
  };

  const setPisosPorBloqueSeleccionado = (e) => {
    const materiaSeleccionada = e.target.value;

    // Obtener y establecer los grupos asociados con el bloque seleccionado
    const gruposAsociados = materiasData[materiaSeleccionada]?.grupos || [];
    setGrupos(gruposAsociados);

    formik.setFieldValue("grupo", ""); // Limpiar el campo grupo en el formulario, si estás usando Formik
  };

  const setNombreDelAmbiente = async (ambiente) => {
    formik.setFieldValue("nombreAmbiente", ambiente.nombre); // Asigna el nombre directamente
    setidambiente(ambiente.id);
    //setShowDropdown(false);
    recuperarAmbientePorID(ambiente.id)
      .then((data) => {
        // Actualizar estado con los detalles del ambiente
        setCapacidadDelAmbienteSeleccionado(data.capacidad);
        console.log(data.capacidad);
      })
      .catch((error) => {
        console.log("Error al buscar el ambiente:", error);
      });
    //inputAmbienteRef.current.blur();
  };
  const reserva = async (val) => {
    setShowMensajeDeConfirmacion(false);
    postReserva2(val)
      .then((response) => {
        if (response.mensaje === "Resgistro existoso") {
          console.log("Registro exitoso");
          agregarAlert({
            icon: <CheckCircleFill />,
            severidad: "success",
            mensaje: "Se realizo la solicitud correctamente",
          });
          formik.resetForm();
          setCapacidadDelAmbienteSeleccionado(null);
          setStep(1);
        }
      })
      .catch((error) => {
        console.log("Error capturado:", error);
        agregarAlert({
          icon: <ExclamationCircleFill />,
          severidad: "danger",
          mensaje: error.message || "Ha ocurrido un error",
        });
      });
  };
  useEffect(() => {
    console.log("showDropdown", showDropdown);
  }, [showDropdown]);

  useEffect(() => {
    console.log(razon);
    const id = window.sessionStorage.getItem("docente_id");
    docente(id);
    setLoading(false);
    //setBloques(bloquesData);
    buscar(" ");
  }, []);

  const renderFirstStep = () => (
    <div style={{ width: "50%" }}>
      <Container className="RegistrarAmbiente-header" fluid>
        <Row xs="auto" className="text-white justify-content-end">
          <Col
            xs="12"
            className="d-flex justify-content-start align-items-center"
            style={{ height: "3rem", padding: 0, paddingLeft: "0.5rem" }}
          >
            <h5 style={{ fontWeight: "bold" }}>
              Registrar reserva de Ambiente
            </h5>
          </Col>
        </Row>
      </Container>
      <Container className="RegistrarAmbiente-body" fluid>
        <Row className="justify-content-md-center">
          <Col xs lg="11">
            <Form onSubmit={formik.handleSubmit} onKeyPress={handleKeyPress}>
              <Stack gap={2} direction="vertical">
                <Col lg="12">
                  <p>Docente: {docentes}</p>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="fechaReserva"
                  >
                    <Form.Label className="RegistrarSolicitud-required">
                      Fecha Reserva
                    </Form.Label>
                    <Col>
                      <FormControl
                        type="text"
                        placeholder="Ingrese la fecha para la reserva"
                        onChange={formik.handleChange}
                        onFocus={(e) => {
                          e.target.type = "date";
                        }}
                        onBlur={(e) => {
                          e.target.type = "text";
                          formik.handleBlur(e);
                        }}
                        value={formik.values.fechaReserva}
                      />
                      <Form.Text className="text-danger">
                        {formik.touched.fechaReserva &&
                        formik.errors.fechaReserva ? (
                          <div className="text-danger">
                            {formik.errors.fechaReserva}
                          </div>
                        ) : null}
                      </Form.Text>
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="materia">
                    <Form.Label className="RegistrarSolicitud-required">
                      Materia
                    </Form.Label>
                    <Form.Select
                      onChange={(e) => {
                        setPisosPorBloqueSeleccionado(e);
                        formik.handleChange(e);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.materia}
                    >
                      <option value="" disabled selected>
                        Ingrese una materia
                      </option>
                      {bloques.map((bloque, index) => (
                        <option key={index} value={bloque}>
                          {bloque}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-danger">
                      {formik.touched.materia && formik.errors.materia ? (
                        <div className="text-danger">
                          {formik.errors.materia}
                        </div>
                      ) : null}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="grupo">
                    <Form.Label className="RegistrarSolicitud-required">
                      Grupo
                    </Form.Label>
                    <Form.Select
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.grupo}
                      disabled={!formik.values.materia} // Deshabilitar si no se ha seleccionado una materia
                    >
                      <option value="" disabled selected>
                        Seleccione un grupo
                      </option>
                      {grupos.map((grupo) => (
                        <option key={grupo} value={grupo}>
                          {grupo}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-danger">
                      {formik.touched.grupo && formik.errors.grupo ? (
                        <div className="text-danger">{formik.errors.grupo}</div>
                      ) : null}
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Stack>
            </Form>
            <Stack
              gap={2}
              direction="horizontal"
              className="justify-content-end"
            >
              <Button
                className="btn RegistrarAmbiente-button-cancel"
                size="sm"
                onClick={() => {
                  setCapacidadDelAmbienteSeleccionado(null);
                  formik.resetForm();
                  setAmbienteOptions([]);
                  setStep(1);
                }}
              >
                Limpiar
              </Button>
              <Button
                className="btn RegistrarAmbiente-button-register"
                size="sm"
                type="submit"
                onClick={() => setStep(2)}
              >
                Siguiente
              </Button>
            </Stack>
          </Col>
        </Row>
      </Container>
    </div>
  );

  const renderSecondStep = () => (
    <div style={{ width: "50%" }}>
      <Container className="RegistrarAmbiente-header" fluid>
        <Row xs="auto" className="text-white justify-content-end">
          <Col
            xs="12"
            className="d-flex justify-content-start align-items-center"
            style={{ height: "3rem", padding: 0, paddingLeft: "0.5rem" }}
          >
            <h5 style={{ fontWeight: "bold" }}>
              Registrar reserva de Ambiente
            </h5>
          </Col>
        </Row>
      </Container>
      <Container className="RegistrarAmbiente-body" fluid>
        <Row className="justify-content-md-center">
          <Col xs lg="11">
            <Form onSubmit={formik.handleSubmit} onKeyPress={handleKeyPress}>
              <Stack gap={2} direction="vertical">
                <Col lg="12">
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="nombreAmbiente"
                  >
                    <Form.Label className="RegistrarSolicitud-required">
                      Nombre del Ambiente
                    </Form.Label>
                    <Col>
                      <Dropdown id="solicitudnombreAmbientes">
                        <Dropdown.Toggle
                          ref={inputAmbienteRef}
                          as={"input"}
                          id="nombreAmbiente"
                          type="text"
                          placeholder="Ingrese el nombre del ambiente"
                          onChange={buscarAmbiente}
                          onBlur={formik.handleBlur}
                          value={formik.values.nombreAmbiente}
                          className="form-control"
                          bsPrefix="dropdown-toggle"
                        />
                        {formik.values.nombreAmbiente !== "" &&
                          ambienteOptions.filter((ambiente) =>
                            ambiente.nombre
                              .toLowerCase()
                              .includes(
                                formik.values.nombreAmbiente
                                  .trim()
                                  .toLowerCase()
                              )
                          ).length > 0 && (
                            <Dropdown.Menu
                              class={`dropdown-menu ${
                                showDropdown ? "show" : ""
                              }`}
                              style={{
                                width: "100%",
                                overflowY: "auto",
                                maxHeight: "5rem",
                              }}
                            >
                              {ambienteOptions
                                .filter((ambiente) =>
                                  ambiente.nombre
                                    .toLowerCase()
                                    .includes(
                                      formik.values.nombreAmbiente
                                        .trim()
                                        .toLowerCase()
                                    )
                                )
                                .map((ambiente) => (
                                  <Dropdown.Item
                                    key={ambiente.nombre}
                                    onClick={() =>
                                      setNombreDelAmbiente(ambiente)
                                    }
                                  >
                                    {ambiente.nombre}
                                  </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                          )}
                      </Dropdown>
                      <Form.Text className="text-danger">
                        {formik.touched.nombreAmbiente &&
                        formik.errors.nombreAmbiente ? (
                          <div className="text-danger">
                            {formik.errors.nombreAmbiente}
                          </div>
                        ) : null}
                      </Form.Text>
                    </Col>
                  </Form.Group>
                  {capacidadDelAmbienteSeleccionado !== null && (
                    <p>Capacidad:{capacidadDelAmbienteSeleccionado}</p>
                  )}

                  <Form.Group
                    className="mb-3 RegistrarAmbiente-entrada-numero"
                    controlId="capacidad"
                  >
                    <Form.Label className="RegistrarSolicitud-required">
                      Cantidad de alumnos
                    </Form.Label>
                    <Form.Control
                      type="number"
                      onKeyDown={(e) => {
                        if (!validosKey.includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="Ingrese un valor"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.capacidad}
                      disabled={!formik.values.nombreAmbiente}
                    />
                    <Form.Text className="text-danger">
                      {formik.touched.capacidad && formik.errors.capacidad ? (
                        <div className="text-danger">
                          {formik.errors.capacidad}
                        </div>
                      ) : null}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="razon">
                    <Form.Label className="RegistrarSolicitud-required">
                      Razon
                    </Form.Label>
                    <Form.Select
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.razon}
                    >
                      <option value="" disabled selected>
                        Seleccione un razon
                      </option>
                      {razon.map((razon) => (
                        <option key={razon.id} value={razon.name}>
                          {razon.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-danger">
                      {formik.touched.razon && formik.errors.razon ? (
                        <div className="text-danger">{formik.errors.razon}</div>
                      ) : null}
                    </Form.Text>
                  </Form.Group>

                  <div className="periodos-columna">
                    <Form.Group className="mb-3" controlId="periodoInicio">
                      <Form.Label className="RegistrarSolicitud-required">
                        Periodo Inicio
                      </Form.Label>
                      <Form.Select
                        onChange={(e) => {
                          formik.handleChange(e);
                          // Filtrar los periodos fin basado en el periodo inicio seleccionado
                          const selectedPeriodoInicio = parseInt(
                            e.target.value,
                            10
                          );
                          const filteredPeriodos1 = periodos1.filter(
                            (item) => item.id >= selectedPeriodoInicio
                          );
                          // Actualizar los periodos fin disponibles
                          setPeriodosFin(filteredPeriodos1);
                          // Restablecer el valor del periodo fin
                          formik.setFieldValue("periodoFin", "");
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.periodoInicio}
                      >
                        <option value="" disabled selected>
                          Hora inicio
                        </option>
                        {periodos.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.hora}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-danger">
                        {formik.touched.periodoInicio &&
                        formik.errors.periodoInicio ? (
                          <div className="text-danger">
                            {formik.errors.periodoInicio}
                          </div>
                        ) : null}
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="periodoFin">
                      <Form.Label className="RegistrarSolicitud-required">
                        Periodo Fin
                      </Form.Label>
                      <Form.Select
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.periodoFin}
                        disabled={!formik.values.periodoInicio}
                      >
                        <option value="" disabled selected>
                          Hora final
                        </option>
                        {periodosFin.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.hora}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-danger">
                        {formik.touched.periodoFin &&
                        formik.errors.periodoFin ? (
                          <div className="text-danger">
                            {formik.errors.periodoFin}
                          </div>
                        ) : null}
                      </Form.Text>
                    </Form.Group>
                  </div>
                </Col>
                <Row xs="auto" className="justify-content-md-end">
                  <Stack direction="horizontal" gap={2}>
                    <Button
                      className="btn RegistrarAmbiente-button-cancel"
                      size="sm"
                      onClick={() => setStep(1)}
                      disabled={loading}
                    >
                      Anterior
                    </Button>
                    <Button
                      className="btn RegistrarAmbiente-button-cancel"
                      size="sm"
                      onClick={() => {
                        setCapacidadDelAmbienteSeleccionado(null);
                        formik.resetForm();
                        setStep(1);
                      }}
                      disabled={loading}
                    >
                      Limpiar
                    </Button>
                    <Button
                      className="btn RegistrarAmbiente-button-register"
                      size="sm"
                      type="submit"
                      disabled={loading}
                      //disabled={!formik.isValid || !formik.dirty}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="grow" size="sm" />
                          Registrando...
                        </>
                      ) : (
                        "Registrar"
                      )}
                    </Button>
                  </Stack>
                </Row>
              </Stack>
            </Form>
          </Col>
        </Row>
      </Container>
      {estado !== "" && (
        <Modal
          size="xs"
          aria-labelledby="contained-modal-title-vcenter"
          show={showMensajeDeConfirmacion}
          onHide={() => setShowMensajeDeConfirmacion(false)}
          centered
        >
          <Alert
            variant="primary"
            show={showMensajeDeConfirmacion}
            style={{ margin: 0 }}
          >
            <Container>
              <Row xs="auto">
                <QuestionCircleFill size="2rem" />
                ¿Quiere continuar reservando?
              </Row>
              <Row xs="auto" className="justify-content-md-end">
                <Stack direction="horizontal" gap={2}>
                  <Button
                    className="btn ModificarEstadoDelAmbientePorFecha-cancel"
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowMensajeDeConfirmacion(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="btn ModificarEstadoDelAmbientePorFecha-aceptar"
                    onClick={() => {
                      reserva(formik.values);
                    }}
                    size="sm"
                  >
                    Aceptar
                  </Button>
                </Stack>
              </Row>
            </Container>
          </Alert>
        </Modal>
      )}
    </div>
  );

  return <>{step === 1 ? renderFirstStep() : renderSecondStep()}</>;
};

export default SolicitarReserva;
