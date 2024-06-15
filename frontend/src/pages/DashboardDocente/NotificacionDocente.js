import { useEffect } from "react";
import echo from "../../Echo";

const NotificacionDocente = ({ docenteId, fetchNotifications }) => {

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
  return (<></>);
};

export default NotificacionDocente;
