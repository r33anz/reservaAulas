import api from "./Comun.service";

const apiUrl = process.env.REACT_APP_URL;

export const recuperarSolicitudesDeReserva = (pagina, estado) => {
  return api
    .post(`${apiUrl}/verListas`, { pagina, estado })
    .then(function (response) {
      return response.data;
    });
};
export const recuperarSolicitudesDeReservaAceptadas = (id) => {
  return api.get(`${apiUrl}/solicitudesAceptadas`).then(function (response) {
    return response.data;
  });
};
export const recuperarSolicitudesDeReservaDocente = (pagina, estado, docente_id) => {
  return api
    .post(`${apiUrl}/docentes/reservas`, { pagina, estado, docente_id})
    .then(function (response) {
      return response.data;
    });
};
export const recuperarReservas = (id) => {
  return api
    .get(`${apiUrl}/docentes/reservas`)
    .then(function (response) {
      return response.data;
    });
};
export const cancelarReserva = (id) => {
  return api
    .put(`${apiUrl}/reservas/${id}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // Manejar cualquier error que ocurra durante la solicitud
      console.error("Error al cancelar la reserva:", error);
      throw error; // Lanzar el error para que pueda ser manejado en otro lugar si es necesario
    });
};

export const inhabilitarReserva = (ids) => {
  return api
    .put(`${apiUrl}/inhabilitarReserva/`,{idSolicitudes:ids})
    .then(function (response) {
      console.log(response);
      return response.data;
    })
    .catch(function (error) {
      
      console.log(error);
      return null;
    });
};
