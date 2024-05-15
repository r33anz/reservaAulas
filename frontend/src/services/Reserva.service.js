import axios from "axios";

const apiUrl = process.env.REACT_APP_URL;

export const recuperarSolicitudesDeReserva = (pagina, estado) => {
  return axios
    .post(`${apiUrl}/verListas`, { pagina, estado })
    .then(function (response) {
      return response.data;
    });
};
export const recuperarSolicitudesDeReservaAceptadas = (id) => {
  return axios.get(`${apiUrl}/solicitudesAceptadas`).then(function (response) {
    return response.data;
  });
};
export const recuperarSolicitudesDeReservaDocente = (pagina, estado, docente_id) => {
  return axios
    .post(`${apiUrl}/docentes/reservas`, { pagina, estado, docente_id})
    .then(function (response) {
      return response.data;
    });
};
export const recuperarReservas = (id) => {
  return axios
    .get(`${apiUrl}/docentes/reservas`)
    .then(function (response) {
      return response.data;
    });
};
export const cancelarReserva = (id) => {
  return axios
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
