import React, { useContext, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert, Modal, Button, Col, Container, Dropdown, Form, FormControl, Row, Stack } from "react-bootstrap";
import { CheckCircleFill, ExclamationCircleFill, QuestionCircleFill, XSquareFill } from "react-bootstrap-icons";
import { estadoinhabilitado, habilita, modificarPerio } from "../../../services/ModificarPeriodo.service";
import { buscarAmbientePorNombre } from "../../../services/Busqueda.service";
import { AlertsContext } from "../../Alert/AlertsContext";
import "./style.css"

const ModificarEstadoDelAmbientePorFecha = () => {
    const [ambientes, setAmbientes] = useState([]);
    const [ambiente, setAmbiente] = useState({});
    const [show, setShow] = useState("");
    const [estado, setEstado] = useState("");
    const [showMensajeDeConfirmacion, setShowMensajeDeConfirmacion] = useState(false);
    const { agregarAlert } = useContext(AlertsContext);
    const inputAmbienteRef = useRef();
    const periodos = [
        { id: 1, hora: '6:45 - 8:15' },
        { id: 2, hora: '8:15 - 9:45' },
        { id: 3, hora: '9:45 - 11:15' },
        { id: 4, hora: '11:15 - 12:45' },
        { id: 5, hora: '12:45 - 14:15' },
        { id: 6, hora: '14:15 - 15:45' },
        { id: 7, hora: '15:45 - 17:15' },
        { id: 8, hora: '17:15 - 18:45' },
        { id: 9, hora: '18:45 - 20:15' },
        { id: 10, hora: '20:15 - 21:45' },
    ];

    const formik = useFormik({
        initialValues: {
            ambiente: { nombre: "", id: "" },
            fecha: "",
        },
        validationSchema: Yup.object({
            ambiente: Yup.object().shape({
                nombre: Yup.string()
                    .required("Obligatorio")
            }),
            fecha: Yup.date()
                .required("Obligatorio")
        }),
        onSubmit: values => {
            buscarAmbientPorFecha(values.ambiente, values.fecha);
            console.log(values);
        }
    });

    const handleOnClickLimpiar = () => {
        setEstado("");
        setAmbientes([]);
        setAmbiente({});
        formik.resetForm();
    }

    const buscarAmbiente = async (event) => {
        if (event.hasOwnProperty('target') && event.target.hasOwnProperty('value')) {
            const value = event.target.value
            formik.setFieldValue("ambiente", { ...formik.values.ambiente, nombre: value })
            const { respuesta } = await buscarAmbientePorNombre(value);
            console.log("ambientes", respuesta)
            setAmbientes(respuesta)
            setShow("show")
        }
    }

    const setNombreDelAmbiente = (ambiente) => {
        formik.setFieldValue("ambiente", { id: ambiente.id, nombre: ambiente.nombre });
        setShow("")
    }

    const setFechaDelAmbiente = (event, callback) => {
        setAmbiente({ ...ambiente, periodos: null })
        callback(event);
    }

    const buscarAmbientPorFecha = async (ambiente, fecha) => {
        const data = await modificarPerio(ambiente.id, fecha);
        if (data != null) {
            setAmbiente({
                id: 1, nombre: ambiente.nombre, fecha, periodos: data.periodos
            })
        }
    }

    const modificarPeriodos = async (estado) => {
        const periodosActualizados = periodos.map((periodo) => {
            if (estado === "Inhabilitar" && ambiente.periodos.includes(periodo.id)) {
                return periodo.id;
            }
            if (estado === "Habilitar" && !ambiente.periodos.includes(periodo.id)) {
                return periodo.id;
            }
            return periodo.id;
        })
        const response = estado === "Inhabilitar" ? await estadoinhabilitado(ambiente.id, periodosActualizados, ambiente.fecha)
            : await habilita(ambiente.id, periodosActualizados, ambiente.fecha);
        if (response !== null) {
            setAmbiente({ ...ambiente, periodos: periodosActualizados })
            agregarAlert({ icon: <CheckCircleFill />, severidad: "success", mensaje: "Modificacion exitosa" });
        } else {
            agregarAlert({ icon: <ExclamationCircleFill />, severidad: "danger", mensaje: "Modificacion fallida" });
        }
        buscarAmbientPorFecha(formik.values.ambiente, formik.values.fecha)
        setShowMensajeDeConfirmacion(false);
    }

    const mostrarMensajeDeConfirmacion = (estado) => {
        setEstado(estado);
        setShowMensajeDeConfirmacion(true);
    }

    return (<>
        <div style={{ width: "574px" }}>
            <Container className="ModificarEstadoDelAmbientePorFecha-header" fluid >
                <Row xs="auto" className="justify-content-md-end">
                    <Col xs lg="10" style={{ alignContent: "center", padding: 0 }}>
                        <h4 style={{ color: "white", fontWeight: "bold" }}>Modificar Estado de Ambiente por fecha</h4>
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
                            <Form.Group as={Row} className="mb-3" controlId="ambiente">
                                <Form.Label column sm="2">Nombre</Form.Label>
                                <Col sm="10">
                                    <Dropdown id="ambientes">
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
                                            bsPrefix="dropdown-toggle" />
                                        {formik.values.ambiente.nombre !== "" &&
                                            <Dropdown.Menu className={show} style={{ width: "100%", overflowY: "auto", maxHeight: "5rem" }} show>
                                                {ambientes.map((ambiente) =>
                                                    <Dropdown.Item
                                                        key={ambiente.nombre}
                                                        onClick={() => setNombreDelAmbiente(ambiente)}
                                                    >
                                                        {ambiente.nombre}
                                                    </Dropdown.Item>)}
                                            </Dropdown.Menu>}
                                    </Dropdown>
                                    <Form.Text className="text-danger">
                                        {formik.touched.ambiente && formik.errors.ambiente ? (
                                            <div className="text-danger">{formik.errors.ambiente.nombre}</div>
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
                                        onChange={(e) => setFechaDelAmbiente(e, formik.handleChange)}
                                        onFocus={(e) => {
                                            e.target.type = 'date';
                                        }}
                                        onBlur={(e) => {
                                            e.target.type = 'text'
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
                                    {ambiente.periodos ? <>
                                        <Button onClick={() => mostrarMensajeDeConfirmacion("Inhabilitar")}
                                            disabled={!formik.isValid || !formik.dirty}>Inhabilitar</Button>
                                        <Button className="btn ModificarEstadoDelAmbientePorFecha-button-inhabilitar"
                                            onClick={() => mostrarMensajeDeConfirmacion("Habilitar")}
                                            disabled={!formik.isValid || !formik.dirty}>Habilitar</Button>
                                    </>
                                        : <Button type="submit">Consultar</Button>}
                                </Stack>
                            </Row>
                            {ambiente.periodos && <label>Periodos</label>}
                            {ambiente.periodos && periodos.map(item => <>
                                <div style={{
                                    border: '1px solid black',
                                    width: '8rem',
                                    padding: '10px',
                                    color: `${ambiente.periodos.includes(item.id) ? "white" : "black"}`,
                                    background: `${ambiente.periodos.includes(item.id) ? "#71a3cc" : "white"}`
                                }}>
                                    {item.hora}
                                </div>
                            </>)}
                        </Form>
                    </Col>
                </Row>
            </Container>
            {estado !== "" &&
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
                        style={{margin: 0}}
                    >
                        <Container>
                            <Row xs="auto">
                                <QuestionCircleFill size="2rem" />
                                ¿Esta seguro de hacer esta modificacion?
                            </Row>
                            <Row xs="auto" className="justify-content-md-end">
                                <Stack direction="horizontal" gap={2}>
                                    <Button
                                        className="ModificarEstadoDelAmbientePorFecha-cancel"
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => setShowMensajeDeConfirmacion(false)}
                                    >Cancelar</Button>
                                    <Button
                                        onClick={() => {
                                            modificarPeriodos(estado)
                                        }}
                                        size="sm"
                                    >Aceptar</Button>
                                </Stack>
                            </Row>
                        </Container>
                    </Alert>
                </Modal>}
        </div>
    </>);
}

export default ModificarEstadoDelAmbientePorFecha;