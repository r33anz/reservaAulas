import React, { useCallback, useState, useRef } from "react";
import { Button } from "react-bootstrap";
import {
  buscarAmbientePorNombre,
  modificarPerio,
  estadoinhabilitado,
  habilita,
} from "../../services/ModificarPeriodo.service";
import "./style.css";
import {
  FormControl,
  Col,
  Container,
  Dropdown,
  Form,
  Row,
  Stack,
} from "react-bootstrap";
import { XSquareFill } from "react-bootstrap-icons";
import { useFormik } from "formik";
import * as Yup from "yup";

const Modificarperdiodo = () => {
  const inputAmbienteRef = useRef();
  const [show, setShow] = useState("");
  const [periodosModificados, setPeriodosModificados] = useState([]);
  const [consultarPresionado, setConsultarPresionado] = useState(false);
  const [enterPressed, setEnterPressed] = useState(false);
  const [ambientes, setAmbientes] = useState([]);
  const [ambiente, setAmbiente] = useState({});

  const buscarAmbiente = async (event) => {
    setConsultarPresionado(false);
    if (
      event.hasOwnProperty("target") &&
      event.target.hasOwnProperty("value")
    ) {
      const value = event.target.value;
      formik.setFieldValue("ambiente", {
        ...formik.values.ambiente,
        nombre: value,
      });
      const { respuesta } = await buscarAmbientePorNombre(value);
      setAmbientes(respuesta);
    }
  };

  const buscarAmbientPorFecha = async (ambiente, fecha) => {
    const data = await modificarPerio(ambiente.id, fecha);
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
    const checkboxes = document.querySelectorAll(
      '.periodos-container input[type="checkbox"]'
    );
    const seleccionados = [];
    formik.setFieldValue("ambiente", {
      id: ambiente.id,
      nombre: ambiente.nombre,
    });
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        seleccionados.push({ id: checkbox.id });
        // Convertir checkbox.id a número
        const checkboxIdAsNumber = parseInt(checkbox.id, 10);
        // Verifica si el ID del checkbox está en periodosModificados
        if (periodosModificados.includes(checkboxIdAsNumber)) {
          otraHabilitar(checkbox.id);
        } else {
          otraFuncion(checkbox.id);
        }
      }
    });
    // Desmarcar todas las casillas de verificación
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    buscarAmbientPorFecha(formik.values.ambiente, formik.values.fecha);
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
    (periodo) => {
      const periodoModificado = periodosModificados.includes(periodo);
      return periodoModificado
        ? "periodos-inhabilitados"
        : "periodos-habilitados";
    },
    [periodosModificados]
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
          .test("hasOptions", "No exite ese ambiente", function (value) {
            // 'this.options' contiene las opciones que pasas al esquema de validación
            if (ambientes.length > 0) {
              return true;
            } else {
              return false;
            }
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
      if (enterPressed === true) {
        buscarAmbientPorFecha(values.ambiente, values.fecha);
        setEnterPressed(false);
        setAmbientes([formik.values.ambiente]);
      } else {
        buscarAmbientPorFecha(ambientes[0], values.fecha);
        formik.setFieldValue("ambiente", {
          id: ambientes[0].id,
          nombre: ambientes[0].nombre,
        });
      }
      inputAmbienteRef.current.blur();
    },
  });

  const handleKeyPress = (event) => {
    const fechaLimite = new Date().toISOString().slice(0, 10);
    if (event.key === "Enter") {
      if (
        (!formik.values.fecha || formik.values.fecha < fechaLimite) &&
        enterPressed !== true &&
        ambientes.length > 0
      ) {
        formik.setFieldValue("ambiente", {
          id: ambientes[0].id,
          nombre: ambientes[0].nombre,
        });
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
  return (
    <div style={{ width: "574px" }}>
      <Container className="ModificarEstadoDelAmbientePorFecha-header" fluid>
        <Row xs="auto" className="justify-content-md-end">
          <Col xs lg="10" style={{ alignContent: "center", padding: 0 }}>
            <h4 style={{ color: "white", fontWeight: "bold" }}>
              Modificar Estado de Ambiente por Periodo
            </h4>
          </Col>
          <Button
            className="ModificarEstadoDelAmbientePorFecha-header-button-close"
            style={{ width: "58px", height: "58px" }}
          >
            <XSquareFill style={{ width: "24px", height: "24px" }} />
          </Button>
        </Row>
      </Container>
      <Container className="ModificarEstadoDelAmbientePorFecha-body" fluid>
        <Row className="justify-content-md-center">
          <Col xs lg="9">
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
                    {formik.values.ambiente.nombre !== "" && (
                      <Dropdown.Menu
                        className={show}
                        style={{
                          width: "100%",
                          overflowY: "auto",
                          maxHeight: "5rem",
                        }}
                        show
                      >
                        {ambientes.map((ambiente) => (
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
                  <Button className="consultar-button" type="submit">
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
                    </div>
                    <div className="periodos-grid">
                      <div className="periodos">
                        <h6>Mañana</h6>
                        <div>
                          <input
                            type="checkbox"
                            id="1"
                            name="periodo1"
                            value="periodo1"
                          />
                          <label htmlFor="1" className={cambiarColorLabels(1)}>
                            6:45-8:15
                          </label>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id="2"
                            name="periodo2"
                            value="periodo2"
                          />
                          <label htmlFor="2" className={cambiarColorLabels(2)}>
                            8:15-9:45
                          </label>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id="3"
                            name="periodo3"
                            value="periodo3"
                          />
                          <label
                            htmlFor="periodo3"
                            className={cambiarColorLabels(3)}
                          >
                            9:45-11:15
                          </label>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id="4"
                            name="periodo4"
                            value="periodo4"
                          />
                          <label
                            htmlFor="periodo4"
                            className={cambiarColorLabels(4)}
                          >
                            11:15-12:45
                          </label>
                        </div>
                      </div>
                      <div className="periodos">
                        <h6>Tarde</h6>
                        <div>
                          <input
                            type="checkbox"
                            id="5"
                            name="periodo5"
                            value="periodo5"
                          />
                          <label
                            htmlFor="periodo5"
                            className={cambiarColorLabels(5)}
                          >
                            12:45-14:15
                          </label>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id="6"
                            name="periodo6"
                            value="periodo6"
                          />
                          <label
                            htmlFor="periodo6"
                            className={cambiarColorLabels(6)}
                          >
                            14:15-15:45
                          </label>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id="7"
                            name="periodo7"
                            value="periodo7"
                          />
                          <label
                            htmlFor="periodo7"
                            className={cambiarColorLabels(7)}
                          >
                            15:45-17:15
                          </label>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id="8"
                            name="periodo8"
                            value="periodo8"
                          />
                          <label
                            htmlFor="periodo8"
                            className={cambiarColorLabels(8)}
                          >
                            17:15-18:45
                          </label>
                        </div>
                      </div>
                      <div className="periodos">
                        <h6>Noche</h6>
                        <div>
                          <input
                            type="checkbox"
                            id="9"
                            name="periodo9"
                            value="periodo9"
                          />
                          <label
                            htmlFor="periodo9"
                            className={cambiarColorLabels(9)}
                          >
                            18:45-20:15
                          </label>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id="10"
                            name="periodo10"
                            value="periodo10"
                          />
                          <label
                            htmlFor="periodo10"
                            className={cambiarColorLabels(10)}
                          >
                            20:15-21:45
                          </label>
                        </div>
                      </div>
                    </div>
                    {/* Agrega más periodos aquí si es necesario */}
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
    </div>
  );
};

export default Modificarperdiodo;
