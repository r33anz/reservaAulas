import React, { useContext, useEffect, useState, useRef } from "react";
import {
  postReserva,
  postReserva2,
  getDocente,
  busquedaCantidad,
} from "../../services/SolicitarReserva.service";

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
  const [ambienteOptions, setAmbienteOptions] = useState([]); // Estado para almacenar las opciones de ambiente
  const [loading, setLoading] = useState(false);
  const [habilitado, sethabilitado] = useState(false);
  const [ambienteDetails, setAmbienteDetails] = useState([]);
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
  const [estado, setEstado] = useState("");
  const [showMensajeDeConfirmacion, setShowMensajeDeConfirmacion] =
    useState(false);

  // Función para buscar los ambientes que coinciden con el nombre
  
  const buscar = async () => {
    const { fechaReserva, capacidad, periodoInicio, periodoFin } = formik.values;
    const periodoInicioID = parseInt(periodoInicio, 10);
      const periodoFinID = parseInt(periodoFin, 10);
      const periodoIDs = [periodoInicioID, periodoFinID];
    const data = {
      fecha: fechaReserva,
      cantidad: capacidad,
      periodos: periodoIDs,
    };
    sethabilitado(true);
    const respuesta = await busquedaCantidad(data);
    setAmbienteOptions(respuesta);
    console.log(respuesta);
    
  };
  const vacio=()=>{
    sethabilitado(false);
    setAmbienteDetails([]);
    setShowDropdown(false);
    formik.setFieldValue("nombreAmbiente",  "");
  }
  const docente = (nombre) => {
    getDocente(nombre)
      .then((data) => {
        setDocente(data.nombre);
        const materiasNombres = Object.keys(data.materias);
        setBloques(materiasNombres);

        setMateriasData(data.materias);
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
      grupos: "", // Nuevo campo para el grupos
      fechaReserva: "",
      periodoInicio: "",
      periodoFin: "",
    },
    validationSchema: Yup.object({
      nombreAmbiente: Yup.string().required("Obligatorio"),
      razon: Yup.string().required("Obligatorio"),
      periodoInicio: Yup.string().required("Obligatorio"),
      periodoFin: Yup.string().required("Obligatorio"),
      capacidad: Yup.number()
        .positive("Debe ser mayor a 0")
        .required("Obligatorio"),
      materia: Yup.string().required("Obligatorio"),
      grupos: Yup.string().required("Obligatorio"),
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
      console.log("aaaaaaaa");
      const id = parseInt(window.sessionStorage.getItem("docente_id"),10);
      const periodoInicioID = parseInt(values.periodoInicio, 10);
      const periodoFinID = parseInt(values.periodoFin, 10);

      // Combinar los IDs de periodoInicio y periodoFin en un solo array
      const periodoIDs = [periodoInicioID, periodoFinID];
      const grupoID = parseInt(values.grupos, 10);
      values.grupo = [grupoID];
      // Asignar la lista de IDs a values.periodos
      values.periodos = periodoIDs;
      values.ambiente = ida;
      values.idDocente = id;
      console.log(values);
      //setLoading(true);
      postReserva(values)
        .then((response) => {
          console.log(response.mensaje);
          if (response.mensaje === "Registro exitoso") {
            console.log("Registro exitoso");
            agregarAlert({
              icon: <CheckCircleFill />,
              severidad: "success",
              mensaje: "Se realizo la solicitud correctamente",
            });
            formik.resetForm();
            
            setLoading(false);
          /*} else if (response[0].alerta === "advertencia") {
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
            setLoading(false);*/
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

    formik.setFieldValue("grupos", ""); // Limpiar el campo grupos en el formulario, si estás usando Formik
  };

  const setNombreDelAmbiente = async (ambiente) => {
    formik.setFieldValue("nombreAmbiente", ambiente.nombre); // Asigna el nombre directamente
    setAmbienteDetails(ambiente.option);
    console.log(ambienteDetails);
    setidambiente(ambiente.ids);
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
    
  }, []);
  const combinedAmbienteDetails = ambienteOptions.map(option => {
    
    const nombre = option.map(ambiente => ambiente.nombre).join(' y ');
    const ids = option.map(ambiente => ambiente.id);
    return { nombre, ids ,option};
  });
  const renderFirstStep = () => (
    <div style={{ display: 'flex' }}>
    <div style={{ width: '45%' }}>
      <Container className="RegistrarAmbiente-header1" fluid>
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
      <Container className="RegistrarSolicitud-body" fluid>
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
                        onChange={(e) => {
                          formik.handleChange(e);
                          vacio();
                        }}
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
                  <Form.Group className="mb-3" controlId="grupos">
                    <Form.Label className="RegistrarSolicitud-required">
                      Grupo
                    </Form.Label>
                    <Form.Select
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.grupos}
                      disabled={!formik.values.materia} // Deshabilitar si no se ha seleccionado una materia
                    >
                      <option value="" disabled selected>
                        Seleccione un grupos
                      </option>
                      {grupos.map((grupos) => (
                        <option key={grupos} value={grupos}>
                          {grupos}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-danger">
                      {formik.touched.grupos && formik.errors.grupos ? (
                        <div className="text-danger">{formik.errors.grupos}</div>
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
                      onChange={(e) => {
                        formik.handleChange(e);
                        vacio();
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.capacidad}
                      //disabled={!formik.values.nombreAmbiente}
                    />
                    <Form.Text className="text-danger">
                        <div className="text-danger">
                          {formik.errors.capacidad}
                        </div>
                      
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
                          vacio();
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
                        onChange={(e) => {
                          formik.handleChange(e);
                          vacio();
                        }}
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
              </Stack>
            </Form>
            <Stack
              gap={2}
              direction="horizontal"
              className="justify-content-end"
            >
              <Button
                className="btn RegistrarAmbiente-button-cancel"
                style={{background:"#003F70", borderColor:"#003F70",color: "white"}}
                size="sm"
                disabled={!(formik.values.fechaReserva && formik.values.capacidad && formik.values.periodoInicio && formik.values.periodoFin)} 
                onClick={buscar}
              >
                Buscar
              </Button>
            </Stack>
          </Col>
        </Row>
      </Container>
      </div>
    <div style={{ width: '45%' ,marginLeft:"5%"}}>
      <Container className="RegistrarAmbiente-header1" fluid>
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
      <Container className="RegistrarSolicitud-body" fluid>
        <Row className="justify-content-md-center">
          <Col xs lg="11">
          <Form onSubmit={formik.handleSubmit} onKeyPress={handleKeyPress}>
  <Stack gap={2} direction="vertical">
    <Col lg="12">
    <Form.Group as={Row} className="mb-3" controlId="nombreAmbiente">
            <Form.Label className="RegistrarSolicitud-required">
              Nombre del Ambiente
            </Form.Label>
            <Col>
            <Dropdown
      show={showDropdown}
      onToggle={() => setShowDropdown(!showDropdown)}
    >
      <Dropdown.Toggle
        className="fixed-width-dropdown"
        disabled={!habilitado}
        style={{
          maxWidth: '400px', // Ajusta este valor según el ancho deseado
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          backgroundColor:"white",
          color:"black"
        }}
      >
        {formik.values.nombreAmbiente || 'Seleccione el nombre del ambiente'}
      </Dropdown.Toggle>
      <Dropdown.Menu className="fixed-width-menu">
  {combinedAmbienteDetails.map((combined, index) => (
    <Dropdown.Item
      key={combined.nombre}
      onClick={() => setNombreDelAmbiente(combined)}
      className="fixed-width-item"
    >
      {combined.nombre}
    </Dropdown.Item>
  ))}
</Dropdown.Menu>
    </Dropdown>
              <Form.Text className="text-danger">
                {formik.touched.nombreAmbiente && formik.errors.nombreAmbiente ? (
                  <div className="text-danger">{formik.errors.nombreAmbiente}</div>
                ) : null}
              </Form.Text>
            </Col>
          </Form.Group>
    </Col>
    <Row xs="auto" className="justify-content-md-end">
      <Stack direction="horizontal" gap={2}>
        <Button
          className="btn RegistrarAmbiente-button-cancel"
          size="sm"
          onClick={() => {
            setCapacidadDelAmbienteSeleccionado(null);
            formik.resetForm();
            vacio();
          }}
          disabled={loading}
        >
          Limpiar
        </Button>
        <Button
          className="btn RegistrarAmbiente-button-cancel" 
          style={{background:"#003F70",borderColor:"#003F70",color: "white"}}
          size="sm"
          type="submit"
          disabled={
            loading || // Deshabilitar durante carga
            !formik.isValid || // Deshabilitar si el formulario no es válido
            !formik.dirty || // Deshabilitar si el formulario no ha sido modificado
            !formik.values.nombreAmbiente || // Asegúrate de que todos los campos requeridos estén llenos
            !formik.values.fechaReserva ||
            !formik.values.capacidad ||
            !formik.values.periodoInicio ||
            !formik.values.periodoFin
          }
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
    <div style={{ maxHeight: "400px", overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "transparent" }}>
  <Row className="g-0">
    {ambienteDetails.length > 0 &&
      ambienteDetails.map((ambiente, index) => (
        <Col key={index} style={{ height: "200px", marginLeft: "40px", width: "300px" }}>
          <div className="datos3" style={{ border: "1px solid #ccc", padding: "10px" }}>
            <h6>{ambiente.nombre}</h6>
            <p>Capacidad: {ambiente.capacidad}</p>
            <p>Tipo de Ambiente: {ambiente.tipo}</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ marginRight: "10px" }}>Bloque: {ambiente.nombreBloque}</p>
              <p style={{ marginLeft: "10px" }}>Piso: {ambiente.nroPiso}</p>
            </div>
          </div>
        </Col>
      ))}
  </Row>
</div>

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
    </div>
  );

  return <>{renderFirstStep()}</>;
};

export default SolicitarReserva;
