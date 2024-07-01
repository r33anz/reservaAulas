import React, { useState, useEffect, useRef } from "react";
import {
  buscarAmbientePorNombre,
  recuperarAmbientePorID,
} from "../../services/Busqueda.service";
import { Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import "./Style.css";
import { useFormik } from "formik";
import * as Yup from "yup";

const Buscar = () => {
  const [ambientes, setAmbientes] = useState([]);
  const [show, setShow] = useState("");
  const inputAmbienteRef = useRef();
  const [showDropdown, setShowDropdown] = useState(false);
  const [ambienteDetails, setAmbienteDetails] = useState([]); // Cambiar a array para almacenar detalles de varios ambientes

  const buscarAmbiente = async (event) => {
    if (
      event.hasOwnProperty("target") &&
      event.target.hasOwnProperty("value")
    ) {
      const originalValue = event.target.value;
      const trimmedValue = originalValue.trim(); // Eliminar espacios al inicio y al final

      if (trimmedValue === "") {
        formik.setFieldValue("ambiente", {
          ...formik.values.ambiente,
          nombre: "",
        });
        setShowDropdown(false);
      } else if (!trimmedValue.startsWith(" ")) {
        // Verificar si el primer carácter no es un espacio
        const value = originalValue.toUpperCase(); // Convertir a mayúsculas si pasa la validación del espacio inicial

        if (/^[a-zA-Z0-9\s]*$/.test(value)) {
          // Hacemos visible el dropdown solo si hay coincidencias
          setShowDropdown(
            ambientes.some((ambiente) =>
              ambiente.nombre.toLowerCase().includes(value.toLowerCase())
            )
          );

          formik.setFieldValue("ambiente", {
            ...formik.values.ambiente,
            nombre: value,
          });
        }
      }
    }
  };

  const buscar = async () => {
    const response = await buscarAmbientePorNombre();
    if (response !== null) {
      setAmbientes(response.respuesta);
      console.log(ambientes);
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
          .test("hasOptions", "No existe ese ambiente", function (value) {
            const trimmedValue = value.trim(); // Eliminar espacios al final del valor
            return ambientes.some((ambiente) =>
              ambiente.nombre.toLowerCase().includes(trimmedValue.toLowerCase())
            );
          }),
      }),
    }),
    onSubmit: (values) => {
      //setAmbienteDetails([]);
      setShowDropdown(false);
      if (ambientes.length > 0) {
        console.log(formik.values.ambiente.nombre);
        recuperar(formik.values.ambiente.nombre);
        //console.log(ambientes);
      } else {
        //setAmbienteDetails([]); // Limpiar los detalles del ambiente en caso de no encontrar coincidencias
      }
      setShowDropdown(false);
      inputAmbienteRef.current.blur();
    },
  });

  const setNombreDelAmbiente = (ambiente) => {
    formik.setFieldValue("ambiente", {
      id: ambiente.id,
      nombre: ambiente.nombre,
    });
    setAmbienteDetails([]);
    recuperar(ambiente.nombre);
    setShowDropdown(false);
  };

  useEffect(() => {
    function handleClickOutside() {
      setShowDropdown(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const recuperar = (id) => {
    recuperarAmbientePorID(id)
      .then((data) => {
        // Almacenar los detalles del ambiente en el array
        setAmbienteDetails(data.coincidencias);
        console.log(ambienteDetails);
        setShow("");
      })
      .catch((error) => {
        console.log("Error al buscar el ambiente:", error);
        setAmbienteDetails([]); // Limpiar los detalles del ambiente en caso de error
      });
  };

  useEffect(() => {
    buscar();
  }, []);

  return (
    <div className="BusquedaPorNombre-container">
      <Container className="BusquedaPorNombre-header" fluid>
        <Row xs="auto" className="text-white justify-content-end">
          <Col
            xs="12"
            className="d-flex justify-content-start align-items-center"
            style={{ height: "3rem", padding: 0, paddingLeft: "0.5rem" }}
          >
            <h5 style={{ fontWeight: "bold" }}>Buscar por nombre</h5>
          </Col>
        </Row>
      </Container>
      <Container className="BusquedaPorNombre-body" fluid>
        <Row className="justify-content-center">
          <Col xs lg="11">
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group as={Row} className="mb-3" controlId="ambiente">
                <Form.Label column sm="1">
                  Nombre
                </Form.Label>
                <Col sm="10">
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
                      bsPrefix="dropdown-toggle"
                    />
                    {ambientes.filter((ambiente) =>
                      ambiente.nombre
                        .toLowerCase()
                        .includes(
                          formik.values.ambiente.nombre.trim().toLowerCase()
                        )
                    ).length > 0 &&
                      formik.values.ambiente.nombre !== "" && (
                        <Dropdown.Menu
                          class={`dropdown-menu ${showDropdown ? "show" : ""}`}
                          style={{
                            width: "100%",
                            overflowY: "auto",
                            maxHeight: "5rem",
                          }}
                          show
                        >
                          {ambientes
                            .filter((ambiente) =>
                              ambiente.nombre
                                .toLowerCase()
                                .includes(
                                  formik.values.ambiente.nombre
                                    .trim()
                                    .toLowerCase()
                                )
                            )

                            .map((ambiente) => (
                              <Dropdown.Item
                                key={ambiente.nombre}
                                onClick={() => setNombreDelAmbiente(ambiente)}
                              >
                                {ambiente.nombre}
                              </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                      )}
                  </Dropdown>
                  <Form.Text className="text-danger">
                    {formik.touched.ambiente && formik.errors.ambiente ? (
                      <div className="text-danger">
                        {formik.errors.ambiente.nombre}
                      </div>
                    ) : null}
                  </Form.Text>
                </Col>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>

      {/* Mostrar los detalles de cada ambiente */}
      <Row className="BusquedaPorNombre-ambientedetails">
        {ambienteDetails.length > 0 &&
          ambienteDetails.map((ambiente, index) => (
            <Col key={index} sm={3}>
              <div className="datos2">
                <h6>{ambiente.nombre}</h6>
                <p>Capacidad: {ambiente.capacidad}</p>
                <p>Tipo de Ambiente: {ambiente.tipo}</p>
                <p>Bloque: {ambiente.nombreBloque}</p>
                <p>Piso: {ambiente.nroPiso}</p>
              </div>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default Buscar;
