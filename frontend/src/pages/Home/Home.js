import React, { useEffect } from "react";
import { Container, Stack, Image } from "react-bootstrap";
import { Calendar3 } from "react-bootstrap-icons";
import "./style.css";
import logo from "../../assets/images/image.png";
import "../../components/Busquedanombre/Style.css";
import { Outlet, useParams } from "react-router-dom";
import NotificacionAdmin from "../DashboardAdmin/NotificacionAdmin";
import NotificacionDocente from "../DashboardDocente/NotificacionDocente";

const Home = ({ setShowCalendar, showCalendar }) => {
  const { id } = useParams("id");

  useEffect(() => {
    if (id === undefined) {
      window.sessionStorage.setItem("admin_id", "0");
    } else {
      window.sessionStorage.setItem("docente_id", id);
    }
  }, [id]);

  return (
    <>
      <header className="App-header">
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          onClick={() => setShowCalendar(false)}
        />
        <div className="titulo-header" onClick={() => setShowCalendar(false)}>
          <h3>
            Intelligence
            <br />
            Software
          </h3>
        </div>
        <div className="ico-header">
          {id === undefined ? <NotificacionAdmin /> : <NotificacionDocente />}
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
