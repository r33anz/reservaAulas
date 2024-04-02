import React from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegistrarAmbiente from './components/RegistrarAmbiente';
import Calendario from './components/Calendario';
import Home from './pages/Home';
import { AlertsProvider } from './components/Alert/AlertsContext';
import ModificarPeriodo from './components/ModificarPorPeriodo/ModicarPeriodo';
import Home from './pages/Home';
import { AlertsProvider } from './components/Alert/AlertsContext';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import RegistrarAmbiente from './components/RegistrarAmbiente';
import ModificarEstadoDelAmbientePorFecha from './components/ModificarAmbiente/EstadoPorFecha';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: "",
    },
    {
      path: "registroAmbiente",
      element: (
        <AlertsProvider>
          <RegistrarAmbiente />
        </AlertsProvider>
      ),
    },
    {
      path: "modificarPorPeriodo",
      element: (
        <ModificarPeriodo />
      )
    },
    {
      path: "modificarPorFecha",
      element: (
        <ModificarEstadoDelAmbientePorFecha />
      )
    }
  ]);

  return (
    <Home>
      <AlertsProvider>
        <ModificarPeriodo />
      </AlertsProvider>
      <Calendario />
      <Buscar></Buscar>
      <RegistrarAmbiente />
      <RouterProvider router={router} />
    </Home>
  );
}

export default App;
