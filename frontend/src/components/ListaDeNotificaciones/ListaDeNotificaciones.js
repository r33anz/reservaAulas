import { useState } from "react";
import { Button, Col, Container, Modal, Row, Stack } from "react-bootstrap";
import { EnvelopeFill, EnvelopeOpen, XSquareFill } from "react-bootstrap-icons";
import "./style.css";
import { readNotification } from "../../services/Notification.service";

const ListaDeNotificaciones = ({
  notifications,
  notificationsIdNotRead,
  refModalTitleNotification,
  refModalCloseNotification,
  refModalBodyNotification,
  fetchNotifications,
}) => {
  const [notification, setNotification] = useState({});
  const formatDistanceToNow = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - messageDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const daysAgo = diffDays === 1 ? "1 día" : `${diffDays} días`;
    const hoursAgo = diffHours === 1 ? "1 hora" : `${diffHours} horas`;
    return `Hace: ${diffDays > 0 ? `${daysAgo} y ` : ""}${hoursAgo}`;
  };

  const handleOnCloseNotification = () => {
    setNotification({});
  };

  const handleOnReadNotification = async (notification) => {
    const notificacionesId = notification.id;
    const docenteId = window.sessionStorage.getItem("docente_id");
    await readNotification(docenteId, [notificacionesId]);
    fetchNotifications();
  };

  const handleOnMarkAllAsRead = async () => {
    const docenteId = window.sessionStorage.getItem("docente_id");
    await readNotification(docenteId, notificationsIdNotRead);
    fetchNotifications();
  };

  const handleShowNotification = (notification) => {
    setNotification(notification);
    handleOnReadNotification(notification);
  };

  return (
    <div>
      <Container fluid className="ListaDeNotificaciones-container">
        <Row className="align-items-center ListaDeNotificaciones-row-button-mark-all-as-read">
          <Col>
            <Button
              size="sm"
              className="Home-button-marcar-todas"
              onClick={() => handleOnMarkAllAsRead()}
            >
              Marcar todo como leidas
            </Button>
          </Col>
        </Row>
        <div className="ListaDeNotificaciones-body">
          <Col>
            <Row
              className={`align-items-center ${
                notification.read_at !== null
                  ? "ListaDeNotificaciones-notification-read"
                  : "ListaDeNotificaciones-notification-unread"
              }`}
            >
              {notifications.map((notification) => (
                <Stack
                  key="{notification.id}"
                  direction="horizontal"
                  gap={2}
                  onClick={() => handleShowNotification(notification)}
                >
                  <Col xs={1}>
                    {notification.read_at ? (
                      <EnvelopeOpen size={20} />
                    ) : (
                      <EnvelopeFill size={20} />
                    )}
                  </Col>
                  <Col
                    className="ListaDeNotificaciones-notification-title"
                    xs={7}
                  >
                    {notification.data.message}
                  </Col>
                  <Col>
                    <small>
                      {formatDistanceToNow(notification.created_at, {
                        addSuffix: true,
                      })}
                    </small>
                  </Col>
                </Stack>
              ))}
            </Row>
          </Col>
        </div>
      </Container>
      {notification && notification.data && (
        <Modal
          // size="xs"
          // aria-labelledby="contained-modal-title-vcenter"
          // onHide={() => handleOnCloseNotification()}
          show={notification.id}
          centered
        >
          <Row sm className="text-white ListaDeNotificaciones-header">
            <Col
              ref={refModalTitleNotification}
              xs="10"
              className="d-flex justify-content-start align-items-center"
              style={{ height: "100%" }}
            >
              <h4 style={{ fontWeight: "bold" }}>Notification</h4>
            </Col>
            <Col
              ref={refModalCloseNotification}
              xs="2"
              className="d-flex justify-content-end align-items-end"
              style={{ padding: 0 }}
            >
              <div
                onClick={() => handleOnCloseNotification()}
                className="ListaDeNotificaciones-header-button-close d-flex justify-content-center align-items-center"
              >
                <XSquareFill size={24} />
              </div>
            </Col>
          </Row>
          <Row
            ref={refModalBodyNotification}
            className="ListaDeNotificaciones-notification-body justify-content-center"
          >
            <h6>Message:</h6>
            <p>{notification.data.data}</p>
          </Row>
        </Modal>
      )}
    </div>
  );
};

export default ListaDeNotificaciones;
