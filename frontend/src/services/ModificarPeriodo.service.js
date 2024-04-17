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

export const modificarPerio = (idAmbiente,fecha) => {
    return axios.post(`${apiUrl}/buscarInhabilitados`,{idAmbiente:idAmbiente, fecha:fecha })
        .then(function (response) {
            console.log(response.data);
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