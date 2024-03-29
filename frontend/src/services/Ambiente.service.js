import axios from 'axios';

const apiUrl = process.env.REACT_APP_URL;

export const getBloques = () => {
    return [
        { id: 1, name: "Edificio Nuevo" },
        { id: 2, name: "Bloque Antiguo" },
        { id: 3, name: "Departamento de Fisica" },
        { id: 4, name: "MEMI" },
        { id: 5, name: "Laboratorios" },
    ];
}

export const getTiposDeAmbiente = () => {
    return [
        { id: 1, name: "Aula común" },
        { id: 2, name: "Laboratorios" },
        { id: 3, name: "Sala de Informatica" },
        { id: 4, name: "Auditorio" },
    ];
}

export const getPiso = () => {
    return [{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }];
}

export const registrarAmbiente = (ambiente) => {
    return axios.post(`${apiUrl}/registroAmbiente`, ambiente)
        .then((response) => {
            console.log(response.data);
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response.data);
                let errors = [];
                for (const [key, value] of Object.entries(error.response.data.errors)) {
                    errors.push(`${key}: ${value}`);
                }
                return Promise.reject(errors.toString());
            } else if (error.request) {
                console.log(error.request);
                return Promise.reject(error.request);
            } else {
                console.log("Error", error.message);
                return Promise.reject(error.message);
            }
        });
}