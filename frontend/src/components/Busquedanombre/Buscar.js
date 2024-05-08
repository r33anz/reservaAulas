import React, { useState, useEffect, useRef } from "react";
import { buscarAmbientePorNombre, recuperarAmbientePorID } from '../../services/Busqueda.service';
import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import { XSquareFill } from "react-bootstrap-icons";
import './Style.css';
import { useFormik } from "formik";
import * as Yup from "yup";

const Buscar = () => {
    const [ambientes, setAmbientes] = useState([]);
    const [show, setShow] = useState("");
    const inputAmbienteRef = useRef();

    const [ambienteDetails, setAmbienteDetails] = useState([]); // Cambiar a array para almacenar detalles de varios ambientes

    const [enterPressed, setEnterPressed] = useState(false);

    const buscarAmbiente = async (event) => {
        if (event.hasOwnProperty('target') && event.target.hasOwnProperty('value')) {
            const value = event.target.value;
            formik.setFieldValue("ambiente", { ...formik.values.ambiente, nombre: value });
            const { respuesta } = await buscarAmbientePorNombre(value);
            setAmbientes(respuesta);
            setAmbienteDetails([]);
        }
    };

    const formik = useFormik({
        initialValues: {
            ambiente: { nombre: "", id: "" },
            fecha: "",
        },
        validationSchema: Yup.object({
            ambiente: Yup.object().shape({
                nombre: Yup.string()
                    .required("Obligatorio")
                    .test('hasOptions', 'No existe ese ambiente', function (value) {
                        return ambientes.length > 0;
                    })
            })
        }),
        onSubmit: values => {
            inputAmbienteRef.current.blur();
            setAmbienteDetails([]);
          if (ambientes.length > 0) {
            for (let i = 0; i < ambientes.length; i++) {
                recuperar(ambientes[i].id);
            }
            //console.log(ambientes);
        } else {
                setAmbienteDetails([]); // Limpiar los detalles del ambiente en caso de no encontrar coincidencias
                setEnterPressed(true);
            }
            inputAmbienteRef.current.blur();
        }
    });

    const setNombreDelAmbiente = (ambiente) => {
        formik.setFieldValue("ambiente", { id: ambiente.id, nombre: ambiente.nombre });
        setAmbienteDetails([]);
        recuperar(ambiente.id);
        setShow("")
        
    };

    useEffect(() => {
        function handleClickOutside() {
            setShow("")
        }
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const recuperar = (id) => {
        recuperarAmbientePorID(id)
            .then(data => {
                // Almacenar los detalles del ambiente en el array
                setAmbienteDetails(prevDetails => [...prevDetails, data]);
                
                setShow("");
            })
            .catch(error => {
                console.log('Error al buscar el ambiente:', error);
                setAmbienteDetails([]); // Limpiar los detalles del ambiente en caso de error
            });
    };

    return (
        <div className="buscarcontainer" style={{ width: "574px" }}>
            <Container className="ModificarEstadoDelAmbientePorFecha-header" fluid>
                <Row xs="auto" className="justify-content-md-end">
                    <Col xs lg="10" style={{ alignContent: "center", padding: 0 }}>
                        <h4 style={{ color: "white", fontWeight: "bold" }}>Búsqueda por nombre</h4>
                    </Col>
                    <Button className="ModificarEstadoDelAmbientePorFecha-header-button-close" style={{ width: "58px", height: "58px" }} >
                        <XSquareFill style={{ width: "24px", height: "24px" }} />
                    </Button>
                </Row>
            </Container>
            <Container className="ModificarEstadoDelAmbientePorFecha-body" fluid>
                <Row className="justify-content-md-center">
                    <Col xs lg="9">
                        <Form onSubmit={formik.handleSubmit}>
                            <Form.Group as={Row} className="mb-3" controlId="ambiente">
                                <Form.Label column sm="2">Nombre</Form.Label>
                                <Col sm="8">
                                    <Dropdown id="ambientes">
                                        <Dropdown.Toggle
                                            ref={inputAmbienteRef}
                                            as={"input"}
                                            id="ambiente"
                                            type="text"
                                            placeholder="Ingrese el nombre del ambiente"
                                            onChange={buscarAmbiente}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.ambiente.nombre}
                                            className="form-control"
                                            bsPrefix="dropdown-toggle" />
                                        {formik.values.ambiente.nombre !== "" &&
                                            <Dropdown.Menu className={show} style={{ width: "100%", overflowY: "auto", maxHeight: "5rem" }} show>
                                                {ambientes.map((ambiente) =>
                                                    <Dropdown.Item
                                                        key={ambiente.nombre}
                                                        onClick={() => setNombreDelAmbiente(ambiente)}>
                                                        {ambiente.nombre}
                                                    </Dropdown.Item>)}
                                            </Dropdown.Menu>}
                                    </Dropdown>
                                    <Form.Text className="text-danger">
                                        {formik.touched.ambiente && formik.errors.ambiente ? (
                                            <div className="text-danger">{formik.errors.ambiente.nombre}</div>
                                        ) : null}
                                    </Form.Text>
                                </Col>
                            </Form.Group>
                            <Button style={{ background: "#D9D9D9", borderColor: "#D9D9D9" }} type="submit"></Button>
                        </Form>
                    </Col>
                </Row>
            </Container>

            {/* Mostrar los detalles de cada ambiente */}
            {ambienteDetails.length > 0 && (
    <div className="ambientedetails" style={{ height:"30rem",overflowY: "auto", maxHeight: "30rem" }}>
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


            {/* Mostrar mensaje si no se encuentra ningún ambiente */}
            {enterPressed && ambienteDetails.length === 0 && (
                <div className="noexiste" style={{ marginLeft: "40px" }}>
                    <h1>No existe el aula</h1>
                </div>
            )}
        </div>
    );
};

export default Buscar;
