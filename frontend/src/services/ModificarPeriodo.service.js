import api from "./Comun.service";

const apiUrl = process.env.REACT_APP_URL;

export const buscarAmbientePorNombre = () => {
  return api
    .get(`${apiUrl}/ambientes`)
    .then(function (response) {
      return response.data; // Devuelve los datos del ambiente encontrado
    })
    .catch(function (error) {
      console.log(error);
      return null; // Manejo del error: retorna null si hay un error en la búsqueda
    });
};

export const modificarPerio = (idAmbiente, fecha) => {
  return api
    .post(`${apiUrl}/buscarInhabilitados`, {
      idAmbiente: idAmbiente,
      fecha: fecha,
    })
    .then(function (response) {
      return response.data; // Devuelve los datos del ambiente encontrado
    })
    .catch(function (error) {
      console.log(error);
      return null; // Manejo del error: retorna null si hay un error en la búsqueda
    });
};

export const estadoinhabilitado = (idAmbiente, idPeriodos, fecha) => {
  return api
    .post(`${apiUrl}/inhabilitarAmbiente`, {
      idAmbiente: idAmbiente,
      idPeriodos: idPeriodos,
      fecha: fecha,
    })
    .then(function (response) {
      return response; // Devuelve los datos del ambiente encontrado
    })
    .catch(function (error) {
      console.log(error);
      return null; // Manejo del error: retorna null si hay un error en la búsqueda
    });
};

export const habilita = (idAmbiente, idPeriodos, fecha) => {
  return api
    .delete(`${apiUrl}/habilitarAmbiente`, {
      data: {
        idAmbiente: idAmbiente,
        idPeriodos: idPeriodos.map((item) => parseInt(item)),
        fecha: fecha,
      },
    })
    .then(function (response) {
      return response; // Devuelve los datos del ambiente encontrado
    })
    .catch(function (error) {
      console.log(error);
      return null; // Manejo del error: retorna null si hay un error en la búsqueda
    });
};
export const getPeriodosReservados = (ambienteId, fecha) => {
  return api
    .get(`${apiUrl}/periodosReservados/${fecha}/${ambienteId}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
};
export const getPeriodosSolicitados = (ambienteId, fecha) => {
  return api
    .get(`${apiUrl}/periodosSolicitados/${fecha}/${ambienteId}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
};
export const inhabilitarReserva = (ids) => {
  return api
    .put(`${apiUrl}/inhabilitarReserva/`, { idSolicitudes: ids })
    .then(function (response) {
      console.log(response);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
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
