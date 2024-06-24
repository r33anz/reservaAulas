import { useState } from "react";
import {
  Col,
  Collapse,
  Container,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import "./style.css";
import { readNotification } from "../../services/Notification.service";
import { ArrowClockwise, Envelope, EnvelopeOpen } from "react-bootstrap-icons";

const ListaDeNotificaciones = ({
  notifications,
  id,
  fetchNotifications,
  showSidebar,
}) => {
  const [expandedIndex, setExpandedIndex] = useState(-1);

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

  const handleOnReadNotification = async (notificacion) => {
    if (notificacion.read_at === null) {
      await readNotification(id, notificacion.id);
      fetchNotifications(id);
    }
  };

  return (
    <>
      <Container fluid style={{ paddingRight: 0 }}>
        <Row
          sm
          className={`text-white ${
            showSidebar
              ? "ListaDeNotificaciones-sidebar-header"
              : "ListaDeNotificaciones-header"
          }`}
        >
          <Col
            xs="10"
            className="d-flex justify-content-start align-items-center"
          >
            <h5 style={{ fontWeight: "bold" }}>Lista de notificaciones</h5>
          </Col>
          <Col
            xs="2"
            className="justify-content-end align-items-end"
            style={{ padding: 0, display: "flex" }}
          >
            <OverlayTrigger
              overlay={<Tooltip id="hi">Actualizar lista</Tooltip>}
              placement="left"
            >
              <div
                onClick={() => fetchNotifications(id)}
                className="ListaDeNotificaciones-header-button-cargar d-flex 
                                               justify-content-center align-items-center"
              >
                <ArrowClockwise size={24} />
              </div>
            </OverlayTrigger>
          </Col>
        </Row>
        <Row
          className={`${
            showSidebar
              ? "ListaDeNotificaciones-sidebar-body"
              : "ListaDeNotificaciones-body"
          } justify-content-center`}
        >
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Asunto</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((item) => (
                <tr
                  onClick={() =>
                    setExpandedIndex(item.id === expandedIndex ? -1 : item.id)
                  }
                >
                  <td
                    style={{
                      background: item.read_at !== null ? "#e4efff" : "#ffffff",
                      boxShadow: "none",
                    }}
                    onClick={() => handleOnReadNotification(item)}
                  >
                    <Row>
                      <Col md="10">
                        {item.read_at === null ? (
                          <Envelope size={20} />
                        ) : (
                          <EnvelopeOpen size={20} />
                        )}{" "}
                        {item.data.message}
                      </Col>
                      <Col md="2" className="text-end">
                        {
                          <small>
                            {formatDistanceToNow(item.created_at, {
                              addSuffix: true,
                            })}
                          </small>
                        }
                      </Col>
                    </Row>
                    <Collapse in={expandedIndex === item.id}>
                      <div
                        id={`expandable-row-${item.id}`}
                        style={{ padding: "10px" }}
                      >
                        <h6>Mensaje:</h6> {item.data.data}
                      </div>
                    </Collapse>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </Container>
    </>
  );
};

export default ListaDeNotificaciones;
