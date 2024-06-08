import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Modal,
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  FormControl,
  Row,
  Stack,
} from "react-bootstrap";
import {
  CheckCircleFill,
  ExclamationCircleFill,
  QuestionCircleFill,
  XSquareFill,
} from "react-bootstrap-icons";
import {
  estadoinhabilitado,
  habilita,
  modificarPerio,
} from "../../../services/ModificarPeriodo.service";
import { AlertsContext } from "../../Alert/AlertsContext";
import "./style.css";
import { useEffect } from "react";
import {
  getAmbientes,
  getPeriodosReservados,
} from "../../../services/Ambiente.service";
import { useRef } from "react";

const ModificarEstadoDelAmbientePorFecha = ({ onclose }) => {
  const [ambientes, setAmbientes] = useState([]);
  const [ambientesEncontradas, setAmbientesEncontradas] = useState([]);
  const [ambiente, setAmbiente] = useState({});
  const [show, setShow] = useState("");
  const [estado, setEstado] = useState("");
  const [showMensajeDeConfirmacion, setShowMensajeDeConfirmacion] =
    useState(false);
  const [selected, setSelected] = useState(null);
  const { agregarAlert } = useContext(AlertsContext);
  const refDropdownMenu = useRef(null);
  const refDropdownToggle = useRef(null);
  const refDropdown = useRef(null);
  const [periodosReservados, setPeriodosReservados] = useState([]);
  const periodos = [
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

  const formik = useFormik({
    initialValues: {
      ambiente: { nombre: "", id: "" },
      fecha: "",
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
      fecha: Yup.date()
        .min(
          new Date(new Date().setDate(new Date().getDate() - 1)),
          "La fecha no puede ser anterior a la fecha actual"
        )
        .test("is-not-sundays", "No se admiten domigos", function (value) {
          return value.getDay() !== 0;
        })
        .required("Obligatorio"),
    }),
    onSubmit: (values) => {
      if (ambiente.id) {
        getAmbientPorFecha(values.ambiente, values.fecha);
      }
      setShow(false);
    },
  });

  const handleOnClickLimpiar = () => {
    setEstado("");
    setAmbiente({});
    setAmbientesEncontradas([]);
    setSelected(null);
    setShow(show);
    setShowMensajeDeConfirmacion(false);
    formik.resetForm();
  };

  const buscarAmbiente = async (event) => {
    if (
      event.hasOwnProperty("target") &&
      event.target.hasOwnProperty("value")
    ) {
      const value = event.target.value;
      if (value === "") {
        setAmbientesEncontradas([]);
        setShow(false);
      } else {
        setShow(true);
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
      setShow(false);
      setAmbiente(data);
    }
  };

  const setFechaDelAmbiente = (event, callback) => {
    setAmbiente({ ...ambiente, periodos: null });
    callback(event);
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

  const modificarPeriodos = async (estado) => {
    const periodosActualizados = periodos.map((periodo) => {
      if (estado === "Inhabilitar" && ambiente.periodos.includes(periodo.id)) {
        return periodo.id;
      }
      if (estado === "Habilitar" && !ambiente.periodos.includes(periodo.id)) {
        return periodo.id;
      }
      return periodo.id;
    });
    const response =
      estado === "Inhabilitar"
        ? await estadoinhabilitado(
            ambiente.id,
            periodosActualizados,
            ambiente.fecha
          )
        : await habilita(ambiente.id, periodosActualizados, ambiente.fecha);
    if (response !== null) {
      setAmbiente({ ...ambiente, periodos: periodosActualizados });
      agregarAlert({
        icon: <CheckCircleFill />,
        severidad: "success",
        mensaje: "Modificacion exitosa",
      });
    } else {
      agregarAlert({
        icon: <ExclamationCircleFill />,
        severidad: "danger",
        mensaje: "Modificacion fallida",
      });
    }
    getAmbientPorFecha(formik.values.ambiente, formik.values.fecha);
    setShowMensajeDeConfirmacion(false);
  };

  const mostrarMensajeDeConfirmacion = (estado) => {
    setEstado(estado);
    setShowMensajeDeConfirmacion(true);
  };

  const handlerOnClickAmbiente = ({ target }) => {
    let ambiente = ambientesEncontradas.find(
      (item) => item.nombre === target.value
    );
    setNombreDelAmbiente(ambiente);
    setSelected(target.value);
    setShow(false);
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
      setShow(false);
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
        setShow(false);
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [refDropdownMenu, refDropdown, refDropdownToggle]);

  return (
    <>
      <div style={{ width: "574px" }}>
        <Container className="ModificarEstadoDelAmbientePorFecha-header" fluid>
          <Row xs="auto" className="justify-content-md-end">
            <Col xs lg="10" style={{ alignContent: "center", padding: 0 }}>
              <h5 style={{ color: "white", fontWeight: "bold" }}>
                Modificar Estado de Ambiente por fecha
              </h5>
            </Col>
            <Button
              className="ModificarEstadoDelAmbientePorFecha-header-button-close"
              style={{ width: "58px", height: "3rem" }}
              onClick={onclose}
            >
              <XSquareFill style={{ width: "24px", height: "24px" }} />
            </Button>
          </Row>
        </Container>
        <Container className="ModificarEstadoDelAmbientePorFecha-body" fluid>
          <Row className="justify-content-md-center">
            <Col xs lg="9">
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group as={Row} className="mb-3" controlId="ambiente">
                  <Form.Label column sm="2">
                    Nombre
                  </Form.Label>
                  <Col sm="10" onBlur={() => console.log("col")} id="ambientes">
                    <Dropdown
                      ref={refDropdown}
                      id="ambientes"
                      show
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
                <Form.Group as={Row} className="mb-3" controlId="fecha">
                  <Form.Label column sm="2">
                    Fecha
                  </Form.Label>
                  <Col sm="5">
                    <FormControl
                      type="text"
                      placeholder="Ingrese la fecha"
                      onChange={(e) =>
                        setFechaDelAmbiente(e, formik.handleChange)
                      }
                      onFocus={(e) => {
                        e.target.type = "date";
                      }}
                      onBlur={(e) => {
                        e.target.type = "text";
                        formik.handleBlur(e);
                      }}
                      value={formik.values.fecha}
                    />
                    <Form.Text className="text-danger">
                      {formik.touched.fecha && formik.errors.fecha ? (
                        <div className="text-danger">{formik.errors.fecha}</div>
                      ) : null}
                    </Form.Text>
                  </Col>
                </Form.Group>
                <Row xs="auto" className="justify-content-md-end">
                  <Stack direction="horizontal" gap={2}>
                    <Button
                      className="btn ModificarEstadoDelAmbientePorFecha-button-limpiar"
                      onClick={handleOnClickLimpiar}
                    >
                      Limpiar
                    </Button>
                    {ambiente &&
                    Object.keys(ambiente).length > 0 &&
                    ambiente.periodos ? (
                      <>
                        <Button
                          className="btn ModificarEstadoDelAmbientePorFecha-button-habilitar"
                          onClick={() =>
                            mostrarMensajeDeConfirmacion("Inhabilitar")
                          }
                          disabled={!formik.isValid || !formik.dirty}
                        >
                          Inhabilitar
                        </Button>
                        <Button
                          className="btn ModificarEstadoDelAmbientePorFecha-button-inhabilitar"
                          onClick={() =>
                            mostrarMensajeDeConfirmacion("Habilitar")
                          }
                          disabled={!formik.isValid || !formik.dirty}
                        >
                          Habilitar
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="btn ModificarEstadoDelAmbientePorFecha-button-consultar"
                        type="submit"
                      >
                        Consultar
                      </Button>
                    )}
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
                          periodos.map((item) => (
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
                                        ? "ea4141"
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
                          periodos.map((item) => (
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
                                        ? "ea4141"
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
                          periodos.map((item) => (
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
                                        ? "ea4141"
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
                  ¿Esta seguro de hacer esta modificacion?
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
                        modificarPeriodos(estado);
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
    </>
  );
};

export default ModificarEstadoDelAmbientePorFecha;
