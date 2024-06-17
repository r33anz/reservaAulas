import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import { AlertsProvider } from "./components/Alert/AlertsContext";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import DashboardDocente from "./pages/DashboardDocente";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardAdmin2 from "./pages/InicioAdmin/InicioAdmin";
import DashboardDocente2 from "./pages/InicioDocente/IniDocente";
import { getNotifications } from "./services/Notification.service";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio/Inicio";
function App() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsIdNotRead, setNotificationsIdNotRead] = useState([]);

  const fetchNotifications = async (docenteId) => {
    const response = await getNotifications(docenteId);
    setNotifications(response);
    const notificationsIdNotRead = response
      .filter((notification) => notification.read_at === null)
      .map((notification) => notification.id);
    setNotificationsIdNotRead(notificationsIdNotRead);
  };

  return (
    <Routes>
      <Route
        exact
        path="/docente/:id"
        element={<DashboardDocente showCalendar={showCalendar} />}
      />
      <Route
        exact
        path="/admin"
        element={<DashboardAdmin showCalendar={showCalendar} />}
      />
      <Route
        exact
        path="/admin2"
        element={<DashboardAdmin2 showCalendar={showCalendar} />}
      />
      <Route
        exact
        path="/docente2/:id"
        element={
          <DashboardDocente2
            showCalendar={showCalendar}
            fetchNotifications={fetchNotifications}
            notifications={notifications}
            notificationsIdNotRead={notificationsIdNotRead}
          />
        }
      />
      <Route
        exact
        path="/usuario/:id"
        element={
          <Inicio
            fetchNotifications={fetchNotifications}
            notifications={notifications}
            notificationsIdNotRead={notificationsIdNotRead}
          />
        }
      />
      <Route exact path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
