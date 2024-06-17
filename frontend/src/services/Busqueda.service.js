import api from "./Comun.service";

const apiUrl = process.env.REACT_APP_URL;

export const buscarAmbientePorNombre = () => {
  return api.get(`${apiUrl}/ambientes`)
    .then(function (response) {
      return response.data; // Devuelve los datos del ambiente encontrado
    })
    .catch(function (error) {
      console.log(error);
      return null; // Manejo del error: retorna null si hay un error en la búsqueda
    });
};

export const recuperarAmbientePorID = (nombre) => {
  return api.post(`${apiUrl}/busquedaAulaNew`, { patron: nombre })
    .then(function (response) {
      return response.data; // Devuelve los datos del ambiente encontrado
    })
    .catch(function (error) {
      console.log(error);
      return null; // Manejo del error: retorna null si hay un error en la búsqueda
    });
};
///busquedaAulaNew

/*export const recuperarAmbientePorID = (id) => {
  return axios.get(`${apiUrl}/ambiente/${id}`).then(function (response) {
    
    return response.data; // Devuelve los datos del ambiente encontrado
  });
};*/

export const buscarAmbientePorCantidad = (minCapacidad, maxCapacidad) => {
  return api.post(`${apiUrl}/buscarPorCapacidad`, { minCapacidad, maxCapacidad })
    .then(function (response) {
      return response.data; // Devuelve los datos de los ambientes encontrados
    })
    .catch(function (error) {
      console.error('Error al buscar ambientes por capacidad:', error);
      return null; // Manejo del error: retorna null si hay un error en la búsqueda
    });
};
