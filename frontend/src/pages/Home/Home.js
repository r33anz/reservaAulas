import React from "react";
import { Col, Container, Row, Stack, Image } from 'react-bootstrap'
import { BellFill, Calendar3 } from 'react-bootstrap-icons'
import './style.css';
import logo from '../../assets/images/image.png';
import '../../components/Busquedanombre/Style.css';
import { Outlet } from "react-router-dom";

const Home = () => {

  return (<>
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <div className="tamaño">
        <h1>
          Intelligence<br />
          Software
        </h1>
      </div>
      <div className="ico-header">
        <BellFill color="white" size={30} />
        <Calendar3 color="white" size={30} style={{ marginLeft: '20px' }} />
      </div>
    </header>
    <Container fluid className="Home-body" >
      <Row xs="auto" sm="auto"> {/** xs= <576px, sm= >= 576 */}
        <Col>
          <h4>HOME</h4>
        </Col>
        {/* <Col className="Home-busqueda">
          <Stack direction="horizontal" gap={2}>
            <h5>BUSQUEDA:</h5>
            <Button>
              Nombre
            </Button>
            <Button>
              Fecha
            </Button>
          </Stack>
        </Col> */}
      </Row>
      <Outlet />
    </Container>
    <footer className="App-footer">
      <Container fluid="xs" style={{ padding: "5px" }}>
        <Stack direction="horizontal" gap={1}>
          <Image roundedCircle src={logo} style={{ height: "3rem", width: "3rem" }} />
          <small>
            Copyright ©2024 <br />
            Intelligence Software S.R.L. <br />
            Todos los derechos reservados.
          </small>
        </Stack>
      </Container>
    </footer>
  </>);
}

export default Home;