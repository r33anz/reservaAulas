import React from "react";
import { Container } from "react-bootstrap";
import "./style.css"

const AlertsWrapper = ({ children, show }) => {
    return (<>
        {show && <Container className="d-flex align-items-center justify-content-md-center AlertsWrapper-container" >
            {children}
        </Container>}
    </>);
}

export { AlertsWrapper };