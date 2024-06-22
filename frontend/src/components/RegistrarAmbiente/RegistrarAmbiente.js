import React, { useContext, useEffect, useState } from "react";
import {
  getBloques,
  getTiposDeAmbiente,
  registrarAmbiente,
} from "../../services/Ambiente.service";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Stack,
  Spinner,
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

const RegistrarAmbiente = ({ onClose }) => {
  const [bloques, setBloques] = useState([]);
  const [tiposDeAmbiente, setTiposDeAmbiente] = useState([]);
  const [pisos, setPisos] = useState([]);
  const { agregarAlert } = useContext(AlertsContext);
  const [loading, setLoading] = useState(false);

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
      nombre: "",
      capacidad: "",
      idBloque: "",
      tipo: "",
      piso: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
        .required("Obligatorio")
        .matches(
          /^[A-Z0-9]+$/,
          "Solo letras mayusculas y numeros es permitido"
        ),
      capacidad: Yup.number()
        .positive("Debe ser mayor a 0")
        .required("Obligatorio"),
      idBloque: Yup.number().required("Obligatorio"),
      tipo: Yup.string().required("Obligatorio"),
      piso: Yup.number().required("Obligatorio"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      registrarAmbiente(values)
        .then((response) => {
          setLoading(false);
          agregarAlert({
            icon: <CheckCircleFill />,
            severidad: "success",
            mensaje: "Registro exitoso",
          });
          formik.resetForm();
        })
        .catch((error) => {
          setLoading(false);
          agregarAlert({
            icon: <ExclamationCircleFill />,
            severidad: "warning",
            mensaje: error,
          });
        });
    },
  });

  const setPisosPorBloqueSeleccionado = (e, callback) => {
    const bloqueId = e.target.value;
    const bloque = bloques.find((item) => item.id === parseInt(bloqueId));
    const bloquePisos = [];
    for (let i = 0; i < bloque.pisos; i++) {
      bloquePisos.push({ value: i });
    }
    setPisos(bloquePisos);
    callback(e);
  };

  useEffect(() => {
    const bloques = getBloques();
    setBloques(bloques);
    const tiposDeAmbiente = getTiposDeAmbiente();
    setTiposDeAmbiente(tiposDeAmbiente);
    setLoading(false);
  }, []);

  return (
    <>
      <div className="RegistrarAmbiente-container" >
        <Container fluid>
          <Row sm className="text-white RegistrarAmbiente-header">
            <Col
              xs="12"
              className="d-flex justify-content-center align-items-center"
              style={{ height: "3rem" }}
            >
              <h5 style={{ fontWeight: "bold" }} className="">
                Registrar nuevo ambiente
              </h5>
            </Col>
          </Row>
          <Row className="RegistrarAmbiente-body ">
            <Col xs>
              <Form onSubmit={formik.handleSubmit}>
                <Stack gap={2} direction="vertical">
                  <Form.Group className="form-group mb-3" controlId="nombre">
                    <Form.Label className="RegistrarAmbiente-required">
                      Nombre del ambiente
                    </Form.Label>
                    <div style={{ flex: 2 }}>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese el nuevo nombre del ambiente"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.nombre}
                      />
                      <Form.Text className="text-danger">
                        {formik.touched.nombre && formik.errors.nombre ? (
                          <div className="text-danger">
                            {formik.errors.nombre}
                          </div>
                        ) : null}
                      </Form.Text>
                    </div>
                  </Form.Group>

                  <Form.Group className="form-group mb-3 RegistrarAmbiente-entrada-numero" controlId="capacidad">
                    <Form.Label className="RegistrarAmbiente-required">
                      Capacidad
                    </Form.Label>
                    <div style={{ flex: 2 }}>
                      <Form.Control
                        type="number"
                        onKeyDown={(e) => {
                          console.log(e.key);
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
                    </div>
                  </Form.Group>

                  <Form.Group className="form-group mb-3" controlId="idBloque">
                    <Form.Label className="RegistrarAmbiente-required">
                      Bloque
                    </Form.Label>
                    <div style={{ flex: 2 }}>
                      <Form.Select
                        onChange={(e) => setPisosPorBloqueSeleccionado(e, formik.handleChange)}
                        onBlur={formik.handleBlur}
                        value={formik.values.idBloque}
                      >
                        <option value="" disabled selected>
                          Ingrese un bloque
                        </option>
                        {bloques.map((bloque) => (
                          <option key={bloque.id} value={bloque.id}>{bloque.name}</option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-danger">
                        {formik.touched.idBloque && formik.errors.idBloque ? (
                          <div className="text-danger">
                            {formik.errors.idBloque}
                          </div>
                        ) : null}
                      </Form.Text>
                    </div>
                  </Form.Group>

                  <Form.Group className="form-group mb-3" controlId="tipo">
                    <Form.Label className="RegistrarAmbiente-required">
                      Tipo de ambiente
                    </Form.Label>
                    <div style={{ flex: 2 }}>
                      <Form.Select
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.tipo}
                      >
                        <option value="" disabled selected>
                          Ingrese tipo de ambiente
                        </option>
                        {tiposDeAmbiente.map((item) => (
                          <option key={item.name} value={item.name}>{item.name}</option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-danger">
                        {formik.touched.tipo && formik.errors.tipo ? (
                          <div className="text-danger">
                            {formik.errors.tipo}
                          </div>
                        ) : null}
                      </Form.Text>
                    </div>
                  </Form.Group>

                  <Form.Group className="form-group mb-3" controlId="piso">
                    <Form.Label className="RegistrarAmbiente-required">
                      Piso
                    </Form.Label>
                    <div style={{ flex: 2 }}>
                      <Form.Select
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.piso}
                      >
                        {pisos.length > 0 ? (
                          <option value="" disabled selected>
                            Ingrese un piso
                          </option>
                        ) : (
                          <option value="" disabled selected>
                            Seleccione un bloque
                          </option>
                        )}
                        {pisos.map((piso, index) => (
                          <option key={index} value={piso.value}>
                            {piso.value === 0 ? "Sotano" : `Piso ${piso.value}`}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-danger">
                        {formik.touched.piso && formik.errors.piso ? (
                          <div className="text-danger">
                            {formik.errors.piso}
                          </div>
                        ) : null}
                      </Form.Text>
                    </div>
                  </Form.Group>

                  <Row className="justify-content-md-center">
                    <Stack gap={2} direction="horizontal">
                      
                      <Button
                        className="btn RegistrarAmbiente-button-register"
                        size="sm"
                        type="submit"
                        disabled={loading}
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
      </div>
    </>
  );
};

export default RegistrarAmbiente;
