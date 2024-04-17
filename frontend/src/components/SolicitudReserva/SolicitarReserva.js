import React, { useContext, useEffect, useState, useRef } from "react";
import {
  getBloques,
  getGruposPorBloque,
  getReserva,
} from "../../services/SolicitarReserva.service";
import {
  buscarAmbientePorNombre,
  recuperarAmbientePorID,
} from "../../services/Busqueda.service";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Stack,
  Dropdown,
  FormControl,
} from "react-bootstrap";
import {
  CheckCircleFill,
  ExclamationCircleFill,
  XSquareFill,
} from "react-bootstrap-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./style.css";
import { AlertsContext } from "../Alert/AlertsContext";

const SolcitarReserva = () => {
  const inputAmbienteRef = useRef();
  const [show, setShow] = useState("");
  const [
    capacidadDelAmbienteSeleccionado,
    setCapacidadDelAmbienteSeleccionado,
  ] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const { agregarAlert } = useContext(AlertsContext);
  const [nombreAmbiente, setNombreAmbiente] = useState(""); // Estado para almacenar el nombre del ambiente
  const [ambienteOptions, setAmbienteOptions] = useState([]); // Estado para almacenar las opciones de ambiente
  let periodos = [
    { id: 1, hora: "6:45 - 8:15", isCheck: false },
    { id: 2, hora: "8:15 - 9:45", isCheck: false },
    { id: 3, hora: "9:45 - 11:15", isCheck: false },
    { id: 4, hora: "11:15 - 12:45", isCheck: false },
    { id: 5, hora: "12:45 - 14:15", isCheck: false },
    { id: 6, hora: "14:15 - 15:45", isCheck: false },
    { id: 7, hora: "15:45 - 17:15", isCheck: false },
    { id: 8, hora: "17:15 - 18:45", isCheck: false },
    { id: 9, hora: "18:45 - 20:15", isCheck: false },
    { id: 10, hora: "20:15 - 21:45", isCheck: false },
  ];

  // (FIX:Marco) 'id' is assigned a value but never used
  // eslint-disable-next-line

  // (FIX:Marco) 'nombre' is assigned a value but never used
  // eslint-disable-next-line
  // Función para buscar los ambientes que coinciden con el nombre
  const buscarAmbiente = (nombre) => {
    if (nombre.trim() !== "") {
      buscarAmbientePorNombre(nombre)
        .then((data) => {
          setAmbienteOptions(data.respuesta); // Actualizar las opciones de ambiente con los datos obtenidos
        })
        .catch((error) => {
          console.log("Error al buscar los ambientes:", error);
          setAmbienteOptions([]); // Limpiar las opciones de ambiente en caso de error
        });
    } else {
      // Si el input está vacío, limpiar las opciones de ambiente
      setAmbienteOptions([]);
    }
  };

  // Función para manejar el cambio en el campo de entrada
  const handleInputChange = (e) => {
    console.log(nombreAmbiente.length);
    const newValue = e.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(newValue)) {
      setNombreAmbiente(newValue);
      formik.setFieldValue("nombreAmbiente", newValue);
      buscarAmbiente(newValue);
    }
  };

  // Función para hacer scroll al elemento seleccionado

  useEffect(() => {
    function handleClickOutside() {
      setAmbienteOptions([]); // Limpiar las opciones de ambiente al hacer clic fuera del campo
    }

    // Agregar un event listener para hacer clic fuera del campo de entrada
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClick = (e, check, index) => {
    periodos[index].isCheck = check;
    console.log(periodos);
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
  ];
  const formik = useFormik({
    initialValues: {
      razon: "",
      capacidad: "",
      materia: "",
      nombreAmbiente: "",
      grupo: "", // Nuevo campo para el grupo
      fechaReserva: "",
    },
    validationSchema: Yup.object({
      razon: Yup.string().required("Obligatorio"),
      capacidad: Yup.number()
        .positive("Debe ser mayor a 0")
        .required("Obligatorio"),
      materia: Yup.string().required("Obligatorio"),
      grupo: Yup.string().required("Obligatorio"),
    }),
    onSubmit: (values) => {
      const periodosSeleccionados = periodos.filter((item) => item.isCheck);
      console
        .log("periodosSeleccionados", periodos)
        //getReserva(values)
        .then((response) => {
          agregarAlert({
            icon: <CheckCircleFill />,
            severidad: "success",
            mensaje: "Se a registrado correctamente el ambiente",
          });
          formik.resetForm();
        })
        .catch((error) => {
          agregarAlert({
            icon: <ExclamationCircleFill />,
            severidad: "danger",
            mensaje: error,
          });
        });
    },
  });

  const setPisosPorBloqueSeleccionado = (e) => {
    // Obtener y establecer los grupos asociados con el bloque seleccionado
    const gruposAsociados = getGruposPorBloque(e.target.value);
    setGrupos(gruposAsociados);

    //setGrupos(Array.isArray(gruposAsociados) ? gruposAsociados : []);

    // Resetear el valor del grupo seleccionado
    formik.setFieldValue("grupo", "");
  };

  const setNombreDelAmbiente = (ambiente) => {
    formik.setFieldValue("ambiente", ambiente.id);
    formik.setFieldValue("nombreAmbiente", ambiente.nombre);
    setShow("");
    recuperarAmbientePorID(ambiente.id)
      .then((data) => {
        // Actualizar estado con los detalles del ambiente
        setCapacidadDelAmbienteSeleccionado(data.capacidad);
      })
      .catch((error) => {
        console.log("Error al buscar el ambiente:", error);
      });
  };

  useEffect(() => {
    const id = window.localStorage.getItem("docente_id");
    const bloquesData = getBloques(id);
    setBloques(bloquesData);
  }, []);

  return (
    <>
      <div style={{ width: "574px" }}>
        <Container className="RegistrarAmbiente-header" fluid>
          <Row xs="auto" className="justify-content-md-end">
            <Button
              className="RegistrarAmbiente-header-button-close"
              style={{ width: "58px", height: "58px" }}
            >
              <XSquareFill style={{ width: "24px", height: "24px" }} />
            </Button>
          </Row>
        </Container>
        <Container className="RegistrarAmbiente-body" fluid>
          <Row className="justify-content-md-center">
            <h1 style={{ fontWeight: "bold" }} className="text-center">
              Registrar nuevo ambiente
            </h1>
            <Col xs lg="9">
              <Form onSubmit={formik.handleSubmit}>
                <Stack gap={2} direction="vertical">
                  <Col lg="9">
                    <Form.Group className="mb-3" controlId="materia">
                      <Form.Label>Materia</Form.Label>
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
                        {bloques.map((bloque) => (
                          <option key={bloque.id} value={bloque.name}>
                            {bloque.name}
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
                      <Form.Label>Grupo</Form.Label>
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
                          <div className="text-danger">
                            {formik.errors.grupo}
                          </div>
                        ) : null}
                      </Form.Text>
                    </Form.Group>
                    <Form.Group
                      className="mb-3 RegistrarAmbiente-entrada-numero"
                      controlId="capacidad"
                    >
                      <Form.Label>Capacidad</Form.Label>
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
                      <Form.Label>Razon</Form.Label>
                      <Form.Control
                        as="textarea" // Cambia el tipo a "textarea"
                        placeholder="Ingrese la razon de uso"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.razon}
                      />
                      <Form.Text className="text-danger">
                        {formik.touched.razon && formik.errors.razon ? (
                          <div className="text-danger">
                            {formik.errors.razon}
                          </div>
                        ) : null}
                      </Form.Text>
                    </Form.Group>

                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="nombreAmbiente"
                    >
                      <Form.Label>Nombre del Ambiente</Form.Label>
                      <Col>
                        <Dropdown id="nombreAmbientes">
                          <Dropdown.Toggle
                            ref={inputAmbienteRef}
                            as={"input"}
                            id="nombreAmbiente"
                            type="text"
                            placeholder="Ingrese el nombre del ambiente"
                            onChange={handleInputChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.nombreAmbiente}
                            className="form-control"
                            bsPrefix="dropdown-toggle"
                          />
                          {formik.values.nombreAmbiente !== "" && (
                            <Dropdown.Menu
                              className={show}
                              style={{
                                width: "100%",
                                overflowY: "auto",
                                maxHeight: "5rem",
                              }}
                              show
                            >
                              {ambienteOptions.map((ambiente) => (
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
                          {formik.touched.nombreAmbiente &&
                          formik.errors.nombreAmbiente ? (
                            <div className="text-danger">
                              {formik.errors.nombreAmbiente}
                            </div>
                          ) : null}
                        </Form.Text>
                      </Col>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="fechaReserva"
                    >
                      <Form.Label column sm="3">
                        Fecha Reserva
                      </Form.Label>
                      <Col sm="9">
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
                    {capacidadDelAmbienteSeleccionado !== null && (
                      <p>
                        Este ambiente tiene una capacidad maxima de{" "}
                        {capacidadDelAmbienteSeleccionado}
                      </p>
                    )}
                    <h1>Periodos:</h1>
                    {periodos.map((item, index) => (
                      <div key={index}>
                        {item.isCheck ? <input
                          type="checkbox"
                          onClick={() => handleClick(this, true, index)}
                          defaultChecked="true"
                          checked
                        />:
                        <input
                          type="checkbox"
                          onClick={() => handleClick(this, false, index)}
                        />}
                        <label>{item.hora}</label>
                      </div>
                    ))}
                  </Col>
                  <Row xs="auto" className="justify-content-md-end">
                    <Stack direction="horizontal" gap={2}>
                      <Button
                        className="btn RegistrarAmbiente-button-cancel"
                        size="sm"
                        onClick={() => formik.resetForm()}
                      >
                        Cancelar
                      </Button>
                      <Button
                        className="btn RegistrarAmbiente-button-register"
                        size="sm"
                        type="submit"
                        disabled={!formik.isValid || !formik.dirty}
                      >
                        Registrar
                      </Button>
                    </Stack>
                  </Row>
                </Stack>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default SolcitarReserva;
