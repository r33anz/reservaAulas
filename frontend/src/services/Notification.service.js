import axios from "axios";

const apiUrl = process.env.REACT_APP_URL;

export const getNotifications = async (docenteId) => {
  return axios
    .get(`${apiUrl}/notificaciones/${docenteId}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return [];
    });
};

export const readNotification = async (docenteId, notificacionId) => {
  return axios
    .post(`${apiUrl}/marcarNotifiacionLeida`, {
      idUsuario: docenteId,
      notificacionId: notificacionId,
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return [];
    });
};
