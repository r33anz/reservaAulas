import React from "react";
import "./style.css"

const AlertsWrapper = ({ children, show }) => {
    return (<>
        {show && <div className=" align-items-end justify-content-md-end AlertsWrapper-container" >
            {children}
        </div>}
    </>);
}

export { AlertsWrapper };