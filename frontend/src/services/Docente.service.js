import axios from "axios";

const apiUrl = process.env.REACT_APP_URL;

export const getDocentes = () => {
    return axios.get(`${apiUrl}/listaDocentes`)
      .then(function (response) {
        return response.data; // Devuelve los datos de los docentes encontrados
      })
      .catch(function (error) {
        console.error("Error al obtener la lista de docentes:", error);
        throw error;
      });
  };