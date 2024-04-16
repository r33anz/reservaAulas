import React from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegistrarAmbiente from './components/RegistrarAmbiente';
import Calendario from './components/Calendario';
import Home from './pages/Home';
import { AlertsProvider } from './components/Alert/AlertsContext';
import ModificarPeriodo from './components/ModificarPorPeriodo/ModicarPeriodo';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import ModificarEstadoDelAmbientePorFecha from './components/ModificarAmbiente/EstadoPorFecha';
import Buscar from "./components/Busquedanombre/Buscar";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AlertsProvider>
          <RegistrarAmbiente />
        </AlertsProvider>
      ),
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
        <AlertsProvider>
          <ModificarPeriodo />
        </AlertsProvider>
      )
    },
    {
      path: "modificarPorFecha",
      element: (
        <AlertsProvider>
          <ModificarEstadoDelAmbientePorFecha />
        </AlertsProvider>
      )
    },
    {
      path: "calendario",
      element: (
        <Calendario />
      )
    }, {
      path: "buscarPorNombre",
      element: (
        <Buscar />
      )
    }
  ]);

  return (
    <Home>
      <RouterProvider router={router} />
    </Home>
  );
}

export default App;
