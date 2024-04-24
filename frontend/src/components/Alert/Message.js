import { useState, useEffect } from 'react'
import { Alert, Col, Row, Stack } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';
import "./style.css"

const Message = ({ alert }) => {
    const [message, setMessage] = useState(null);
    const [show, setShow] = useState(true)

    useEffect(() => {
        const timeId = setTimeout(() => {
            setMessage(null);
            setShow(false)
        }, 5000);
        setShow(true)
        setMessage(alert);
        return () => {
            clearTimeout(timeId);
        }
    }, [alert]);

    useEffect(() => {
        setMessage(null);
        setShow(false)
        setTimeout(() => console.log(), 1000);
    }, [])

    return (<>{message && <Alert
        key={message.id}
        className="AlertContext-alert"
        variant={message.severidad}
        show={show}
    >
        <Row xs="auto" lg="auto" className="justify-content-md-start">
            <Col>
                {message.hora}
            </Col>
        </Row>
        <Row xs="auto" lg="auto" className="justify-content-md-end">
            <Col>
                <Stack direction="horizontal" gap={2}>
                    {message.icon}
                    {message.mensaje}
                    <X style={{ width: "24px", height: "24px" }} onClick={() => setShow(false)} />
                </Stack>
            </Col>
        </Row>
    </Alert>}</>
    )
}

export default Message;