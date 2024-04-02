import React, { useState } from "react";
import { Button, Col, Container, Form, FormControl, Row, Stack } from "react-bootstrap";
import { XSquareFill } from "react-bootstrap-icons";
import "./style.css"

const ModificarEstadoDelAmbientePorFecha = ({ ambiente }) => {
    // const [fecha, setFecha] = useState();
    const [items, setItems] = useState([
        { id: 1, nombre: '6:45 - 8:15', checked: false, isHabilitado: true, reservado: false },
        { id: 2, nombre: '8:15 - 9:45', checked: false, isHabilitado: true, reservado: false },
        { id: 3, nombre: '9:45 - 11:15', checked: false, isHabilitado: true, reservado: false },
        { id: 4, nombre: '11:15 - 12:45', checked: false, isHabilitado: true, reservado: true },
        { id: 5, nombre: '12:45 - 14:15', checked: false, isHabilitado: true, reservado: false },
        { id: 6, nombre: '14:15 - 15:45', checked: false, isHabilitado: true, reservado: false },
        { id: 7, nombre: '15:45 - 17:15', checked: false, isHabilitado: false, reservado: false },
        { id: 8, nombre: '17:15 - 18:45', checked: false, isHabilitado: false, reservado: false },
        { id: 9, nombre: '18:45 - 20:15', checked: false, isHabilitado: false, reservado: false },
        { id: 10, nombre: '20:15 - 21:45', checked: false, isHabilitado: false, reservado: false },
    ]);

    const handleCheckboxChange = (itemId) => {
        const updatedItems = items.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
        );
        setItems(updatedItems);
    };



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
                        {/* <Form onSubmit={formik.handleSubmit}> */}
                        <Form>
                            <Form.Group as={Row} className="mb-3" controlId="fecha">
                                <Form.Label column sm="2">Fecha</Form.Label>
                                <Col sm="10">
                                    <FormControl type="date" />
                                </Col>
                            </Form.Group>
                            <Row xs="auto" className="justify-content-md-end">
                                <Stack direction="horizontal" gap={2}>
                                    <Button className="btn ModificarEstadoDelAmbientePorFecha-button-inhabilitar">Inhabilitar</Button>
                                    <Button>Habilitar</Button>
                                </Stack>
                            </Row>
                            <label>Periodos</label>
                            {items.map(item => (
                                <Form.Group as={Col} xs lg='5' key={item.id} controlId="periodo">
                                    <Form.Check
                                        type="checkbox"
                                        disabled={item.reservado}
                                        label={<div style={{
                                            border: '1px solid black',
                                            width: '8rem',
                                            padding: '10px',
                                            background: `${item.isHabilitado ? "blue": "red"}`
                                        }}>
                                            {item.nombre}
                                        </div>}
                                        checked={item.checked}
                                        onChange={() => handleCheckboxChange(item.id)}
                                    />
                                </Form.Group>
                            ))}
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    </>);
}

export default ModificarEstadoDelAmbientePorFecha;