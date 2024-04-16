import axios from 'axios';

const apiUrl = process.env.REACT_APP_URL;

export const recuperarSolicitudesDeReserva = (id) => {
    return axios.get(`${apiUrl}/solicitudesPorLlegada`)
        .then(function (response) {
            return response.data;
        });
}
export const recuperarSolicitudesDeReservaAceptadas = (id) => {
    return axios.get(`${apiUrl}/solicitudesAceptadas`)
        .then(function (response) {
            return response.data;
        });
}