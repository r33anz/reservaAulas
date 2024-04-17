import React from "react";
import "./style.css"
import { ExclamationCircleFill } from "react-bootstrap-icons";
import { Button, Col, Container, Row } from "react-bootstrap";

const NotFound = () => {
    return (<Container fluid className="min-vh-100 d-flex justify-content-center align-items-center">
        <Row>
            <Col>
                <div class="text-center">
                    <h2 class="d-flex justify-content-center align-items-center">
                        <span class="display-1 fw-bold">4</span>
                        <ExclamationCircleFill className="display-4" />
                        <span class="display-1 fw-bold bsb-flip-h">4</span>
                    </h2>
                    <h3>Oops! Estas perdido.</h3>
                    <p>La pagina que estas buscando no fue encontrado.</p>
                    <Button className="btn NotFound-button-ir-a-home" href="/" >Ir a Home</Button>
                </div>
            </Col>
        </Row>
    </Container>);
}

export default NotFound;