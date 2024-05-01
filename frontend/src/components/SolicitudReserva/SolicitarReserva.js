import React, { useContext, useEffect, useState, useRef } from "react";
import {
  getBloques,
  getGruposPorBloque,
  getReserva,
  getDocente,
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
const periodosIncluidos = [];
const SolcitarReserva = () => {
  const inputAmbienteRef = useRef();
  const [show, setShow] = useState("");
  const [
    capacidadDelAmbienteSeleccionado,
    setCapacidadDelAmbienteSeleccionado,
  ] = useState(0);
  const [
    ida,
    setidambiente,
  ] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [perio, setPerio] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const { agregarAlert } = useContext(AlertsContext);
  const [nombreAmbiente, setNombreAmbiente] = useState(""); // Estado para almacenar el nombre del ambiente
  const [ambienteOptions, setAmbienteOptions] = useState([]); // Estado para almacenar las opciones de ambiente
  const [docentes, setDocente] = useState([]); // Estado para almacenar las opciones de ambiente
  const [periodos, setPeriodos] = useState([
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
  ]);

  // (FIX:Marco) 'id' is assigned a value but never used
  // eslint-disable-next-line



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
  // (FIX:Marco) 'nombre' is assigned a value but never used
  // eslint-disable-next-line
  // Función para buscar los ambientes que coinciden con el nombre
  const buscarAmbiente = (nombre) => {
    if (nombre.trim() !== "") {
      buscarAmbientePorNombre(nombre)
        .then((data) => {
          console.log(docentes);
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
    console.log(index);
    console.log(check);
    
    setPeriodos(prevPeriodos => {
      const updatedPeriodos = [...prevPeriodos];
      updatedPeriodos[index] = { ...updatedPeriodos[index], isCheck: check };
      
      return updatedPeriodos;
    });
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
        .required("Obligatorio")
        .max(capacidadDelAmbienteSeleccionado, "No puede ser mayor que otro número"),
      materia: Yup.string().required("Obligatorio"),
      grupo: Yup.string().required("Obligatorio"),
    }),
    onSubmit: (values) => {
      const periodo = window.localStorage.getItem("periodo");
      const arregloPeriodo = periodo.split(",").map(numero => parseInt(numero.trim(), 10));
      //const periodosSeleccionados = periodos.filter((item) => item.isCheck);
      
      const id = window.localStorage.getItem("docente_id");
      //const listaIDs = periodosSeleccionados.map(item => item.id);
      values.nombreAmbiente=ida;
// Asignar la lista de IDs a values.periodos
values.periodos = arregloPeriodo;

      values.idDocente = id;
        getReserva(values)
        .then((response) => {
          agregarAlert({
            icon: <CheckCircleFill />,
            severidad: "sssuccess",
            mensaje: "Se a registrado correctamente el ambiente",
            
          });
          formik.resetForm();
          //console.log("sasasassa");
          //setCapacidadDelAmbienteSeleccionado(0);
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
    
    recuperarAmbientePorID(ambiente)
    
      .then((data) => {
        // Actualizar estado con los detalles del ambiente
        setidambiente(data.nombre);
        
        setCapacidadDelAmbienteSeleccionado(data.capacidad);
       
      })
      .catch((error) => {
        console.log("Error al buscar el ambiente:", error);
      });
  };

  useEffect(() => {
    const id = window.localStorage.getItem("docente_id");
    const idAula = window.localStorage.getItem("aula_id");
    const fecha = window.localStorage.getItem("fecha");
    const bloquesData = getBloques(id);
    formik.values.fechaReserva=fecha;
    formik.setFieldValue("ambiente", idAula);
    const periodo = window.localStorage.getItem("periodo");
      const arregloPeriodo = periodo.split(",").map(numero => parseInt(numero.trim(), 10));
    arregloPeriodo.forEach(numero => {
      const periodoIncluido = periodos.find(periodo => periodo.id === numero);
      if (periodoIncluido) {
        periodosIncluidos.push(periodoIncluido.hora);
      }
    });
    console.log("Periodos incluidos:", periodosIncluidos);
    setBloques(bloquesData);
    docente(id);
    setNombreDelAmbiente(idAula);
    
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
              Registrar solicitud de reserva
            </h1>
            <Col xs lg="9">
              <Form onSubmit={formik.handleSubmit}>
                <Stack gap={2} direction="vertical">
                  <Col lg="9">
                  <p>Docente: {docentes}</p>
                  <p>Aula: {ida}</p>
                  <p>Fecha: {formik.values.fechaReserva}</p>
                  <p>Periodos:</p>
                  <ul>
      {periodosIncluidos
        .filter((periodo, index) => periodosIncluidos.indexOf(periodo) === index) // Filtrar elementos únicos
        .map((periodo, index) => (
          <li key={index}>{periodo}</li>
        ))}
    </ul>
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
                    {capacidadDelAmbienteSeleccionado !== null && (
                      <p>Capacidad: {capacidadDelAmbienteSeleccionado}</p>            
                    )}
                    

                  </Col>
                  <Row xs="auto" className="justify-content-md-end">
                    <Stack direction="horizontal" gap={2}>
                      <Button
                        className="btn RegistrarAmbiente-button-cancel"
                        size="sm"
                        onClick={() => formik.resetForm()}
                      >
                        Limpiar
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
