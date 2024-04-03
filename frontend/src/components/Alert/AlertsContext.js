import React, { createContext, useState } from "react";
import { Alert, Row, Stack } from "react-bootstrap";
import { AlertsWrapper } from "./AlertsWrapper";
import "./style.css";

const AlertsContext = createContext();
const AlertsProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const agregarAlert = (alert) => {
        const id = alert.id ? Math.random().toString(36).slice(2, 9) + new Date().getTime().toString(36): alert.id;
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
                        onClose={() => eliminarAlert(alert.id)}
                        variant={alert.severidad}
                        dismissible
                    >
                        <Row>
                            <Stack direction="horizontal" gap={2}>
                                {alert.icon}
                                {alert.mensaje}
                            </Stack>
                        </Row>
                    </Alert>
                ))}
            </AlertsWrapper>
            {children}
        </AlertsContext.Provider >
    );
}

export { AlertsContext, AlertsProvider };