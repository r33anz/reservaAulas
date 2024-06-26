import { useState, useEffect } from "react";
import { Alert, Col, Modal, Row, Stack } from "react-bootstrap";
import { X } from "react-bootstrap-icons";
import "./style.css";

const Message = ({ alert, setAlert }) => {
  const [message, setMessage] = useState(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true);
    const timeId = setTimeout(() => {
      setMessage(null);
      setShow(false);
      setAlert(null);
    }, 5000);
    setMessage(alert);
    return () => {
      clearTimeout(timeId);
      setMessage(null);
      setShow(false);
    };
  }, [alert]);

  return (
    <>
      {message && (
        <Alert
          key={message.id}
          className="AlertContext-alert"
          variant={message.severidad}
          show={show}
        >
          <Row xs="auto" lg="auto" className="justify-content-md-start">
            {message.mensaje && <Col>{message.hora}</Col>}
          </Row>
          <Row xs="auto" lg="auto" className="justify-content-md-end">
            <Col>
              <Stack direction="horizontal" gap={2}>
                {message.icon}
                {message.mensaje}
                <X
                  style={{ width: "24px", height: "24px" }}
                  onClick={() => setShow(false)}
                />
              </Stack>
            </Col>
          </Row>
        </Alert>
      )}
    </>
  );
};

export default Message;
