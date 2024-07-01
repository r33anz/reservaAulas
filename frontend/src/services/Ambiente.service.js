import api from "./Comun.service";

const apiUrl = process.env.REACT_APP_URL;

export const getBloques = () => {
  return [
    { id: 1, name: "Bloque central", pisos: 3 },
    { id: 2, name: "Bloque academico", pisos: 4 },
    { id: 3, name: "Edificio Nuevo", pisos: 6 },
    { id: 4, name: "MEMI", pisos: 4 },
    { id: 5, name: "Bloque informatica", pisos: 3 },
  ];
};

export const getTiposDeAmbiente = () => {
  return [{ name: "Aula" }, { name: "Laboratorio" }, { name: "Auditorio" }];
};

export const registrarAmbiente = (ambiente) => {
  return api
    .post(`${apiUrl}/registroAmbiente`, ambiente)
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
};

export const getAmbientes = () => {
  return api
    .get(`${apiUrl}/ambientes`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
};

export const getPeriodosReservados = (ambienteId, fecha) => {
  return api
    .get(`${apiUrl}/periodosReservados/${fecha}/${ambienteId}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
};
