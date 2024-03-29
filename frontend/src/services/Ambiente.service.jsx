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
    axios.post(`${apiUrl}/registroAmbiente`, ambiente)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
}