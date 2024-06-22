import React, { useCallback, useState, useRef, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import {
  buscarAmbientePorNombre,
  modificarPerio,
  estadoinhabilitado,
  habilita,
  getPeriodosReservados,
  inhabilitarReserva,
  getPeriodosSolicitados,
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
import { QuestionCircleFill } from "react-bootstrap-icons";
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
  const [periodosSolicitados, setPeriodosSolicitados] = useState([]);
  const [estado1, setEstado] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [showMensajeDeConfirmacion, setShowMensajeDeConfirmacion] =
    useState(false);
  const [loading, setLoading] = useState(false);

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
        const periodoSolicitado = periodosSolicitados.find((reservado) =>
          reservado.periodos.includes(checkboxIdAsNumber)
        );
        if (periodoReservado) {
          // Marcar que se requiere confirmación
          requiereConfirmacion = true;
        }
        if (periodoSolicitado) {
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
        const periodoSolicitado = periodosSolicitados.find((reservado) =>
          reservado.periodos.includes(checkboxIdAsNumber)
        );
        if (periodoReservado) {
          const idSolicitud = periodoReservado.idSolicitud;
          inhabilitarReser(idSolicitud);
          console.log(
            `Periodo ${checkboxIdAsNumber} está reservado con idSolicitud ${idSolicitud}`
          );
        } else if (periodoSolicitado) {
          const idSolicitud = periodoSolicitado.idSolicitud;
          inhabilitarReser(idSolicitud);
          console.log(
            `Periodo ${checkboxIdAsNumber} está solicitado con idSolicitud ${idSolicitud}`
          );
        } else if (periodosModificados.includes(checkboxIdAsNumber)) {
          otraHabilitar(checkbox.id);
        } else {
          otraFuncion(checkbox.id);
        }
      }
    });
    setSelectAll(false);
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    buscarAmbientPorFecha(formik.values.ambiente, formik.values.fecha);
    setShowMensajeDeConfirmacion(false);
  };

  const handleAceptar = () => {
    realizarCambios();
  };

  const inhabilitarReser = async (id) => {
    const ids = [id];
    setLoading(true);
    await inhabilitarReserva(ids);
    setLoading(false);
  };

  const otraHabilitar = async (id) => {
    const ids = [id];
    setLoading(true);
    await habilita(formik.values.ambiente.id, ids, formik.values.fecha);
    setLoading(false);
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
    setLoading(false);
  }, []);

  const selectAllPeriods = () => {
    const checkboxes = document.querySelectorAll(
      '.periodos-container input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = !selectAll;
    });
    setSelectAll(!selectAll);
  };

  return (
    <div style={{ display: "grid", height: "93vh", alignContent: "center", justifyContent: "center" }}>
      <Container className="ModificarEstadoDelAmbientePorPeriodo-header">
        <Row xs="auto" className="text-white justify-content-end">
          <Col
            xs="12"
            className="d-flex justify-content-start align-items-center"
            style={{ height: "3rem", padding: 0, paddingLeft: "0.5rem" }}
          >
            <h5 style={{ fontWeight: "bold" }}>
              Modificar Estado de Ambiente por Periodo
            </h5>
          </Col>
        </Row>
      </Container>
      <Container className="ModificarEstadoDelAmbientePorPeriodo-body">
        <Row >
          <Col xs={12} lg="12" md="12">
            <Form onSubmit={formik.handleSubmit} onKeyPress={handleKeyPress}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2" className="text-center">
                  Nombre{" "}
                </Form.Label>
                <Col sm="5">
                  <Dropdown>
                    <Dropdown.Toggle
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
                <Form.Label column sm="2" className="text-center">
                  Fecha
                </Form.Label>
                <Col sm="2">
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
              <Row xs="auto" sm={5} className="justify-content-end">
                <Stack direction="horizontal" gap={2}>
                  <Button className="ModicarPorPeriodo-consultar-button" type="submit">
                    Consultar
                  </Button>
                </Stack>
              </Row>
            </Form>
            <Form.Group as={Row} className="mb-3 justify-content-center">
              <Col sm="11">
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
                        style={{ backgroundColor: "#d81a0b" }}
                      ></div>
                      <span className="text">{"Periodos reservados"}</span>
                      <div
                        className="circle"
                        style={{ backgroundColor: "#0b3f6f" }}
                      ></div>
                      <span className="text">{"Periodos Solicitados"}</span>
                    </div>
                    <div className="periodos-grid">
                      <div className="periodos">
                        <h6>Mañana</h6>
                        {[1, 2, 3, 4].map((periodo, index, array) => {
                          const esReservado = periodosReservados.some(
                            (reservado) => reservado.periodos.includes(periodo)
                          );
                          const esSolicitado = periodosSolicitados.some(
                            (solicitado) =>
                              solicitado.periodos.includes(periodo)
                          );

                          // Mostrar checkbox solo para el primer periodo reservado
                          const esPrimerPeriodoDeRangoReservado =
                            esReservado &&
                            periodosReservados.some(
                              (reservado) => periodo === reservado.periodos[0]
                            );

                          // Mostrar checkbox solo para el primer periodo solicitado
                          const esPrimerPeriodoDeRangoSolicitado =
                            esSolicitado &&
                            periodosSolicitados.some(
                              (solicitado) => periodo === solicitado.periodos[0]
                            );

                          // Mostrar checkbox solo si no es reservado o es el primer periodo reservado, y si no es solicitado o es el primer periodo solicitado
                          const mostrarCheckbox =
                            (!esReservado || esPrimerPeriodoDeRangoReservado) &&
                            (!esSolicitado || esPrimerPeriodoDeRangoSolicitado);

                          return (
                            <div key={periodo}>
                              {mostrarCheckbox ? (
                                <input
                                  type="checkbox"
                                  id={periodo.toString()}
                                  name={`periodo${periodo}`}
                                  value={`periodo${periodo}`}
                                />
                              ) : (
                                // Contenido que deseas mostrar si la condición no se cumple
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "20px",
                                  }}
                                ></span>
                              )}
                              <label
                                htmlFor={periodo.toString()}
                                className={`periodo-label ${cambiarColorLabels(
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
                          const esSolicitado = periodosSolicitados.some(
                            (solicitado) =>
                              solicitado.periodos.includes(periodo)
                          );

                          // Mostrar checkbox solo para el primer periodo reservado
                          const esPrimerPeriodoDeRangoReservado =
                            esReservado &&
                            periodosReservados.some(
                              (reservado) => periodo === reservado.periodos[0]
                            );

                          // Mostrar checkbox solo para el primer periodo solicitado
                          const esPrimerPeriodoDeRangoSolicitado =
                            esSolicitado &&
                            periodosSolicitados.some(
                              (solicitado) => periodo === solicitado.periodos[0]
                            );

                          // Mostrar checkbox solo si no es reservado o es el primer periodo reservado, y si no es solicitado o es el primer periodo solicitado
                          const mostrarCheckbox =
                            (!esReservado || esPrimerPeriodoDeRangoReservado) &&
                            (!esSolicitado || esPrimerPeriodoDeRangoSolicitado);

                          return (
                            <div key={periodo}>
                              {mostrarCheckbox ? (
                                <input
                                  type="checkbox"
                                  id={periodo.toString()}
                                  name={`periodo${periodo}`}
                                  value={`periodo${periodo}`}
                                />
                              ) : (
                                // Contenido que deseas mostrar si la condición no se cumple
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "20px",
                                  }}
                                ></span>
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
                          const esSolicitado = periodosSolicitados.some(
                            (solicitado) =>
                              solicitado.periodos.includes(periodo)
                          );

                          // Mostrar checkbox solo para el primer periodo reservado
                          const esPrimerPeriodoDeRangoReservado =
                            esReservado &&
                            periodosReservados.some(
                              (reservado) => periodo === reservado.periodos[0]
                            );

                          // Mostrar checkbox solo para el primer periodo solicitado
                          const esPrimerPeriodoDeRangoSolicitado =
                            esSolicitado &&
                            periodosSolicitados.some(
                              (solicitado) => periodo === solicitado.periodos[0]
                            );

                          // Mostrar checkbox solo si no es reservado o es el primer periodo reservado, y si no es solicitado o es el primer periodo solicitado
                          const mostrarCheckbox =
                            (!esReservado || esPrimerPeriodoDeRangoReservado) &&
                            (!esSolicitado || esPrimerPeriodoDeRangoSolicitado);

                          return (
                            <div key={periodo}>
                              {mostrarCheckbox ? (
                                <input
                                  type="checkbox"
                                  id={periodo.toString()}
                                  name={`periodo${periodo}`}
                                  value={`periodo${periodo}`}
                                />
                              ) : (
                                // Contenido que deseas mostrar si la condición no se cumple
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "20px",
                                  }}
                                ></span>
                              )}
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

                        <input
                          type="checkbox"
                          id="selectAllPeriods"
                          checked={selectAll}
                          onChange={selectAllPeriods}
                        />
                        <label
                          className="periodos-habilitados"
                          htmlFor="selectAllPeriods"
                        >
                          Seleccionar Todo
                        </label>
                      </div>
                    </div>
                    <Row xs="auto" className="justify-content-md-end">
                      <Stack direction="horizontal" gap={2}>
                        <Button
                          className="ModificarPorPeriodo-button-periodo"
                          onClick={estado}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Spinner animation="grow" size="sm" />
                              Modificando...
                            </>
                          ) : (
                            "Modificar"
                          )}
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
                ¿Está seguro de hacer esta modificación? Al hacerlo cancelará
                las reservas o solicitudes correspondientes
              </Row>
              <Row xs="auto" className="justify-content-md-end">
                <Stack direction="horizontal" gap={2}>
                  <Button
                    className="btn ModificarEstadoDelAmbientePorPeriodo-cancel"
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowMensajeDeConfirmacion(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="btn ModificarEstadoDelAmbientePorPeriodo-aceptar"
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
