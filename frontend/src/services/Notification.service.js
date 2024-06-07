import axios from "axios";

const apiUrl = process.env.REACT_APP_URL;

export const getNotifications = async (docenteId) => {
  return axios
    .get(`${apiUrl}/todasNotificaciones/${docenteId}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return [];
    });
};

export const readNotification = async (docenteId, notificacionesId) => {
  return axios
    .post(`${apiUrl}/marcarNotifiacionesLeidas`, {
      idUsuario: docenteId,
      notificacionesID: notificacionesId,
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return [];
    });
};
