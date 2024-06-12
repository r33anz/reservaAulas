import { useEffect, useState } from "react";
import Notificacion from "../../components/Notificacion";
import echo from "../../Echo";
import { getNotifications } from "../../services/Notification.service";

const NotificacionDocente = ({ docenteId }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async (docenteId) => {
    const response = await getNotifications(docenteId);
    setNotifications(response);
  };

  useEffect(() => {
    if (docenteId) {
      console.log(`Subscribing to channel: usuario.${docenteId}`);
      fetchNotifications(docenteId);
      const userChannel = echo.channel(`usuario.${docenteId}`);
      userChannel.listen(".NotificacionUsuario", async (e) => {
        fetchNotifications(docenteId);
      });

      const broadcastChannel = echo.channel("broadcast");
      broadcastChannel.listen(".BroadcastNotification", async (e) => {
        fetchNotifications(docenteId);
      });

      return () => {
        userChannel.stopListening(".NotificacionUsuario");
        echo.leaveChannel(`usuario.${docenteId}`);

        broadcastChannel.stopListening(".BroadcastNotification");
        echo.leaveChannel("broadcast");
      };
    }
  }, [docenteId]);

  return <Notificacion notifications={notifications} id={docenteId} />;
};

export default NotificacionDocente;
