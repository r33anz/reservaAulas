import React from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegistrarAmbiente from './components/RegistrarAmbiente';
import Calendario from './components/Calendario';
import Home from './pages/Home';
import { AlertsProvider } from './components/Alert/AlertsContext';
import ModificarPeriodo from './components/ModificarPorPeriodo/ModicarPeriodo';
import {
  Route,
  Routes,
} from "react-router-dom";
import ModificarEstadoDelAmbientePorFecha from './components/ModificarAmbiente/EstadoPorFecha';
import Buscar from "./components/Busquedanombre/Buscar";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />}>
        <Route index element={<Buscar />} />
        <Route exact path="/docente/buscarPorNombre" element={<Buscar />} />
        <Route exact path="/docente/enviarSolicitud" element="enviarSolicitud" />
        <Route exact path="/docente/listaDeSolicitudesDeReservaAceptadas" element="listaDeSolicitudesDeReservaAceptadas" />
        <Route exact path="/admin/listaDeSolicitudesDeReserva" element="listaDeSolicitudesDeReserva" />
        <Route exact path="/admin/buscarPorNombre" element={<Buscar />} />
        <Route exact path="/admin/registroAmbiente" element={
          <AlertsProvider>
            <RegistrarAmbiente />
          </AlertsProvider>
        } />
        <Route exact path="/admin/modificarPorPeriodo" element={
          <AlertsProvider>
            <ModificarPeriodo />
          </AlertsProvider>
        } />
        <Route exact path="/admin/modificarPorFecha" element={
          <AlertsProvider>
            <ModificarEstadoDelAmbientePorFecha />
          </AlertsProvider>
        } />
        <Route exact path="/admin/calendario" element={
          <Calendario />
        } />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes >
  );
}

export default App;
