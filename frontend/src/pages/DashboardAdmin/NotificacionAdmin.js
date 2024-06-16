import { useEffect, useState } from "react";
import echo from "../../Echo";
import { getNotifications } from "../../services/Notification.service";
const NotificacionAdmin = ({ adminId, fetchNotifications }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (adminId) {
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

  return <></>;
};

export default NotificacionAdmin;