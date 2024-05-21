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
import ListaDeSolicitudes from "./components/ListaDeSolicitudes";
import SolcitarReserva from "./components/SolicitudReserva/SolicitarReserva"
import AtenderSolicitud from "./components/AtenderSolicitud/AtenderSolicitud";
import CancelarReservas from "./components/CancelarReserva/CancelarReservas";
function App() {

  return (
    <Routes>
      <Route exact path="/" element={
        <AlertsProvider>
          <Home />
        </AlertsProvider>
      }>
        <Route index element={<Buscar />} />
        <Route exact path="/docente/buscarPorNombre" element={<Buscar />} />
        <Route exact path="/docente/atenderSolicitud" element={<AtenderSolicitud solicitudId={2} />} />
        <Route exact path="/docente/enviarSolicitud" element={<SolcitarReserva />} />
        
        <Route exact path="/docente/listaDeSolicitudesDeReservaAceptadas" element={
          <ListaDeSolicitudes tipoDeUsuario="Docente" titulo="Lista de Solicitudes de Reserva Aceptadas" />
        } />
        <Route exact path="/admin/listaDeSolicitudesDeReservaPorLlegada" element={
          <ListaDeSolicitudes tipoDeUsuario="Admin" titulo="Lista de Solicitudes de Reserva Por Llegada" />
        } />
        <Route exact path="/docente/listaReservas" element={
          <CancelarReservas tipoDeUsuario="Docente" titulo="Lista de Solicitudes y Reservas" />
        } />
        <Route exact path="/admin/buscarPorNombre" element={<Buscar />} />
        <Route exact path="/admin/registroAmbiente" element={
          <RegistrarAmbiente />
        } />
        <Route exact path="/admin/modificarPorPeriodo" element={
          <ModificarPeriodo />
        } />
        <Route exact path="/admin/modificarPorFecha" element={
          <ModificarEstadoDelAmbientePorFecha />
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
