import React, { useContext, useState } from "react";
import { Button, Col, Container, Form, FormControl, Row, Stack } from "react-bootstrap";
import { QuestionCircleFill, XSquareFill } from "react-bootstrap-icons";
import { AlertsContext } from "../../Alert/AlertsContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./style.css"

const ModificarEstadoDelAmbientePorFecha = () => {
    const [ambiente, setAmbiente] = useState({});
    const { agregarAlert } = useContext(AlertsContext);

    const formik = useFormik({
        initialValues: {
            nombre: "",
            fecha: "",
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required("Obligatorio")
                .matches(/^[A-Z0-9]+$/, "Solo letras mayusculas y numeros es permitido"),
            fecha: Yup.date()
                .required("Obligatorio")
                .min(new Date(new Date().setDate(new Date().getDate() - 1)), "No se admiten fechas pasadas al dia actual"),
        }),
        onSubmit: values => {
            buscarAmbientePorNombre(values.nombre, values.fecha);
        }
    });

    const handleOnClickLimpiar = () => {
        setAmbiente({});
        formik.resetForm();
    }

    const buscarAmbientePorNombre = (nombre, fecha) => {
        setAmbiente({
            id: 1, nombre, fecha, periodos: [
                { id: 1, hora: '6:45 - 8:15', isHabilitado: true },
                { id: 2, hora: '8:15 - 9:45', isHabilitado: true },
                { id: 3, hora: '9:45 - 11:15', isHabilitado: true },
                { id: 4, hora: '11:15 - 12:45', isHabilitado: true },
                { id: 5, hora: '12:45 - 14:15', isHabilitado: true },
                { id: 6, hora: '14:15 - 15:45', isHabilitado: true },
                { id: 7, hora: '15:45 - 17:15', isHabilitado: false },
                { id: 8, hora: '17:15 - 18:45', isHabilitado: false },
                { id: 9, hora: '18:45 - 20:15', isHabilitado: false },
                { id: 10, hora: '20:15 - 21:45', isHabilitado: false },
            ]
        })
    }

    const modificarPeriodos = (estado) => {
        const periodosActualizados = ambiente.periodos.map((periodo) => {
            if (estado === "Inhabilitar" && periodo.isHabilitado) {
                return { ...periodo, isHabilitado: false }
            }
            if (estado === "Habilitar" && !periodo.isHabilitado) {
                return { ...periodo, isHabilitado: true }
            }
            return periodo;
        })
        setAmbiente({ ...ambiente, periodos: periodosActualizados })
    }

    const mostrarMensajeDeConfirmacion = (estado) => {
        agregarAlert({
            severidad: "primary", mensaje: <Container>
                <Row xs="auto" className="justify-content-md-end">
                    <QuestionCircleFill size="2rem" />
                    ¿Esta seguro de hacer esta modificacion?
                </Row>
                <Row xs="auto" className="justify-content-md-end">
                    <Button
                        onClick={() => {
                            modificarPeriodos(estado)
                        }}
                        size="sm"
                    >Aceptar</Button>
                </Row>
            </Container>
        });
    }

    return (<>
        <div style={{ width: "574px" }}>
            <Container className="ModificarEstadoDelAmbientePorFecha-header" fluid >
                <Row xs="auto" className="justify-content-md-end">
                    <Col xs lg="10" style={{ alignContent: "center", padding: 0 }}>
                        <h4 style={{ color: "white", fontWeight: "bold" }}>Busqueda de Ambiente por fecha</h4>
                    </Col>
                    <Button className="ModificarEstadoDelAmbientePorFecha-header-button-close" style={{ width: "58px", height: "58px" }} >
                        <XSquareFill style={{ width: "24px", height: "24px" }} />
                    </Button>
                </Row>
            </Container>
            <Container className="ModificarEstadoDelAmbientePorFecha-body" fluid>
                <Row className="justify-content-md-center">
                    <Col xs lg="9">
                        <Form onSubmit={formik.handleSubmit}>
                            <Form.Group as={Row} className="mb-3" controlId="nombre">
                                <Form.Label column sm="2">Nombre</Form.Label>
                                <Col sm="10">
                                    <FormControl
                                        type="text"
                                        placeholder="Ingrese el nombre del ambiente"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.nombre}
                                    />
                                    <Form.Text className="text-danger">
                                        {formik.touched.nombre && formik.errors.nombre ? (
                                            <div className="text-danger">{formik.errors.nombre}</div>
                                        ) : null}
                                    </Form.Text>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="fecha">
                                <Form.Label column sm="2">Fecha</Form.Label>
                                <Col sm="5">
                                    <FormControl
                                        type="text"
                                        placeholder="Ingrese la fecha"
                                        onChange={formik.handleChange}
                                        onFocus={(e)=> {
                                            e.target.type='date';
                                        }}
                                        onBlur={(e) => {
                                            e.target.type='text'
                                            formik.handleBlur(e)
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
                                    <Button onClick={handleOnClickLimpiar}>Limpiar</Button>
                                    {Object.keys(ambiente).length > 0 ? <>
                                        <Button onClick={() => mostrarMensajeDeConfirmacion("Inhabilitar")}
                                            disabled={!formik.isValid || !formik.dirty}>Inhabilitar</Button>
                                        <Button className="btn ModificarEstadoDelAmbientePorFecha-button-inhabilitar"
                                            onClick={() => mostrarMensajeDeConfirmacion("Habilitar")}
                                            disabled={!formik.isValid || !formik.dirty}>Habilitar</Button>
                                    </>
                                        : <Button disabled={!formik.isValid || !formik.dirty} type="submit">Consultar</Button>}
                                </Stack>
                            </Row>
                            {ambiente.periodos && <label>Periodos</label>}
                            {ambiente.periodos && ambiente.periodos.map(item => <>
                                <div style={{
                                    border: '1px solid black',
                                    width: '8rem',
                                    padding: '10px',
                                    color: `${item.isHabilitado ? "black" : "white"}`,
                                    background: `${item.isHabilitado ? "white" : "#71a3cc"}`
                                }}>
                                    {item.hora}
                                </div>
                            </>)}
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    </>);
}

export default ModificarEstadoDelAmbientePorFecha;