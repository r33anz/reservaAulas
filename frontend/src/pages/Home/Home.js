import React, { useEffect, useState } from "react";
import { Container, Stack, Image } from "react-bootstrap";
import "./style.css";
import logo from "../../assets/images/image.png";
import "../../components/Busquedanombre/Style.css";
import { Outlet, useParams } from "react-router-dom";
import NotificacionDocente from "../NotificacionDocente/NotificacionDocente";
import NotificacionAdmin from "../NotificacionAdmin/NotificacionAdmin";

const Home = ({
  children,
  fetchNotifications,
}) => {
  const { id } = useParams("id");
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    if (id !== undefined) {
      window.sessionStorage.setItem("docente_id", id);
      setUsuarioId(id);
    }
  }, [id]);

  return (
    <>
      {usuarioId && (
        <NotificacionDocente
          docenteId={usuarioId}
          fetchNotifications={fetchNotifications}
        />
      )}
      <NotificacionAdmin fetchNotifications={fetchNotifications} />
      
      {/*<header className="App-header">
        <div className="titulo-header">
          <h3>
            Intelligence
            <br />
            Software
          </h3>
        </div>
      </header>*/}
      <Container fluid className="Home-body">
        <Outlet />
        {children}
      </Container>
      {/*
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
      </footer>*/}
    </>
  );
};

export default Home;
