import axios from 'axios';

const apiUrl = process.env.REACT_APP_URL;

export const recuperarFechasSolicitud = () => {
    return axios.get(`${apiUrl}/fechasSolicitud`)
        .then(function (response) {
            return response.data;
        });
}

export const recuperarInformacionSolicitud = (identificador) => {
    return axios.post(`${apiUrl}/informacionSolicitud`, { id: identificador })
      .then(function (response) {
        return response.data; // Devuelve los datos de la solicitud
      })
      .catch(function (error) {
        console.log(error);
        return null; // Manejo del error: retorna null si hay un error en la búsqueda
      });
  };