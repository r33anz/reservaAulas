import React, { useContext, useEffect, useState, useRef } from "react";
import {
  getBloques,
  getGruposPorBloque,
  getReserva,
  getDocente,
  razon,
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
  const [
    ida,
    setidambiente,
  ] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [docentes, setDocente] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const { agregarAlert } = useContext(AlertsContext);
  const [nombreAmbiente, setNombreAmbiente] = useState(""); // Estado para almacenar el nombre del ambiente
  const [ambienteOptions, setAmbienteOptions] = useState([]); // Estado para almacenar las opciones de ambiente
  const [periodos, setPeriodos] = useState([
    { id: 1, hora: "6:45"},
    { id: 2, hora: "8:15"},
    { id: 3, hora: "9:45" },
    { id: 4, hora: "11:15" },
    { id: 5, hora: "12:45"},
    { id: 6, hora: "14:15" },
    { id: 7, hora: "15:45" },
    { id: 8, hora: "17:15"},
    { id: 9, hora: "18:45"},
    { id: 10, hora: "20:15"},
  ]);
  const [periodos1, setPeriodos1] = useState([
    { id: 1, hora: "8:15"},
    { id: 2, hora: "9:45"},
    { id: 3, hora: "11:15"},
    { id: 4, hora: "12:45"},
    { id: 5, hora: "14:15"},
    { id: 6, hora: "15:45"},
    { id: 7, hora: "17:15"},
    { id: 8, hora: "18:45"},
    { id: 9, hora: "20:15"},
    { id: 10, hora: "21:45"},
  ]);
  const[razon,setRazon]=useState([
    { id: 1, name: "Primer Parcial"},
        { id: 2, name: "Segundo Parcial"},
        { id: 3, name: "Examen Final"},
        { id: 4, name: "Segunda Instancia"},
        { id: 5, name: "Examen de mesa"},
        { id: 6, name: "Otro "},
  ]);
  const [periodosFin, setPeriodosFin] = useState(periodos1);

  // (FIX:Marco) 'id' is assigned a value but never used
  // eslint-disable-next-line

  // (FIX:Marco) 'nombre' is assigned a value but never used
  // eslint-disable-next-line
  // Función para buscar los ambientes que coinciden con el nombre
 
  const buscarAmbiente = async (event) => {
    if (event.hasOwnProperty('target') && event.target.hasOwnProperty('value')) {
      const value = event.target.value.toUpperCase();
      
      formik.setFieldValue("nombreAmbiente", value); // Actualiza el estado directamente con el nombre
      const { respuesta } = await buscarAmbientePorNombre(value);
      setAmbienteOptions(respuesta);

      const ambienteEncontrado = respuesta.find(ambiente => ambiente.nombre === value);
    if (ambienteEncontrado) {
      // Si se encontró el ambiente, enviarlo a setNombreDelAmbiente
      setNombreDelAmbiente(ambienteEncontrado);
    } else {
      setCapacidadDelAmbienteSeleccionado(null);
      console.log("No existe el ambiente");
    }
    }
  };
 
  const docente = (nombre) => {

    getDocente(nombre)
        .then((data) => {
          setDocente(data.nombre);
          console.log(docentes); // Actualizar las opciones de ambiente con los datos obtenidos
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
  ];
  const formik = useFormik({
    initialValues: {
      razon: "",
      capacidad: "",
      materia: "",
      nombreAmbiente: "",
      grupo: "", // Nuevo campo para el grupo
      fechaReserva: "",
      periodoInicio:"",
      periodoFin:"",
    },
    validationSchema: Yup.object({

      nombreAmbiente: Yup.string() // Validar como cadena en lugar de objeto
      .test('existe-ambiente', 'No existe el ambiente', function (value) {
        const ambientes = ambienteOptions.map(ambiente => ambiente.nombre);
        // Verificar si el valor ingresado está presente en la lista de nombres de ambientes
        return ambientes.includes(value);
      })
      .required("Obligatorio"),
      razon: Yup.string().required("Obligatorio"),
      periodoInicio: Yup.string().required("Obligatorio"),
      periodoFin: Yup.string().required("Obligatorio"),
      capacidad: Yup.number()
        .positive("Debe ser mayor a 0")
        .required("Obligatorio")
        .max(capacidadDelAmbienteSeleccionado, "No puede ser mayor que otro número"),
      materia: Yup.string().required("Obligatorio"),
      grupo: Yup.string().required("Obligatorio"),
      fechaReserva: Yup.date()
            .min(new Date(new Date().setDate(new Date().getDate() - 1)), 'La fecha no puede ser anterior a la fecha actual')
            .test('is-not-sunday', 'No puedes reservar para un domingo', function (value) {
                // Verificar si la fecha seleccionada es un domingo (domingo = 0)
                return value.getDay() !== 0;
            })
            .required('Obligatorio')
    }),
    onSubmit: (values) => {
      
      const id = window.localStorage.getItem("docente_id");
      const periodoInicioID = parseInt(values.periodoInicio, 10);
  const periodoFinID = parseInt(values.periodoFin, 10);

  // Combinar los IDs de periodoInicio y periodoFin en un solo array
  const periodoIDs = [periodoInicioID, periodoFinID];

// Asignar la lista de IDs a values.periodos
values.periodos = periodoIDs;
      values.ambiente=ida;
      values.idDocente = id;
console.log(periodoIDs);
        getReserva(values)
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


  const handleKeyPress = (event) => {
    
    if (event.code === "Enter") {
       
        setNombreDelAmbiente(ambienteOptions[0]);
        
    }
    
  };
  const setPisosPorBloqueSeleccionado = (e) => {
    // Obtener y establecer los grupos asociados con el bloque seleccionado
    const gruposAsociados = getGruposPorBloque(e.target.value);
    setGrupos(gruposAsociados);
    //setGrupos(Array.isArray(gruposAsociados) ? gruposAsociados : []);
    // Resetear el valor del grupo seleccionado
    formik.setFieldValue("grupo", "");
  };

  const setNombreDelAmbiente = (ambiente) => {

    formik.setFieldValue("nombreAmbiente", ambiente.nombre); // Asigna el nombre directamente
    
    setidambiente(ambiente.id);
    console.log(ida);
    setShow("");
    recuperarAmbientePorID(ambiente.id)
      .then((data) => {
        // Actualizar estado con los detalles del ambiente
        setCapacidadDelAmbienteSeleccionado(data.capacidad);
        console.log(data.capacidad);
        
      })
      .catch((error) => {
        console.log("Error al buscar el ambiente:", error);
      });
  };
  

  useEffect(() => {
    console.log(razon);
    const id = window.localStorage.getItem("docente_id");
    const bloquesData = getBloques(id);
    docente(id);
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
              Registrar Solicitud de Reserva
            </h1>
            <Col xs lg="9">
              <Form onSubmit={formik.handleSubmit} onKeyPress={handleKeyPress}>
                <Stack gap={2} direction="vertical">
                  <Col lg="9">
                  <p>Docente: {docentes}</p>
                  <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="fechaReserva"
                    >
                      <Form.Label >
                        Fecha Reserva
                      </Form.Label>
                      <Col >
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
                            onChange={buscarAmbiente}
                            onBlur={formik.handleBlur}
                            value={formik.values.nombreAmbiente}
                            className="form-control"
                            bsPrefix="dropdown-toggle"
                          />
                          {formik.values.nombreAmbiente !== "" && (
                            <Dropdown.Menu
                              className={show}
                              style={{width: "100%",overflowY: "auto",maxHeight: "5rem", }}
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
                    {capacidadDelAmbienteSeleccionado !== null && (
                      <p>
                        Capacidad:{capacidadDelAmbienteSeleccionado}
                       
                      </p>
                    )}

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
                      <Form.Label>Razon</Form.Label>
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
                          <div className="text-danger">
                            {formik.errors.razon}
                          </div>
                        ) : null}
                      </Form.Text>
                    </Form.Group>
                    
                    <div className="periodos-columna">
                    <Form.Group className="mb-3" controlId="periodoInicio">
                      <Form.Label >Periodo Inicio</Form.Label>
                      <Form.Select
                      
                         onChange={(e) => {
                           formik.handleChange(e);
                           // Filtrar los periodos fin basado en el periodo inicio seleccionado
                           const selectedPeriodoInicio = parseInt(e.target.value, 10);
                           const filteredPeriodos1 = periodos1.filter(item => item.id >= selectedPeriodoInicio);
                           // Actualizar los periodos fin disponibles
                           setPeriodosFin(filteredPeriodos1);
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
                                            {formik.touched.periodoInicio && formik.errors.periodoInicio ? (
                                              <div className="text-danger">
                                                {formik.errors.periodoInicio}
                                              </div>
                                            ) : null}
                                          </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="periodoFin">
                          <Form.Label>Periodo Fin</Form.Label>
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
                                                {formik.touched.periodoFin && formik.errors.periodoFin ? (
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
                        onClick={() => formik.resetForm()}
                        
                      >
                        Cancelar
                      </Button>
                      <Button
  className="btn RegistrarAmbiente-button-register"
  size="sm"
  type="submit"
  disabled={!formik.isValid || !formik.dirty}
  onClick={() => {
    setCapacidadDelAmbienteSeleccionado(null);
    formik.handleSubmit(); // Esto envía el formulario
  }}
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