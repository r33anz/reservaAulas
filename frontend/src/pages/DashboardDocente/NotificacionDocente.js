import { useEffect, useState } from "react";
import Notificacion from "../../components/Notificacion";
import echo from "../../Echo";

const NotificacionDocente = () => {

    const userID = sessionStorage.getItem('docente_id');

    useEffect(() => {
        if (userID) {
            console.log(`Subscribing to channel: usuario.${userID}`);
                const userChannel = echo.channel(`usuario.${userID}`);
                userChannel.listen('.NotificacionUsuario', (e) => {
                    alert(`Event received: ${e.message}`);
                });

                const broadcastChannel = echo.channel('broadcast');
                broadcastChannel.listen('.BroadcastNotification', (e) => {
                    alert(`Broadcast event received: ${e.message}`);
                });

            return () => {
                userChannel.stopListening('.NotificacionUsuario');
                echo.leaveChannel(`usuario.${userID}`);

                broadcastChannel.stopListening('.BroadcastNotification');
                echo.leaveChannel('broadcast');
            };
        }
    }, [userID]);

  return <Notificacion />;
}

export default NotificacionDocente;
