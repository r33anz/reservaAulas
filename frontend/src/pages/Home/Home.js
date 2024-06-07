import React, { useCallback, useEffect, useRef, useState } from "react";
import { Container, Stack, Image, Dropdown } from "react-bootstrap";
import { BellFill, Calendar3 } from "react-bootstrap-icons";
import "./style.css";
import logo from "../../assets/images/image.png";
import "../../components/Busquedanombre/Style.css";
import { Outlet } from "react-router-dom";
import ListaDeNotificaciones from "../../components/ListaDeNotificaciones";
import { getNotifications } from "../../services/Notification.service";

const Home = ({ setShowCalendar, showCalendar }) => {
  const [show, setShow] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsIdNotRead, setNotificationsIdNotRead] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const refDropdownMenu = useRef(null);
  const refDropdownToggle = useRef(null);
  const refDropdown = useRef(null);
  const refModalTitleNotification = useRef(null);
  const refModalCloseNotification = useRef(null);
  const refModalBodyNotification = useRef(null);

  const fetchNotifications = async () => {
    const id = window.sessionStorage.getItem("docente_id");
    const response = await getNotifications(id);
    console.log(response);
    setNotifications(response);
    const notificationsIdNotRead = response
      .filter((notification) => notification.read_at === null)
      .map((notification) => notification.id);
    setNotificationsIdNotRead(notificationsIdNotRead);
  };

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (
        !refDropdownMenu.current?.contains(event.target) &&
        !refDropdown.current?.contains(event.target) &&
        !refDropdownToggle.current?.contains(event.target) &&
        !refModalTitleNotification.current?.contains(event.target) &&
        !refModalCloseNotification.current?.contains(event.target) &&
        !refModalBodyNotification.current?.contains(event.target)
      ) {
        handleClose();
      }
    };
    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [
    refDropdownMenu,
    refDropdown,
    refDropdownToggle,
    refModalTitleNotification,
    refModalCloseNotification,
    refModalBodyNotification,
  ]);

  useEffect(() => {
    fetchNotifications();
  }, []);

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
          <Dropdown ref={refDropdown} autoClose={false} show={show}>
            <Dropdown.Toggle
              ref={refDropdownToggle}
              as="div"
              className="home-dropdown"
            >
              <div class="notification-icon" onClick={handleShow}>
                <BellFill color="white" size={30} />
                {notificationsIdNotRead.length > 0 && (
                  <span class="notification-count">
                    {notificationsIdNotRead.length < 100
                      ? notificationsIdNotRead.length
                      : "99+"}
                  </span>
                )}
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu
              ref={refDropdownMenu}
              show={show}
              style={{
                background: "#D9D9D9",
                padding: 0,
              }}
            >
              <ListaDeNotificaciones
                notifications={notifications}
                notificationsIdNotRead={notificationsIdNotRead}
                refModalTitleNotification={refModalTitleNotification}
                refModalCloseNotification={refModalCloseNotification}
                refModalBodyNotification={refModalBodyNotification}
                fetchNotifications={fetchNotifications}
              />
            </Dropdown.Menu>
          </Dropdown>
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
