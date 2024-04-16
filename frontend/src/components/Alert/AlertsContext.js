import React, { createContext, useState } from "react";
import { Alert, Col, Row, Stack } from "react-bootstrap";
import { AlertsWrapper } from "./AlertsWrapper";
import "./style.css";
import { X } from "react-bootstrap-icons";

const AlertsContext = createContext();
const AlertsProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const agregarAlert = (alert) => {
        const id = alert.id ? Math.random().toString(36).slice(2, 9) + new Date().getTime().toString(36) : alert.id;
        setAlerts((prev) => [{ ...alert, id }, ...prev]);
    }

    const eliminarAlert = (id) => {
        const index = alerts.findIndex((alert) => alert.id === id);
        const newAlerts = [...alerts.slice(0, index), ...alerts.slice(index + 1)];
        setAlerts(newAlerts);
    }

    return (
        <AlertsContext.Provider value={{ agregarAlert, eliminarAlert }}>
            <AlertsWrapper show={alerts.length > 0}>
                {alerts.map((alert) => (
                    <Alert
                        key={alert.id}
                        className="AlertContext-alert"
                        variant={alert.severidad}
                    >
                        <Row xs="auto" lg="auto" className="justify-content-md-end">
                            <Col xs lg="10">
                                <Stack direction="horizontal" gap={2}>
                                    {alert.icon}
                                    {alert.mensaje}
                                </Stack>
                            </Col>
                            <Col xs lg="2" >
                                <X style={{ width: "24px", height: "24px" }} onClick={() => eliminarAlert(alert.id)} />
                            </Col>
                        </Row>
                    </Alert>
                ))}
            </AlertsWrapper>
            {children}
        </AlertsContext.Provider >
    );
}

export { AlertsContext, AlertsProvider };