import { Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/image.png";
import "./style.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     // Aquí normalmente harías una llamada a la API para autenticar al usuario
  //     if (email === "user@example.com" && password === "password") {
  //       // Guarda el estado de autenticación (puede ser en localStorage o en un contexto global)
  //       localStorage.setItem("auth", "true");
  //       navigate("/admin2");
  //     } else {
  //       alert("Credenciales incorrectas");
  //     }
  //   };

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("Requerido"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
  });

  const handleSubmit = (values) => {
    const { email, password } = values;
    if (email === "user@example.com" && password === "password") {
      localStorage.setItem("auth", "true");
      window.location.href = "/dashboard";
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <Container fluid>
      <Row md="auto" lg="auto" xl="auto" style={{ height: "90vh" }}>
        <Col
          md="9"
          xs="7"
          lg="6"
          xl="5"
          className="text-end align-self-center"
        >
          <Image
            src={logo}
            style={{ width: "50%", height: "50%" }}
            fluid
            class="img-fluid"
            alt="Logo"
          />
        </Col>
        <Col xs="5" md="8" lg="5" xl="4" className="align-self-center">
          <h1
            class="lead fw-normal mb-0 me-3"
            style={{ paddingBottom: "1rem" }}
          >
            Inicio Sesion
          </h1>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values);
              setSubmitting(false);
            }}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              touched,
              errors,
              isSubmitting,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Correo</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={touched.email && errors.email}
                    placeholder="Ingrese correo"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={touched.password && errors.password}
                    placeholder="Ingrese contraseña"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  className="btn Login-button-login"
                  type="submit"
                  size="sm"
                  style={{
                    marginTop: "1rem",
                    paddingLeft: "2.5rem",
                    paddingRight: "2.5rem",
                  }}
                  disabled={isSubmitting}
                >
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
