import React, { useState } from "react";
import { Button, Col, Row, Stack } from "react-bootstrap";
import Buscar from "../../components/Busquedanombre/Buscar";
import ListaDeSolicitudes from "../../components/ListaDeSolicitudes";
import SolcitarReserva from "../../components/SolicitudReserva/SolicitarReserva";

const DashboardDocente = () => {
    const [solicitarReserva, setSolicitarReserva] = useState(false);

    return (<>
        <Row xs="auto" sm="auto" xl="auto" xxl="auto">
            <Col sm="4" lg="4" xxl="4" style={{paddingBottom: "1rem"}}>
                {solicitarReserva ?
                    <SolcitarReserva onClose={() => setSolicitarReserva(!solicitarReserva)} />
                    : <Stack direction="vertical" gap={2}>
                        <Button style={{ width: "100%", background: "#003F70" }}
                            className="btn text-center align-middle"
                            onClick={() => setSolicitarReserva(!solicitarReserva)}>
                            <h5 style={{ fontWeight: "bold" }}>Reserva de Ambiente</h5>
                        </Button>
                        <Buscar />
                    </Stack>
                }
            </Col>
            <Col sm="8" lg="8" xxl="8">
                <ListaDeSolicitudes tipoDeUsuario="Docente" titulo="Lista de Solicitudes de Reserva Aceptadas" />
            </Col>
        </Row>
    </>)
}

export default DashboardDocente;