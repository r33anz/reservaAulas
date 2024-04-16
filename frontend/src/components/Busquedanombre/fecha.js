import React from "react";
import { Container, Row, Col, Form, Button, Stack } from 'react-bootstrap'
import { XSquareFill } from 'react-bootstrap-icons'

const Table = () => {
  //const [fechaInput, setFechaInput] = useState(""); // Estado para almacenar la fecha



  return (
    <div className="sssss" >
            <Container className="RegistrarAmbiente-header" fluid >
                <Row xs="auto" className="justify-content-md-end">
                    <Button className="RegistrarAmbiente-header-button-close" style={{ width: "58px", height: "58px" }} >
                        <XSquareFill style={{ width: "24px", height: "24px" }} />
                    </Button>
                </Row>
            </Container>
            <Container className="RegistrarAmbiente-body" fluid>
                <Row className="justify-content-md-center">
                    
                    <Col xs lg="9">
                        <Form>
                            <Stack gap={2} direction="vertical">
                                
                            <Form.Group className="mb-3" controlId="formBasicBlock">
                              <Form.Label>Periodo</Form.Label>
                              <Form.Select>
                                <option>Ingrese un periodo</option>
                                <option value="6:45-8:15">6:45-8:15</option>
                                <option value="8:15-9:45">8:15-9:45</option>
                                <option value="9:45-11:15">9:45-11:15</option>
                                <option value="11:15-12:45">11:15-12:45</option>
                                <option value="12:45-14:15">12:45-14:15</option>
                                <option value="14:15-15:45">14:15-15:45</option>
                                <option value="15:45-17:15">15:45-17:15</option>
                                <option value="17:15-18:45">17:15-18:45</option>
                                <option value="18:45-20:15">18:45-20:15</option>
                                <option value="20:15-21:45">20:15-21:45</option>
                              </Form.Select>
                            </Form.Group>                                                           
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
  );
}

export default Table;
