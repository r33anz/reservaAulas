import React, { useEffect, useState } from "react";
import { Container, Stack, Image, Nav } from "react-bootstrap";
import "./style.css";
import logo from "../../assets/images/image.png";
import "../../components/Busquedanombre/Style.css";
import { Link, Outlet, useParams } from "react-router-dom";
import NotificacionDocente from "../NotificacionDocente/NotificacionDocente";
import NotificacionAdmin from "../NotificacionAdmin/NotificacionAdmin";

const Home = ({ children, fetchNotifications }) => {
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
      <Container fluid className="Home-body">
        <Outlet />
        {children}
      </Container>
      <footer className="Home-footer text-end">
        <strong>
          Copyright © 2014{" "}
          <span className="Home-footer-grupo">IntelligSoft</span>.
        </strong>
        Todos los derechos reservados.
      </footer>
    </>
  );
};

export default Home;
