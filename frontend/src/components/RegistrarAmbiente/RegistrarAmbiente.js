import React, { useContext, useEffect, useState } from "react";
import {
  getBloques,
  getTiposDeAmbiente,
  registrarAmbiente,
} from "../../services/Ambiente.service";
import { Container, Row, Col, Form, Button, Stack } from "react-bootstrap";
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
      registrarAmbiente(values)
        .then((response) => {
          agregarAlert({
            icon: <CheckCircleFill />,
            severidad: "success",
            mensaje: "Registro exitoso",
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
  }, []);

  return (
    <>
    <div style={{ width: "50%"}}>
      <Container fluid>
        <Row sm className="text-white RegistrarAmbiente-header">
          <Col
            xs="10"
            className="d-flex justify-content-start align-items-center"
            style={{ height: "3rem" }}
          >
            <h5 style={{ fontWeight: "bold" }} className="">
              Registrar nuevo ambiente
            </h5>
          </Col>
          <Col
            xs="2"
            className="d-flex justify-content-end align-items-end"
            style={{ padding: 0 }}
          >
            <div
              className="RegistrarAmbiente-header-button-close d-flex justify-content-center align-items-center"
              onClick={onClose}
            >
              <XSquareFill size={24} />
            </div>
          </Col>
        </Row>
        <Row className="RegistrarAmbiente-body justify-content-center">
          <Col xs>
            <Form onSubmit={formik.handleSubmit}>
              <Stack gap={2} direction="vertical">
                <Form.Group className="mb-3" controlId="nombre">
                  <Form.Label className="RegistrarAmbiente-required">
                    Nombre del ambiente
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el nuevo nombre del ambiente"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.nombre}
                  />
                  <Form.Text className="text-danger">
                    {formik.touched.nombre && formik.errors.nombre ? (
                      <div className="text-danger">{formik.errors.nombre}</div>
                    ) : null}
                  </Form.Text>
                </Form.Group>
                <Form.Group
                  className="mb-3 RegistrarAmbiente-entrada-numero"
                  controlId="capacidad"
                >
                  <Form.Label className="RegistrarAmbiente-required">
                    Capacidad
                  </Form.Label>
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
                </Form.Group>
                <Col lg="9">
                  <Form.Group className="mb-3" controlId="idBloque">
                    <Form.Label className="RegistrarAmbiente-required">
                      Bloque
                    </Form.Label>
                    <Form.Select
                      onChange={(e) =>
                        setPisosPorBloqueSeleccionado(e, formik.handleChange)
                      }
                      onBlur={formik.handleBlur}
                      value={formik.values.idBloque}
                    >
                      <option value="" disabled selected>
                        Ingrese un bloque
                      </option>
                      {bloques.map((bloque) => (
                        <option value={bloque.id}>{bloque.name}</option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-danger">
                      {formik.touched.idBloque && formik.errors.idBloque ? (
                        <div className="text-danger">
                          {formik.errors.idBloque}
                        </div>
                      ) : null}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="tipo">
                    <Form.Label className="RegistrarAmbiente-required">
                      Tipo de ambiente
                    </Form.Label>
                    <Form.Select
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.tipo}
                    >
                      <option value="" disabled selected>
                        Ingrese tipo de ambiente
                      </option>
                      {tiposDeAmbiente.map((item) => (
                        <option value={item.name}>{item.name}</option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-danger">
                      {formik.touched.tipo && formik.errors.tipo ? (
                        <div className="text-danger">{formik.errors.tipo}</div>
                      ) : null}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="piso">
                    <Form.Label className="RegistrarAmbiente-required">
                      Piso
                    </Form.Label>
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
                      {pisos.map((piso) => {
                        if (piso.value === 0) {
                          return (
                            <option value={piso.value}>Planta Baja</option>
                          );
                        } else {
                          return (
                            <option value={piso.value}>
                              Piso {piso.value}
                            </option>
                          );
                        }
                      })}
                    </Form.Select>
                    <Form.Text className="text-danger">
                      {formik.touched.piso && formik.errors.piso ? (
                        <div className="text-danger">{formik.errors.piso}</div>
                      ) : null}
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Row xs="auto" className="justify-content-md-end">
                  <Stack direction="horizontal" gap={2}>
                    <Button
                      className="btn RegistrarAmbiente-button-cancel"
                      size="sm"
                      onClick={() => {
                        formik.resetForm();
                        onClose();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="btn RegistrarAmbiente-button-register"
                      size="sm"
                      type="submit"
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

export default RegistrarAmbiente;
