import React, { useRef } from "react";
import { Container, Row, Col, Form, Button, Stack } from 'react-bootstrap'
import { XSquareFill } from 'react-bootstrap-icons'
import './style.css'

const RegistrarAmbiente = () => {
    const form = useRef(null);
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
                        <Form>
                            <Stack gap={2} direction="vertical">
                                <Form.Group className="mb-3" controlId="formBasicName">
                                    <Form.Label>Nombre del ambiente</Form.Label>
                                    <Form.Control type="text" placeholder="Ingrese el nuevo nombre del ambiente" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicCapacity">
                                    <Form.Label>Capacidad</Form.Label>
                                    <Form.Control type="number" placeholder="Ingrese un valor" />
                                </Form.Group>
                                <Col lg="9">
                                    <Form.Group className="mb-3" controlId="formBasicBlock">
                                        <Form.Label>Bloque</Form.Label>
                                        <Form.Select>
                                            <option>Ingrese un bloque</option>
                                            <option value="Edificio Nuevo">Edificio Nuevo</option>
                                            <option value="Bloque Antiguo">Bloque Antiguo</option>
                                            <option value="Departamento de Fisica">Departamento de Fisica</option>
                                            <option value="MEMI">MEMI</option>
                                            <option value="Laboratorios">Laboratorios</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicTypeOfClassroom">
                                        <Form.Label>Tipo de ambiente</Form.Label>
                                        <Form.Select>
                                            <option>Ingrese tipo de ambiente</option>
                                            <option value="Aula común">Aula común</option>
                                            <option value="Laboratorio">Laboratorio</option>
                                            <option value="Sala de informatica">Sala de informatica</option>
                                            <option value="Auditorio">Auditorio</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicTypeOfClassroom">
                                        <Form.Label>Piso</Form.Label>
                                        <Form.Select>
                                            <option>Ingrese un piso</option>
                                            <option value="Aula común">Aula común</option>
                                            <option value="Laboratorio">Laboratorio</option>
                                            <option value="Sala de informatica">Sala de informatica</option>
                                            <option value="Auditorio">Auditorio</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Row xs="auto" className="justify-content-md-end">
                                    <Stack direction="horizontal" gap={2}>
                                        <Button className="btn RegistrarAmbiente-button-cancel" size="sm">Cancelar</Button>
                                        <Button className="btn RegistrarAmbiente-button-register" size="sm">Registrar</Button>
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