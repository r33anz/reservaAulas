import { useState } from "react";
import { Col, Container, Modal, Row, Stack } from "react-bootstrap";
import { EnvelopeFill, EnvelopeOpen, XSquareFill } from "react-bootstrap-icons";
import "./style.css";
import { readNotification } from "../../services/Notification.service";

const ListaDeNotificaciones = ({
  usuarioId,
  notifications,
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

  const handleOnReadNotification = async (notificacion) => {
    await readNotification(usuarioId, notificacion.id);
    fetchNotifications(usuarioId);
  };

  const handleShowNotification = (notification) => {
    setNotification(notification);
    handleOnReadNotification(notification);
  };

  return (
    <div>
      <Container fluid className="ListaDeNotificaciones-container">
        <div className="ListaDeNotificaciones-body">
          <Col>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Row
                  className={`align-items-center ${
                    notification.read_at !== null
                      ? "ListaDeNotificaciones-notification-read"
                      : "ListaDeNotificaciones-notification-unread"
                  }`}
                >
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
                </Row>
              ))
            ) : (
              <Row className="align-items-center justify-content-center ListaDeNotificaciones-sin-notigicaciones">
                Sin Notificaciones
              </Row>
            )}
          </Col>
        </div>
      </Container>
      {notification && notification.data && (
        <Modal show={notification.id} centered>
          <Row sm className="text-white ListaDeNotificaciones-header">
            <Col
              ref={refModalTitleNotification}
              xs="10"
              className="d-flex justify-content-start align-items-center ListaDeNotificationes-col-header-title"
            >
              <h4 className="ListaDeNotificationes-header-title">
                Notification
              </h4>
            </Col>
            <Col
              ref={refModalCloseNotification}
              xs="2"
              className="d-flex justify-content-end align-items-end ListaDeNotificationes-header-close"
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
