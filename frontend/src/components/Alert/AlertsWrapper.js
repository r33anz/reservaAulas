import React from "react";
import "./style.css"

const AlertsWrapper = ({ children, show }) => {
    return (<>
        {show && <div className="align-items-center justify-content-center AlertsWrapper-container" >
            {children}
        </div>}
    </>);
}

export { AlertsWrapper };