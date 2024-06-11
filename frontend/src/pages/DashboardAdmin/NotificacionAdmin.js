import { useEffect } from "react";
import Notificacion from "../../components/Notificacion";
import echo from "../../Echo";
const NotificacionAdmin = () => {
  const userID = sessionStorage.getItem("admin_id");

  useEffect(() => {
    if (userID) {
      console.log(`Subscribing to channel: usuario.${userID}`);
      const userChannel = echo.channel(`usuario.${userID}`);
      userChannel.listen(".NotificacionUsuario", (e) => {
        alert(`Event received: ${e.message}`);
      });

      return () => {
        userChannel.stopListening(".NotificacionUsuario");
        echo.leaveChannel(`usuario.${userID}`);
      };
    }
  }, [userID]);

  return <Notificacion />;
};

export default NotificacionAdmin;
