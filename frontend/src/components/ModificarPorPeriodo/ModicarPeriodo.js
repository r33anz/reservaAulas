import React, { useCallback, useState, useRef, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  buscarAmbientePorNombre,
  modificarPerio,
  estadoinhabilitado,
  habilita,
  getPeriodosReservados,
  inhabilitarReserva,
} from "../../services/ModificarPeriodo.service";
import "./style.css";
import {
  FormControl,
  Col,
  Alert,
  Container,
  Dropdown,
  Form,
  Row,
  Stack,
} from "react-bootstrap";
import { XSquareFill ,QuestionCircleFill} from "react-bootstrap-icons";
import { useFormik } from "formik";
import * as Yup from "yup";

const Modificarperdiodo = ({ onClose }) => {
  const inputAmbienteRef = useRef();
  const [show, setShow] = useState("");
  const [periodosModificados, setPeriodosModificados] = useState([]);
  const [consultarPresionado, setConsultarPresionado] = useState(false);
  const [enterPressed, setEnterPressed] = useState(false);
  const [ambientes, setAmbientes] = useState([]);
  const [ambiente, setAmbiente] = useState({});
  const [periodosReservados, setPeriodosReservados] = useState([]);
  const [estado1, setEstado] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const [showMensajeDeConfirmacion, setShowMensajeDeConfirmacion] =
  useState(false);

  const buscarAmbiente = async (event) => {
    setConsultarPresionado(false);

    if (
      event.hasOwnProperty("target") &&
      event.target.hasOwnProperty("value")
    ) {
      const originalValue = event.target.value;
      const trimmedValue = originalValue.trim(); // Eliminar espacios al inicio y al final

      if (trimmedValue === "") {
        // Si el valor es una cadena vacía, establecer el campo "ambiente" a una cadena vacía
        formik.setFieldValue("ambiente", {
          ...formik.values.ambiente,
          nombre: "",
        });
      } else if (!trimmedValue.startsWith(" ")) {
        // Verificar si el primer carácter no es un espacio
        const value = originalValue.toUpperCase(); // Convertir a mayúsculas si pasa la validación del espacio inicial

        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
          // Si pasa la validación de caracteres especiales, establecer el campo "ambiente" con el valor ingresado
          formik.setFieldValue("ambiente", {
            ...formik.values.ambiente,
            nombre: value,
          });
        }
      }
    }
  };

  const buscar = async (nombre) => {
    const { respuesta } = await buscarAmbientePorNombre(nombre);
    setAmbientes(respuesta);
    console.log(ambientes);
  };

  const buscarAmbientPorFecha = async (ambiente, fecha) => {
    const data = await modificarPerio(ambiente.id, fecha);
    const response = await getPeriodosReservados(ambiente.id, fecha);
    if (response) {
      setPeriodosReservados(response.periodosReservados);
      console.log(response);
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
      setConsultarPresionado(true);
    }
  };

  const estado = () => {
    setEstado("estado");
    const checkboxes = document.querySelectorAll(
      '.periodos-container input[type="checkbox"]'
    );
    const seleccionados = [];
    formik.setFieldValue("ambiente", {
      id: ambiente.id,
      nombre: ambiente.nombre,
    });
    
    let requiereConfirmacion = false;
    
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        seleccionados.push({ id: checkbox.id });
        const checkboxIdAsNumber = parseInt(checkbox.id, 10);

        // Verificar si el ID del checkbox está en periodosReservados
        const periodoReservado = periodosReservados.find((reservado) =>
          reservado.periodos.includes(checkboxIdAsNumber)
        );
        
        if (periodoReservado) {
          // Marcar que se requiere confirmación
          requiereConfirmacion = true;
        }
      }
    });

    // Desmarcar todas las casillas de verificación
    

    if (requiereConfirmacion) {
      setShowMensajeDeConfirmacion(true);
    } else {
      realizarCambios();
    }
};

const realizarCambios = () => {
    const checkboxes = document.querySelectorAll(
      '.periodos-container input[type="checkbox"]'
    );
    
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const checkboxIdAsNumber = parseInt(checkbox.id, 10);

        const periodoReservado = periodosReservados.find((reservado) =>
          reservado.periodos.includes(checkboxIdAsNumber)
        );

        if (periodoReservado) {
          const idSolicitud = periodoReservado.idSolicitud;
          inhabilitarReser(idSolicitud);
          console.log(`Periodo ${checkboxIdAsNumber} está reservado con idSolicitud ${idSolicitud}`);
        } else if (periodosModificados.includes(checkboxIdAsNumber)) {
          otraHabilitar(checkbox.id);
        } else {
          otraFuncion(checkbox.id);
        }

      }
    });
checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    buscarAmbientPorFecha(formik.values.ambiente, formik.values.fecha);
    setShowMensajeDeConfirmacion(false);
};

