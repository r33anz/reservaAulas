import React from "react";
import { Container, Row, Col, Figure } from 'react-bootstrap'
import { BellFill, Calendar3 } from 'react-bootstrap-icons'
import logo from './logo.png';

const Home = ({ children }) => {
    return (<>
        <Container style={{ height: "118px" }} className="RegistrarAmbiente-header" fluid >
            <Row >
                <Col style={{ padding: "1rem" }}>
                    <Figure>
                        <Figure.Image
                            width={87}
                            height={88}
                            alt="171x180"
                            src={logo}
                        />
                    </Figure>
                </Col>
                <Col xs lg="10" style={{ color: "white" }} >
                    <h1>
                        Intelligence
                        Software
                    </h1>
                </Col>
                <Col style={{ padding: "1rem" }} className="justify-content-md-end">
                    <BellFill style={{ width: "35px", height: "35px", color: "white" }} />
                    <Calendar3 style={{ width: "35px", height: "35px", color: "white" }} />
                </Col>
            </Row>
        </Container>
        <Container style={{ paddingTop: "2rem" }}>
            {children}
        </Container>
    </>);
}

export default Home;