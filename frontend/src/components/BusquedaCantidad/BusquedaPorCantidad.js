import React, { useState } from "react";
import { buscarAmbientePorCantidad } from '../../services/Busqueda.service';
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import { XSquareFill } from "react-bootstrap-icons";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import './Style.css';

const BuscarCantidad = () => {
    const [ambientes, setAmbientes] = useState([]);
    const [cantidadRange, setCantidadRange] = useState([0, 300]);
    const [ambienteDetails, setAmbienteDetails] = useState([]);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [sliderModificado, setSliderModificado] = useState(false);
    const [editingMin, setEditingMin] = useState(false);
    const [editingMax, setEditingMax] = useState(false);

    const buscarAmbientesPorCantidad = async () => {
        const [minCantidad, maxCantidad] = cantidadRange;
        const { respuesta } = await buscarAmbientePorCantidad(minCantidad, maxCantidad);
        setAmbientes(respuesta);
        setAmbienteDetails(respuesta || []); // Asegurarse de que siempre sea un array
        setBusquedaRealizada(true);
        setSliderModificado(false); // Resetear el estado al realizar una nueva búsqueda
    };

    const handleBuscarClick = (event) => {
        event.preventDefault();
        buscarAmbientesPorCantidad();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            buscarAmbientesPorCantidad();
        }
    };

    const handleSliderChange = (value) => {
        setCantidadRange(value);
        setSliderModificado(true); // Indicar que el slider ha sido modificado
    };

    const handleInputChange = (event, index) => {
        const value = Math.min(Math.max(Number(event.target.value), 0), 300); // Asegurar que el valor esté dentro de los límites
        const newRange = [...cantidadRange];
        newRange[index] = value;
        setCantidadRange(newRange);
    };

    const handleInputBlur = (index) => {
        if (index === 0) {
            setEditingMin(false);
        } else {
            setEditingMax(false);
        }
    };

    const handleInputKeyDown = (event, index) => {
        if (event.key === 'Enter') {
            handleInputBlur(index);
        }
    };

    return (
        <div className="buscarcontainer" style={{ width: "574px" }}>
            <Container className="ModificarEstadoDelAmbientePorFecha-header" fluid>
                <Row xs="auto" className="justify-content-md-end">
                    <Col xs lg="10" style={{ alignContent: "center", padding: 0 }}>
                        <h4 style={{ color: "white", fontWeight: "bold" }}>Búsqueda por cantidad</h4>
                    </Col>
                    <Button className="ModificarEstadoDelAmbientePorFecha-header-button-close" style={{ width: "58px", height: "58px" }} >
                        <XSquareFill style={{ width: "24px", height: "24px" }} />
                    </Button>
                </Row>
            </Container>
            <Container className="ModificarEstadoDelAmbientePorFecha-body" fluid>
                <Row className="justify-content-md-center">
                    <Col xs lg="9">
                        <Form onSubmit={handleBuscarClick} onKeyDown={handleKeyDown}>
                            <Form.Group as={Row} className="mb-3" controlId="cantidad">
                                <Form.Label className="label_cantidad" column sm="2">Cantidad</Form.Label>
                                <Col sm="8" style={{ position: 'relative' }}>
                                    <Slider
                                        range
                                        min={0}
                                        max={300}
                                        value={cantidadRange}
                                        onChange={handleSliderChange}
                                        trackStyle={[{ backgroundColor: '#337ab7', height: 10 }]}
                                        handleStyle={[
                                            { borderColor: '#337ab7', height: 20, width: 20, marginLeft: -10, marginTop: -6, backgroundColor: '#fff' },
                                            { borderColor: '#337ab7', height: 20, width: 20, marginLeft: -10, marginTop: -6, backgroundColor: '#fff' }
                                        ]}
                                        railStyle={{ backgroundColor: '#aaa', height: 10 }}
                                    />
                                    <div className="slider-values">
                                        {editingMin ? (
                                            <input 
                                                type="number" 
                                                value={cantidadRange[0]} 
                                                onChange={(e) => handleInputChange(e, 0)}
                                                onBlur={() => handleInputBlur(0)}
                                                onKeyDown={(e) => handleInputKeyDown(e, 0)}
                                                style={{ 
                                                    position: 'absolute', 
                                                    left: `calc(${(cantidadRange[0] / 300) * 100}% - 20px)`, 
                                                    marginTop: '10px', 
                                                    width: '70px',
                                                    textAlign: 'center' 
                                                }}
                                            />
                                        ) : (
                                            <span 
                                                style={{ 
                                                    position: 'absolute', 
                                                    left: `calc(${(cantidadRange[0] / 300) * 100}% - 20px)`, 
                                                    marginTop: '10px', 
                                                    width: '70px', 
                                                    textAlign: 'center',
                                                    cursor: 'pointer' 
                                                }}
                                                onDoubleClick={() => setEditingMin(true)}
                                            >
                                                Min: {cantidadRange[0]}
                                            </span>
                                        )}
                                        {editingMax ? (
                                            <input 
                                                type="number" 
                                                value={cantidadRange[1]} 
                                                onChange={(e) => handleInputChange(e, 1)}
                                                onBlur={() => handleInputBlur(1)}
                                                onKeyDown={(e) => handleInputKeyDown(e, 1)}
                                                style={{ 
                                                    position: 'absolute', 
                                                    left: `calc(${(cantidadRange[1] / 300) * 100}% - 20px)`, 
                                                    top: '-30px', 
                                                    width: '70px', 
                                                    textAlign: 'center' 
                                                }}
                                            />
                                        ) : (
                                            <span 
                                                style={{ 
                                                    position: 'absolute', 
                                                    left: `calc(${(cantidadRange[1] / 300) * 100}% - 20px)`, 
                                                    top: '-30px', 
                                                    width: '70px', 
                                                    textAlign: 'center',
                                                    cursor: 'pointer' 
                                                }}
                                                onDoubleClick={() => setEditingMax(true)}
                                            >
                                                Max: {cantidadRange[1]}
                                            </span>
                                        )}
                                    </div>
                                </Col>
                            </Form.Group>
                            <Button className="consultar-button" type="submit">
                                Buscar
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>

            {busquedaRealizada && !sliderModificado && ambienteDetails.length > 0 && (
                <div className="ambientedetails" style={{ height: "30rem", overflowY: "auto", maxHeight: "30rem" }}>
                    {ambienteDetails.map((ambiente, index) => (
                        <div key={index} className="datos1" style={{ marginBottom: '20px' }}>
                            <h4>{ambiente.nombre}</h4>
                            <p>Capacidad: {ambiente.capacidad}</p>
                            <p>Tipo de Ambiente: {ambiente.tipo}</p>
                            <p>Bloque: {ambiente.nombreBloque}</p>
                            <p>Piso: {ambiente.nroPiso}</p>
                        </div>
                    ))}
                </div>
            )}
            {busquedaRealizada && !sliderModificado && ambienteDetails.length === 0 && (
                <p>No se encontraron ambientes con el rango de cantidad seleccionado.</p>
            )}
        </div>
    );
};

export default BuscarCantidad;
