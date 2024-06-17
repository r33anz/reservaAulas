import api from "./Comun.service";

const apiUrl = process.env.REACT_APP_URL;

export const getSolicitudPorId = (solicitudId) => {
  return api
    .get(`${apiUrl}/${solicitudId}/recuperarInformacion`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
};

export const validarSolicitudAtentida = (solicitudId) => {
  return api
    .get(`${apiUrl}/solicitudAtendida/${solicitudId}`)
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
};

export const vertificarDisponibilidad = (fechaReserva, id, periodos) => {
  return api
    .post(`${apiUrl}/consultarFechaPeriodAmbiente`, {
      fechaReserva,
      ambiente: id,
      periodos,
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
};

export const aceptarSolicitud = (id) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return api
    .put(`${apiUrl}/aceptarSolicitud`, {
      idSolicitud: id,
      fechaAtendida: formattedDate,
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
};

export const rechazarSolicitud = (id, razonRechazo) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return api
    .put(`${apiUrl}/rechazarSolicitud`, {
      id,
      razonRechazo,
      fechaAtendida: formattedDate,
    })

    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
};
