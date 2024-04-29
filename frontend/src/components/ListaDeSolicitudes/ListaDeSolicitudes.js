import React, { useCallback, useContext, useEffect, useState } from "react";
import { Col, Container, Modal, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import "./style.css";
import { recuperarSolicitudesDeReserva, recuperarSolicitudesDeReservaAceptadas } from "../../services/Reserva.service";
import { ArrowClockwise, CardHeading, CheckCircleFill, XSquareFill } from "react-bootstrap-icons";
import { AlertsContext } from "../Alert/AlertsContext";

const ListaDeSolicitudes = ({ titulo, tipoDeUsuario }) => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [solicitud, setSolicitud] = useState({});
    const [show, setShow] = useState(false);
    const { agregarAlert } = useContext(AlertsContext);
    const periodos = [
        { id: 1, hora: '6:45 - 8:15', isHabilitado: true },
        { id: 2, hora: '8:15 - 9:45', isHabilitado: true },
        { id: 3, hora: '9:45 - 11:15', isHabilitado: true },
        { id: 4, hora: '11:15 - 12:45', isHabilitado: true },
        { id: 5, hora: '12:45 - 14:15', isHabilitado: true },
        { id: 6, hora: '14:15 - 15:45', isHabilitado: true },
        { id: 7, hora: '15:45 - 17:15', isHabilitado: false },
        { id: 8, hora: '17:15 - 18:45', isHabilitado: false },
        { id: 9, hora: '18:45 - 20:15', isHabilitado: false },
        { id: 10, hora: '20:15 - 21:45', isHabilitado: false },
    ]

    const getPeriodo = (periodoInicioId, periodoFinId) => {
        const periodoReserva = periodos.filter((periodo) => {
            return periodo.id === periodoInicioId || periodo.id === periodoFinId;
        }).map((periodo) => periodo.hora);
        return <>De {periodoReserva[0]} a {periodoReserva[1]}</>
    }

    const reloadSolicitudes = async () => {
        await getSolicitudes();
        agregarAlert({ icon: <CheckCircleFill />, severidad: "success", mensaje: "Actualizacion con exito" });
    }

    const getSolicitudes = useCallback(async () => {
        if (tipoDeUsuario === "Admin") {
            const id = window.sessionStorage.getItem("admin_id");
            const data = await recuperarSolicitudesDeReserva(id)
            setSolicitudes(data.solicitudes_por_llegada);
        }
        if (tipoDeUsuario === "Docente") {
            const id = window.sessionStorage.getItem("docente_id");
            const data = await recuperarSolicitudesDeReservaAceptadas(id)
            setSolicitudes(data.solicitudes_aceptadas_por_profesor["TATIANA APARICIO"]);
        }
    }, [tipoDeUsuario])

    useEffect(() => {
        getSolicitudes();
    }, [getSolicitudes])

    return (<>
        <Container fluid>
            <Row>
                <Col>
                    <Row sm className="text-white ListaDeSolicitudes-header">
                        <Col xs="10" className="d-flex justify-content-start align-items-center" style={{height: "3rem"}}>
                            <h5 style={{ fontWeight: "bold" }}>{titulo}</h5>
                        </Col>
                        <Col xs="2" className="d-flex justify-content-end align-items-end" style={{ padding: 0 }}>
                            <OverlayTrigger
                                overlay={(<Tooltip id="hi">Actualizar lista</Tooltip>)} placement="left"
                            >
                                <div onClick={reloadSolicitudes}
                                    className="ListaDeSolicitudes-header-button-cargar d-flex 
                                               justify-content-center align-items-center">
                                    <ArrowClockwise size={24} />
                                </div>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                    <Row className="ListaDeSolicitudes-body justify-content-center" >
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th scope="col">Ambiente</th>
                                    {tipoDeUsuario === "Admin" && <th>Docente</th>}
                                    <th scope="col">Materia</th>
                                    <th scope="col" className="d-none d-xl-table-cell">Periodo</th>
                                    <th scope="col" className="d-none d-lg-table-cell">Fecha de Reserva</th>
                                    <th scope="col">Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudes.map((item) => <tr>
                                    <td>{item.ambiente_nombre}</td>
                                    <td>{item.materia}</td>
                                    <td className="d-none d-xl-table-cell">
                                        {getPeriodo(item.periodo_ini_id, item.periodo_fin_id)}
                                    </td>
                                    <td className="d-none d-lg-table-cell">
                                        {item.fechaReserva}
                                    </td>
                                    <td>
                                        <CardHeading size={30} onClick={() => {
                                            setSolicitud(item);
                                            setShow(true);
                                        }} />
                                    </td>
                                </tr>)}
                            </tbody>
                        </Table>
                    </Row>
                </Col>
            </Row>
        </Container>
        <Modal
            size="xs"
            aria-labelledby="contained-modal-title-vcenter"
            show={show} onHide={() => setShow(false)}
            centered
        >
            <Row sm className="text-white SolicitarReserva-header">
                <Col xs="10" className="d-flex justify-content-start align-items-center" style={{ height: '100%' }}>
                    <h4 style={{ fontWeight: "bold" }} className="">Detalle de la Solicitud de Reserva</h4>
                </Col>
                <Col xs="2" className="d-flex justify-content-end align-items-end" style={{ padding: 0 }}>
                    <div onClick={() => setShow(false)}
                        className="SolicitarReserva-header-button-close d-flex justify-content-center align-items-center">
                        <XSquareFill size={24} />
                    </div>
                </Col>
            </Row>
            <Row className="SolicitarReserva-body justify-content-center">
                <h6>Nombre del Ambiente:</h6><p>{solicitud.ambiente_nombre}</p>
                {tipoDeUsuario === "Admin" && <><h6>Nombre del Docente: </h6><p>{solicitud.nombre_docente}</p></>}
                <h6>Periodo: </h6><p>{getPeriodo(solicitud.periodo_ini_id, solicitud.periodo_fin_id)}</p>
                <h6>Materia: </h6><p>{solicitud.materia}</p>
                <h6>Fecha Reserva:</h6><p>{solicitud.fechaReserva}</p>
                <h6>Cantidad: </h6><p>{solicitud.cantidad}</p>
                <h6>Grupo: </h6><p>{solicitud.grupo}</p>
                <h6>Razon: </h6><p>{solicitud.razon}</p>
            </Row>
        </Modal>
    </>
    );
}

export default ListaDeSolicitudes;