const handleAceptar = () => {
  realizarCambios();
};

const inhabilitarReser = (id) => {
  const ids = [id];
  inhabilitarReserva(ids);
};

const otraHabilitar = (id) => {
  const ids = [id];
  habilita(formik.values.ambiente.id, ids, formik.values.fecha);
};

const otraFuncion = (id) => {
  const ids = [id];
  estadoinhabilitado(formik.values.ambiente.id, ids, formik.values.fecha);
};

  const cambiarColorLabels = useCallback(
    (periodoId) => {
      // Verificar si el periodo está en periodosReservados
      const esReservado = periodosReservados.some((periodoReservado) =>
        periodoReservado.periodos.includes(periodoId)
      );

      if (esReservado) {
        return "periodos-reservado";
      }

      const periodoModificado = periodosModificados.includes(periodoId);
      return periodoModificado ? "periodos-inhabilitados" : "periodos-habilitados";
    },
    [periodosModificados, periodosReservados]
  );

  const formik = useFormik({
    initialValues: {
      ambiente: { nombre: "", id: "" },
      fecha: "",
    },
    validationSchema: Yup.object({
      ambiente: Yup.object().shape({
        nombre: Yup.string()
          .required("Obligatorio")
          .test("existe-ambiente", "No existe el ambiente", function (value) {
            const ambients = ambientes.map((ambiente) =>
              ambiente.nombre.trim()
            );
            // Verificar si el valor ingresado (sin espacios al final) está presente en la lista de nombres de ambientes
            return ambients.includes(value.trim());
          }),

      }),
      fecha: Yup.date()
        .min(
          new Date(new Date().setDate(new Date().getDate() - 1)),
          "La fecha no puede ser anterior a la fecha actual"
        )
        .required("Obligatorio")
        .test("is-not-sunday", "No se admiten domingos", function (value) {
          // Verificar si la fecha seleccionada es un domingo (domingo = 0)
          return value.getDay() !== 0;
        }),
    }),
    onSubmit: (values) => {
      buscarAmbientPorFecha(values.ambiente, values.fecha);
      setEnterPressed(true);

      // buscarAmbientPorFecha(values.ambiente, values.fecha);
      setEnterPressed(false);
      console.log();
      //setAmbientes([formik.values.ambiente]);

      inputAmbienteRef.current.blur();
    },
  });

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (ambientes.length > 0) {
        const ambienteEncontrado = ambientes.find((ambiente) =>
          ambiente.nombre
            .toLowerCase()
            .includes(formik.values.ambiente.nombre.trim().toLowerCase())
        );

        if (ambienteEncontrado) {
          setNombreDelAmbiente(ambienteEncontrado);
          console.log(ambienteEncontrado);
          setEnterPressed(true);
        } else {
          setEnterPressed(false);
        }

        inputAmbienteRef.current.blur();
      }
    }
  };

  const setNombreDelAmbiente = (ambiente) => {
    formik.setFieldValue("ambiente", {
      id: ambiente.id,
      nombre: ambiente.nombre,
    });
    setEnterPressed(true);
    setConsultarPresionado(false);
    setShow("");
  };

  const setFechaDelAmbiente = (event, callback) => {
    setAmbiente({ ...ambiente, periodos: null });
    setConsultarPresionado(false);
    callback(event);
  };

  useEffect(() => {
    buscar(" ");
  }, []);

  return (
    <div style={{ width: "574px" }}>
      <Container className="ModificarEstadoDelAmbientePorFecha-header" fluid>
        <Row xs="auto" className="justify-content-md-end">
          <Col xs lg="10" style={{ alignContent: "center", padding: 0 }}>
            <h5 style={{ color: "white", fontWeight: "bold" }}>
              Modificar Estado de Ambiente por Periodo
            </h5>
          </Col>
          <Button
            className="ModificarEstadoDelAmbientePorFecha-header-button-close"
            style={{ width: "58px", height: "3rem" }}
            onClick={onClose}
          >
            <XSquareFill style={{ width: "24px", height: "24px" }} />
          </Button>
        </Row>
      </Container>
      <Container className="ModificarEstadoDelAmbientePorFecha-body" fluid>
        <Row className="justify-content-md-center">
          <Col xs lg="15">
            <Form onSubmit={formik.handleSubmit} onKeyPress={handleKeyPress}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Nombre{" "}
                </Form.Label>
                <Col sm="10">
                  <Dropdown>
                    <Dropdown.Toggle
                      style={{ width: "100%" }}
                      ref={inputAmbienteRef}
                      as={"input"}
                      id="ambiente"
                      type="text"
                      placeholder="Ingrese el nombre del ambiente"
                      onChange={buscarAmbiente}
                      onBlur={formik.handleBlur}
                      value={formik.values.ambiente.nombre}
                      className="form-control"
                      bsPrefix="dropdown-toggle"
                    />
                    {formik.values.ambiente.nombre !== "" &&
                      ambientes.filter((ambiente) =>
                        ambiente.nombre
                          .toLowerCase()
                          .includes(
                            formik.values.ambiente.nombre.trim().toLowerCase()
                          )
                      ).length > 0 && (
                        <Dropdown.Menu
                          className={show}
                          style={{
                            width: "100%",
                            overflowY: "auto",
                            maxHeight: "5rem",
                          }}
                          show
                        >
                          {ambientes
                            .filter((ambiente) =>
                              ambiente.nombre
                                .toLowerCase()
                                .includes(
                                  formik.values.ambiente.nombre
                                    .trim()
                                    .toLowerCase()
                                )
                            )
                            .map((ambiente) => (
                              <Dropdown.Item
                                key={ambiente.nombre}
                                onClick={() => setNombreDelAmbiente(ambiente)}
                              >
                                {ambiente.nombre}
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
                  <Button className="consultar1-button" type="submit">
                    Consultar
                  </Button>
                </Stack>
              </Row>
            </Form>
            <Form.Group as={Row} className="mb-3">
              <Col sm="3">
                {consultarPresionado && ambientes.length > 0 && (
                  <div className="periodos-container">
                    <h6>Periodos:</h6>
                    <div className="circle-container">
                      <div
                        className="circle"
                        style={{ backgroundColor: "white" }}
                      ></div>
                      <span className="text">{"Periodos habilitados"}</span>
                      <div
                        className="circle"
                        style={{ backgroundColor: "#a4a6a6" }}
                      ></div>
                      <span className="text">{"Periodos inhabilitados"}</span>
                      <div
                        className="circle"
                        style={{ backgroundColor: "#ffcccb" }}
                      ></div>
                      <span className="text">{"Periodos reservados"}</span>
                    </div>
                    <div className="periodos-grid">
                      <div className="periodos">
                        <h6>Mañana</h6>
                        {[1, 2, 3, 4].map((periodo, index, array) => {
                          const esReservado = periodosReservados.some(
                            (reservado) => reservado.periodos.includes(periodo)
                          );
                          // Mostrar checkbox solo para el primer periodo reservado
                          const esPrimerPeriodoDeRango =
                          esReservado &&
                          // Verificar si el período actual es el primero en cualquiera de los rangos de periodos reservados
                          periodosReservados.some((reservado) => periodo === reservado.periodos[0]);
                          return (
                            <div key={periodo}>
                              {(!esReservado || esPrimerPeriodoDeRango) && (
                                <input
                                  type="checkbox"
                                  id={periodo.toString()}
                                  name={`periodo${periodo}`}
                                  value={`periodo${periodo}`}
                                />
                              )}
                              <label
                                htmlFor={periodo.toString()}
                                className={cambiarColorLabels(periodo)}
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
                          const esPrimerPeriodoDeRango =
    esReservado &&
    // Verificar si el período actual es el primero en cualquiera de los rangos de periodos reservados
    periodosReservados.some((reservado) => periodo === reservado.periodos[0]);
                          return (
                            <div key={periodo}>
                              {(!esReservado || esPrimerPeriodoDeRango) && (
                                <input
                                  type="checkbox"
                                  id={periodo.toString()}
                                  name={`periodo${periodo}`}
                                  value={`periodo${periodo}`}
                                />
                              )}
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
                          const esPrimerPeriodoDeRango =
    esReservado &&
    // Verificar si el período actual es el primero en cualquiera de los rangos de periodos reservados
    periodosReservados.some((reservado) => periodo === reservado.periodos[0]);
                          return (
                            <div key={periodo}>
                              {(!esReservado || esPrimerPeriodoDeRango) && (
                                <input
                                  type="checkbox"
                                  id={periodo.toString()}
                                  name={`periodo${periodo}`}
                                  value={`periodo${periodo}`}
                                />
                              )}
                              <label
                                htmlFor={periodo.toString()}
                                className={cambiarColorLabels(periodo)}
                              >
                                {`${
                                  periodo === 9 ? "18:45-20:15" : "20:15-21:45"
                                }`}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <Row xs="auto" className="justify-content-md-end">
                      <Stack direction="horizontal" gap={2}>
                        <Button className="modi" onClick={estado}>
                          Modificar
                        </Button>
                      </Stack>
                    </Row>
                  </div>
                )}
              </Col>
            </Form.Group>
          </Col>
        </Row>
      </Container>
      {estado1 !== "" && (
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
          ¿Está seguro de hacer esta modificación?
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
              onClick={handleAceptar}
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
};

export default Modificarperdiodo;
