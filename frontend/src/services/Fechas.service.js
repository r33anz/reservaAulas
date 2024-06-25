import api from './Comun.service';

const apiUrl = process.env.REACT_APP_URL;

export const recuperarFechasSolicitud = () => {
    return api.get(`${apiUrl}/fechasSolicitud`)
        .then(function (response) {
            return response.data;
        });
}

export const recuperarInformacionSolicitud = (identificador) => {
    return api.post(`${apiUrl}/informacionSolicitud`, { id: identificador })
      .then(function (response) {
        return response.data; // Devuelve los datos de la solicitud
      })
      .catch(function (error) {
        console.log(error);
        return null; // Manejo del error: retorna null si hay un error en la búsqueda
      });
  };
  export const recuperarReserva = (identificador) => {
    console.log(identificador);
    return api.get(`${apiUrl}/reservas/${identificador}`)
      .then(function (response) {
        
        return response.data; // Devuelve los datos de la solicitud
      })
      .catch(function (error) {
        console.log(error);
        return null; // Manejo del error: retorna null si hay un error en la búsqueda
      });
  };
  export const recuperarSolicitud = (identificador) => {
    return api.get(`${apiUrl}/solicitud/${identificador}`)
      .then(function (response) {
        return response.data; // Devuelve los datos de la solicitud
      })
      .catch(function (error) {
        console.log(error);
        return null; // Manejo del error: retorna null si hay un error en la búsqueda
      });
  };