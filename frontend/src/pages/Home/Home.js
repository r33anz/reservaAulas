import React, { useEffect, useState } from "react";
import { Container, Stack, Image } from "react-bootstrap";
import { Calendar3, FileEarmarkRuled } from "react-bootstrap-icons";
import "./style.css";
import logo from "../../assets/images/image.png";
import "../../components/Busquedanombre/Style.css";
import { Outlet, useParams } from "react-router-dom";
import NotificacionAdmin from "../DashboardAdmin/NotificacionAdmin";
import NotificacionDocente from "../DashboardDocente/NotificacionDocente";
import { getReporte } from "../../services/Reporte.service";

const Home = ({ children,setShowCalendar, showCalendar }) => {
  const { id } = useParams("id");
  const [usuarioId, setUsuarioId] = useState(null);

  const fetchReporte = async () => {
    await getReporte();
  };

  useEffect(() => {
    if (id === undefined) {
      window.sessionStorage.setItem("admin_id", 0);
      setUsuarioId(0);
    } else {
      window.sessionStorage.setItem("docente_id", id);
      setUsuarioId(id);
    }
  }, [id]);

  return (
    <>
      <header className="App-header">
        <div className="titulo-header" onClick={() => setShowCalendar(false)}>
          <h3>
            Intelligence
            <br />
            Software
          </h3>
        </div>
        <div className="ico-header">
          <Stack direction="horizontal" gap={2}>
            {usuarioId !== null && usuarioId === 0 && (
              <FileEarmarkRuled
                color="white"
                size={30}
                onClick={() => fetchReporte()}
              />
            )}
            {usuarioId !== null && usuarioId === 0 ? (
              <NotificacionAdmin adminId={usuarioId} />
            ) : (
              <NotificacionDocente docenteId={usuarioId} />
            )}
            <Calendar3
              color="white"
              size={30}
              onClick={() => setShowCalendar(!showCalendar)}
            />
          </Stack>
        </div>
      </header>
      <Container fluid className="Home-body">
        <Outlet />
        {children}
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
