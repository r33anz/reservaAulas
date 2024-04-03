import axios from 'axios';

const apiUrl = process.env.REACT_APP_URL;

export const buscarAmbientePorNombre = (nombre) => {
    return axios.post(`${apiUrl}/busquedaAula`, { patron: nombre })
        .then(function (response) {
            
            return response.data; // Devuelve los datos del ambiente encontrado
        })
        .catch(function (error) {
            console.log(error);
            return null; // Manejo del error: retorna null si hay un error en la búsqueda
        });
}

export const recuperarAmbientePorID = (id) => {
    return axios.get(`${apiUrl}/ambientes/${id}`)
        .then(function (response) {
            
            return response.data; // Devuelve los datos del ambiente encontrado
        });
        
}

