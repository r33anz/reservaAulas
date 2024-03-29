import React, { useContext, useEffect, useState } from "react";
import { getBloques, getTiposDeAmbiente, getPiso, registrarAmbiente } from "../../services/Ambiente.service";
import { Container, Row, Col, Form, Button, Stack } from 'react-bootstrap';
import { CheckCircleFill, ExclamationCircleFill, XSquareFill } from 'react-bootstrap-icons';
import { useFormik } from "formik";
import * as Yup from "yup";
import './style.css';
import { AlertsContext } from "../Alert/AlertsContext";

const RegistrarAmbiente = () => {
    const [bloques, setBloques] = useState([]);
    const [tiposDeAmbiente, setTiposDeAmbiente] = useState([]);
    const [pisos, setPisos] = useState([]);
    const { agregarAlert } = useContext(AlertsContext);
    console.log(agregarAlert);

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
                .uppercase()
                .required("Required"),
            capacidad: Yup.number()
                .positive()
                .required("Required"),
            idBloque: Yup.number()
                .required("Required"),
            tipo: Yup.string()
                .required("Required"),
            piso: Yup.number()
                .required("Required"),

        }),
        onSubmit: values => {
            registrarAmbiente(values)
                .then((response) => {
                    agregarAlert({ icon: <CheckCircleFill />, severidad: "success", mensaje: "Se a registrado correctamente el ambiente" });
                    formik.resetForm();
                }).catch((error) => {
                    agregarAlert({ icon: <ExclamationCircleFill />, severidad: "danger", mensaje: error });
                });
        }
    });

    useEffect(() => {
        const bloques = getBloques();
        setBloques(bloques);
        const tiposDeAmbiente = getTiposDeAmbiente();
        setTiposDeAmbiente(tiposDeAmbiente);
        const pisos = getPiso();
        setPisos(pisos);
    }, [])

    return (<>
        <div style={{ width: "574px" }}>
            <Container className="RegistrarAmbiente-header" fluid >
                <Row xs="auto" className="justify-content-md-end">
                    <Button className="RegistrarAmbiente-header-button-close" style={{ width: "58px", height: "58px" }} >
                        <XSquareFill style={{ width: "24px", height: "24px" }} />
                    </Button>
                </Row>
            </Container>
            <Container className="RegistrarAmbiente-body" fluid>
                <Row className="justify-content-md-center">
                    <h1 style={{ fontWeight: "bold" }} className="text-center">Registrar nuevo ambiente</h1>
                    <Col xs lg="9">
                        <Form onSubmit={formik.handleSubmit}>
                            <Stack gap={2} direction="vertical">
                                <Form.Group className="mb-3" controlId="nombre">
                                    <Form.Label>Nombre del ambiente</Form.Label>
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
                                <Form.Group className="mb-3" controlId="capacidad">
                                    <Form.Label>Capacidad</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingrese un valor"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.capacidad}
                                    />
                                    <Form.Text className="text-danger">
                                        {formik.touched.capacidad && formik.errors.capacidad ? (
                                            <div className="text-danger">{formik.errors.capacidad}</div>
                                        ) : null}
                                    </Form.Text>
                                </Form.Group>
                                <Col lg="9">
                                    <Form.Group className="mb-3" controlId="idBloque">
                                        <Form.Label>Bloque</Form.Label>
                                        <Form.Select
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.idBloque}
                                        >
                                            <option value="" disabled selected>Ingrese un bloque</option>
                                            {bloques.map((bloque) => <option value={bloque.id}>{bloque.name}</option>)}
                                        </Form.Select>
                                        <Form.Text className="text-danger">
                                            {formik.touched.idBloque && formik.errors.idBloque ? (
                                                <div className="text-danger">{formik.errors.idBloque}</div>
                                            ) : null}
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="tipo">
                                        <Form.Label>Tipo de ambiente</Form.Label>
                                        <Form.Select
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.tipo}
                                        >
                                            <option value="" disabled selected>Ingrese tipo de ambiente</option>
                                            {tiposDeAmbiente.map((item) => <option value={item.name}>{item.name}</option>)}
                                        </Form.Select>
                                        <Form.Text className="text-danger">
                                            {formik.touched.tipo && formik.errors.tipo ? (
                                                <div className="text-danger">{formik.errors.tipo}</div>
                                            ) : null}
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="piso">
                                        <Form.Label>Piso</Form.Label>
                                        <Form.Select
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.piso}
                                        >
                                            <option value="" disabled selected>Ingrese un piso</option>
                                            {pisos.map((piso) => {
                                                if (piso.value === 0) {
                                                    return <option value={piso.value}>Planta Baja</option>
                                                } else {
                                                    return <option value={piso.value}>Piso {piso.value}</option>
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
    </>);
}

export default RegistrarAmbiente;