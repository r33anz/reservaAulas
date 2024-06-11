import { Dropdown } from "react-bootstrap";
import ListaDeNotificaciones from "../../components/ListaDeNotificaciones";
import { useEffect, useRef, useState } from "react";
import { BellFill } from "react-bootstrap-icons";
import { getNotifications } from "../../services/Notification.service";
import "./style.css";

const Notificacion = () => {
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
  const id = window.sessionStorage.getItem("docente_id");

  const fetchNotifications = async () => {
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
    if (id !== null) {
      fetchNotifications();
    }
  }, []);

  return (
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
  );
}

export default Notificacion;
