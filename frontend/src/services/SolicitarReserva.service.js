import api from './Comun.service';

const apiUrl = process.env.REACT_APP_URL;

export const razon = () => {
   
    return [
        { id: 1, name: "Primer Parcial"},
        { id: 2, name: "Segundo Parcial"},
        { id: 3, name: "Examen Final"},
        { id: 4, name: "Segunda Instancia"},
        { id: 5, name: "Examen de mesa"},
    ];

} 


export const getDocente = (id) => {
    return api.get(`${apiUrl}/docentes/${id}`)
    .then(function (response) {
      console.log(response.data);
      return response.data; // Devuelve los datos del ambiente encontrado
    });
  };

  export const busquedaCantidad = (reserva) => {
    console.log(reserva);
    return api.post(`${apiUrl}/buscarCantidadFechaPeriodo`, reserva)
      .then(function(response) {
        //console.log(response.data);
        return response.data;
      })
      .catch(function(error) {
        return error.message;
      });
  };
  export const postReserva = (reserva) => {
    console.log(reserva);
    return api.post(`${apiUrl}/realizarSolicitud`, reserva)
      .then(function(response) {
        console.log(response);
        return response.data;
      })
      .catch(function(error) {
        console.log("response");
        if (error.response) {
          console.log(error.response.data);
          return Promise.reject(error.response.data);
        } else if (error.request) {
          console.log(error.request);
          return Promise.reject(error.request);
        } else {
          console.log("Error", error.message);
          return Promise.reject(error.message);
        }
      });
  };
  
  export const postReserva2 = (reserva) => {
    console.log(reserva);
    return api.post(`${apiUrl}/realizarSolicitudP2`, reserva)
      .then(function(response) {
        console.log(response.data);
        return response.data;
      })
      .catch(function(error) {
        console.log("response");
        if (error.response) {
          console.log(error.response.data);
          return Promise.reject(error.response.data);
        } else if (error.request) {
          console.log(error.request);
          return Promise.reject(error.request);
        } else {
          console.log("Error", error.message);
          return Promise.reject(error.message);
        }
      });
  };

export const recuperarAmbientePorID = (id) => {
    return api.get(`${apiUrl}/ambiente/${id}`).then(function (response) {
      
      return response.data; // Devuelve los datos del ambiente encontrado
    });
  };