import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/image.png";
import "./style.css";
import { login } from "../../services/Authenticacion.service";
import { AlertsContext } from "../../components/Alert/AlertsContext";
import {
  Book,
  Compass,
  ExclamationCircleFill,
  People,
} from "react-bootstrap-icons";

const Login = () => {
  const { agregarAlert } = useContext(AlertsContext);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const { email, password } = values;
    const response = await login(email, password);
    if (response !== null) {
      navigate(`/usuario/${response.user.id}`);
      sessionStorage.setItem("auth", "true");
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
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
  });

  useEffect(() => {
    sessionStorage.setItem("auth", "false");
  }, []);

  return (
    <Container fluid style={{ background: "#003f702e", height: "95%" }}>
      <Row md="auto" lg="auto" xl="auto" style={{ height: "100%" }}>
        <Col
          md="9"
          xs="7"
          lg="6"
          xl="6"
          className="text-white align-content-center"
          style={{ background: "#003f70", height: "100%", width: "50%" }}
        >
          <div className="justify-content-center" style={{ display: "grid" }}>
            <div
              className="text-start "
              style={{ width: "80%", marginLeft: "10%" }}
            >
              <h1 className="Login-titulo-ventajas">Reserva tu ambiente</h1>
              <p className="">
                Disfruta de los beneficios de tener un espacio de estudio en la
                universidad.
              </p>
            </div>
            <div style={{ width: "80%", marginLeft: "10%" }}>
              <div className="">
                <div className="">
                  <h4 className="Login-subtitulo">
                    <Book className="" /> Espacio de estudio tranquilo
                  </h4>
                  <p className="">
                    Encuentra un lugar cómodo y silencioso para concentrarte.
                  </p>
                </div>
              </div>
              <div className="">
                <div>
                  <h4 className="Login-subtitulo">
                    <Compass className="" /> Acceso a recursos
                  </h4>
                  <p className="">
                    Aprovecha los recursos de la universidad para tu
                    aprendizaje.
                  </p>
                </div>
              </div>
              <div className="">
                <div>
                  <h4 className="Login-subtitulo">
                    <People className="" /> Colaboración con otros
                  </h4>
                  <p className="">
                    Trabaja en equipo y comparte conocimientos con tus
                    compañeros.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col xs="5" md="8" lg="5" xl="6" className="align-self-center">
          <Row className="justify-content-center">
            <Col
              xs="auto"
              md="auto"
              lg="auto"
              xl="auto"
              style={{ width: "22rem" }}
            >
              <div className="text-center" style={{ width: "100%" }}>
                <Image
                  src={logo}
                  style={{ width: "40%", height: "40%" }}
                  fluid
                  class="img-fluid"
                  alt="Logo"
                />
                <h1
                  className="Login-aulapro"
                  style={{ fontWeight: "bold", paddingTop: "0.5rem" }}
                >
                  Aula
                  <span>Pro</span>
                </h1>
              </div>
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
                    <div className="text-end" style={{ width: "100%" }}>
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
                        Iniciar Sesion
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
