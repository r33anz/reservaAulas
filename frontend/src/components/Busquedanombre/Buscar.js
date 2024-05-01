import React, { useState, useEffect, useRef } from "react";
import { buscarAmbientePorNombre, recuperarAmbientePorID } from '../../services/Busqueda.service';
import {  Button, Col, Container, Dropdown, Form,  Row} from "react-bootstrap";
import {  XSquareFill } from "react-bootstrap-icons";
import './Style.css';
import { useFormik } from "formik";
import * as Yup from "yup";

const Buscar = () => {
  const [ambientes, setAmbientes] = useState([]);
  const [show, setShow] = useState("");
  const inputAmbienteRef = useRef();
  

  const [ambienteDetails, setAmbienteDetails] = useState(null); // Estado para almacenar los detalles del ambiente

  const [enterPressed, setEnterPressed] = useState(false);
  // Función para buscar los ambientes que coinciden con el nombre
  const buscarAmbiente = async (event) => {
    console.log(event.target.value);
    if (event.hasOwnProperty('target') && event.target.hasOwnProperty('value')) {
        const value = event.target.value
        formik.setFieldValue("ambiente", { ...formik.values.ambiente, nombre: value })
        const { respuesta } = await buscarAmbientePorNombre(value);
        
        setAmbientes(respuesta)
        
        //setShow("show")
    }
}

  const formik = useFormik({
    initialValues: {
        ambiente: { nombre: "", id: "" },
        fecha: "",
    },
    validationSchema: Yup.object({
        ambiente: Yup.object().shape({
            nombre: Yup.string()
                .required("Obligatorio")
                .test('hasOptions', 'No exite ese ambiente', function(value) {
                  // 'this.options' contiene las opciones que pasas al esquema de validación
                  if(ambientes.length>0){
                    
                    return true;
                  }else{
                    
                    return false;
                  }
              })
        })
    }),
    onSubmit: values => {
      if ( ambientes.length>0 ) {
        recuperar(ambientes[0].id);
        //setAmbientes([]);
        //setShow("")
        console.log(show);
        //document.removeEventListener('click', handleClickOutside);
          console.log(ambientes[0].id);
        // Si no se ha seleccionado ninguna opción con las flechas, seleccionar la primera opción si está disponible
      }else{
        console.log("no existe");
        setAmbienteDetails(null);
        setEnterPressed(true);
        
      }
      
    }
});

const setNombreDelAmbiente = (ambiente) => {
  formik.setFieldValue("ambiente", { id: ambiente.id, nombre: ambiente.nombre });
  console.log(ambiente.id);
  recuperar(ambiente.id);
  setShow("")
}

 

  useEffect(() => {
    function handleClickOutside() {
      //setAmbientes([]); // Limpiar las opciones de ambiente al hacer clic fuera del campo
      setShow("")
    }
    // Agregar un event listener para hacer clic fuera del campo de entrada
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Recuperar los datos del ambiente por su ID
  const recuperar = (id) => {
    recuperarAmbientePorID(id)
      .then(data => {
        // Actualizar estado con los detalles del ambiente
        setAmbienteDetails(data);
        setShow("")
      })
      .catch(error => {
        console.log('Error al buscar el ambiente:', error);
        setAmbienteDetails(null); // Limpiar los detalles del ambiente en caso de error
      });
  };

  return (
    
    <div className="buscarcontainer"style={{ width: "574px",height: "400px" }}><Container className="ModificarEstadoDelAmbientePorFecha-header" fluid >
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
                                                        onClick={() => setNombreDelAmbiente(ambiente) }
                                                    >
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
                            <Button style={{ background: "#D9D9D9", borderColor:"#D9D9D9" }} type="submit"></Button>
                        </Form>
                    </Col>
                </Row>
            </Container>

      {ambienteDetails !== null ? ambientes.length>0 && (
  <div className="ambientedetails">
    <h1>Detalle</h1>
    <div className="datos">
      <p>Nombre: {ambienteDetails.nombre}</p>
      <p>Capacidad: {ambienteDetails.capacidad}</p>
      <p>Tipo de Ambiente: {ambienteDetails.tipo}</p>
      <p>Bloque: {ambienteDetails.nombreBloque}</p>
      <p>Piso: {ambienteDetails.nroPiso}</p>
    </div>
  </div>
) :  enterPressed && (
  <div className="noexiste" style={{marginLeft: "40px"}}>
    <h1>No existe el aula</h1>
  </div>
)}
    </div>
  );
};

export default Buscar;