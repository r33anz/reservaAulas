import axios from "axios";

const apiUrl = process.env.REACT_APP_URL;

export const getSolicitudPorId = (solicitudId) => {
    return axios.get(`${apiUrl}/${solicitudId}/recuperarInformacion`)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
            return null;
        });
}

export const vertificarDisponibilidad = (fechaReserva, ambiente, periodos) => {
    return axios
        .post(`${apiUrl}/consultarFechaPeriodAmbiente`, { fechaReserva, ambiente, periodos })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
            return null;
        });
}

export const aceptarSolicitud = (id) => {
    return axios.put(`${apiUrl}/aceptarSolicitud`, { id })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
            return null;
        });
}

export const rechazarSolicitud = (id, razonRechazo) => {
    return axios.put(`${apiUrl}/rechazarSolicitud`, { id, razonRechazo })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
            return null;
        });
}
