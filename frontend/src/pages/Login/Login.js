import { Formik } from "formik";
import React, { useContext, useState } from "react";
import * as Yup from "yup";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/image.png";
import "./style.css";
import { login } from "../../services/Authenticacion.service";
import { AlertsContext } from "../../components/Alert/AlertsContext";
import { ExclamationCircleFill } from "react-bootstrap-icons";

const Login = () => {
  const { agregarAlert } = useContext(AlertsContext);
  const navigate = useNavigate();

  const handleLogin = async(values) => {
    const { email, password } = values;
    const response = await login(email, password);
    if (response !== null) {
      navigate(`/usuario/${response.user.id}`);
    } else {
      agregarAlert({
        icon: <ExclamationCircleFill />,
        severidad: "warning",
        mensaje: "Credenciales incorrectas",
      });
    }
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("Requerido"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido")
  });

  return (
    <Container fluid style={{ background: "#003f702e"}}>
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
              handleLogin(values);
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
