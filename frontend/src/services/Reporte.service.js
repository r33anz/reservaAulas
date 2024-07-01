import api from "./Comun.service";

const apiUrl = process.env.REACT_APP_URL;

export const getReporte = async () => {
    return api
      .get(`${apiUrl}/generarReporte`)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
        return [];
      });
  };