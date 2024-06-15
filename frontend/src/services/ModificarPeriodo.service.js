import axios from 'axios';

const apiUrl = process.env.REACT_APP_URL;

export const buscarAmbientePorNombre = () => {
    return axios.get(`${apiUrl}/ambientes`)
        .then(function (response) {
            return response.data; // Devuelve los datos del ambiente encontrado
        })
        .catch(function (error) {
            console.log(error);
            return null; // Manejo del error: retorna null si hay un error en la búsqueda
        });
}

export const modificarPerio = (idAmbiente,fecha) => {
    return axios.post(`${apiUrl}/buscarInhabilitados`,{idAmbiente:idAmbiente, fecha:fecha })
        .then(function (response) {
            return response.data; // Devuelve los datos del ambiente encontrado
        })
        .catch(function (error) {
            console.log(error);
            return null; // Manejo del error: retorna null si hay un error en la búsqueda
        });
}

export const estadoinhabilitado = (idAmbiente, idPeriodos, fecha) => {
    return axios.post(`${apiUrl}/inhabilitarAmbiente`, {
            idAmbiente: idAmbiente,
            idPeriodos: idPeriodos,
            fecha: fecha
        })
        .then(function (response) {
            return response; // Devuelve los datos del ambiente encontrado
        })
        .catch(function (error) {
            console.log(error);
            return null; // Manejo del error: retorna null si hay un error en la búsqueda
        });
}

export const habilita = (idAmbiente, idPeriodos, fecha) => {
    return axios.delete(`${apiUrl}/habilitarAmbiente`, {data:{
            idAmbiente: idAmbiente,
            idPeriodos: idPeriodos.map((item)=>parseInt(item)),
            fecha: fecha
 } })
        .then(function (response) {
            return response; // Devuelve los datos del ambiente encontrado
        })
        .catch(function (error) {
            console.log(error);
            return null; // Manejo del error: retorna null si hay un error en la búsqueda
        });
}
export const getPeriodosReservados = (ambienteId, fecha) => {
    return axios
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
    return axios
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
    return axios
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