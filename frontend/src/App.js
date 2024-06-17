import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AlertsProvider } from "./components/Alert/AlertsContext";
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { getNotifications } from "./services/Notification.service";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio/Inicio";
function App() {
  const [notifications, setNotifications] = useState([]);
  const [notificationsIdNotRead, setNotificationsIdNotRead] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchNotifications = async (docenteId) => {
    const response = await getNotifications(docenteId);
    setNotifications(response);
    const notificationsIdNotRead = response
      .filter((notification) => notification.read_at === null)
      .map((notification) => notification.id);
    setNotificationsIdNotRead(notificationsIdNotRead);
  };

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    setIsAuthenticated(auth === "true");
  }, []);

  return (
    <AlertsProvider>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route
          exact
          path="/usuario/:id"
          element={isAuthenticated ? (
              <Inicio
                fetchNotifications={fetchNotifications}
                notifications={notifications}
                notificationsIdNotRead={notificationsIdNotRead}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AlertsProvider>
  );
}

export default App;
