import { useEffect, useState } from "react";
import Notificacion from "../../components/Notificacion";
import echo from "../../Echo";
import { getNotifications } from "../../services/Notification.service";
const NotificacionAdmin = ({ adminId }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async (adminId) => {
    const response = await getNotifications(adminId);
    setNotifications(response);
  };

  useEffect(() => {
    if (Number.isInteger(adminId)) {
      console.log(`Subscribing to channel: usuario.${adminId}`);
      fetchNotifications(adminId);
      const userChannel = echo.channel(`usuario.${adminId}`);
      userChannel.listen(".NotificacionUsuario", async (e) => {
        fetchNotifications(adminId);
      });

      return () => {
        userChannel.stopListening(".NotificacionUsuario");
        echo.leaveChannel(`usuario.${adminId}`);
      };
    }
  }, [adminId]);

  return <Notificacion notifications={notifications} id={adminId} fetchNotifications={fetchNotifications}/>;
};

export default NotificacionAdmin;
