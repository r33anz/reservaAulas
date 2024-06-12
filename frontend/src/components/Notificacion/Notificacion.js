import { Dropdown } from "react-bootstrap";
import ListaDeNotificaciones from "../../components/ListaDeNotificaciones";
import { useCallback, useEffect, useRef, useState } from "react";
import { BellFill } from "react-bootstrap-icons";
import "./style.css";

const Notificacion = ({ notifications, id }) => {
  const [show, setShow] = useState(false);
  const [notificationsIdNotRead, setNotificationsIdNotRead] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const refDropdownMenu = useRef(null);
  const refDropdownToggle = useRef(null);
  const refDropdown = useRef(null);
  const refModalTitleNotification = useRef(null);
  const refModalCloseNotification = useRef(null);
  const refModalBodyNotification = useRef(null);

  const cargarNotifications = useCallback(() => {
    const notificationsIdNotRead = notifications
      .filter((notification) => notification.read_at === null)
      .map((notification) => notification.id);
    setNotificationsIdNotRead(notificationsIdNotRead);
  }, [notifications]);

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
    if (id !== null && notifications.length > 0) {
      cargarNotifications();
    }
  }, [notifications, cargarNotifications, id]);

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
          usuarioId={id}
          notifications={notifications}
          refModalTitleNotification={refModalTitleNotification}
          refModalCloseNotification={refModalCloseNotification}
          refModalBodyNotification={refModalBodyNotification}
          fetchNotifications={cargarNotifications}
        />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Notificacion;
