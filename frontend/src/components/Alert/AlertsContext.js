import React, { createContext, useState } from "react";
import { AlertsWrapper } from "./AlertsWrapper";
import "./style.css";
import Message from "./Message";

const AlertsContext = createContext();
const AlertsProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);

    const agregarAlert = (alert) => {
        setAlert({ ...alert, hora: new Date().toLocaleTimeString() });
    }

    return (
        <AlertsContext.Provider value={{ agregarAlert }}>
            <AlertsWrapper show={alert}>
                {alert && <Message alert={alert} />}
            </AlertsWrapper>
            {children}
        </AlertsContext.Provider >
    );
}

export { AlertsContext, AlertsProvider };