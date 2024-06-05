import React from "react";
import { Container, Stack, Image } from "react-bootstrap";
import { BellFill, Calendar3 } from "react-bootstrap-icons";
import "./style.css";
import logo from "../../assets/images/image.png";
import "../../components/Busquedanombre/Style.css";
import { Outlet } from "react-router-dom";

const Home = ({ setShowCalendar, showCalendar }) => {
  return (
    <>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="titulo-header" onClick={() => setShowCalendar(false)}>
          <h3>
            Intelligence
            <br />
            Software
          </h3>
        </div>
        <div className="ico-header">
          <div class="notification-icon">
            <BellFill color="white" size={30} />
            <span class="notification-count">3</span>
          </div>
          <Calendar3
            color="white"
            size={30}
            style={{ marginLeft: "20px" }}
            onClick={() => setShowCalendar(!showCalendar)}
          />
        </div>
      </header>
      <Container fluid className="Home-body">
        <Outlet />
      </Container>
      <footer className="App-footer">
        <Container fluid="xs" style={{ padding: "5px" }}>
          <Stack direction="horizontal" gap={1}>
            <Image
              roundedCircle
              src={logo}
              style={{ height: "2rem", width: "2rem" }}
            />
            <small style={{ fontSize: ".6em" }}>
              Copyright ©2024 <br />
              Intelligence Software S.R.L. <br />
              Todos los derechos reservados.
            </small>
          </Stack>
        </Container>
      </footer>
    </>
  );
};

export default Home;
