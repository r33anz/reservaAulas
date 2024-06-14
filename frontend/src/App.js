import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import { AlertsProvider } from "./components/Alert/AlertsContext";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import DashboardDocente from "./pages/DashboardDocente";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardAdmin2 from "./pages/InicioAdmin/Inicio";
import DashboardDocente2 from "./pages/InicioDocente/IniDocente";
function App() {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <Routes>
      <Route exact path="/" element={
        <AlertsProvider>
          <Home setShowCalendar={setShowCalendar} showCalendar={showCalendar} />
        </AlertsProvider>
      }>
        <Route exact path="/docente/:id" element={<DashboardDocente showCalendar={showCalendar} />} />
        <Route exact path="/admin" element={<DashboardAdmin showCalendar={showCalendar} />} />
        <Route exact path="/admin2" element={<DashboardAdmin2 showCalendar={showCalendar} />} />
        <Route exact path="/docente2/:id" element={<DashboardDocente2 showCalendar={showCalendar} />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
