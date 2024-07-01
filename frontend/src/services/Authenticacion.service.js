import axios from "axios";
import api from "./Comun.service";

const apiUrl = process.env.REACT_APP_URL;
const apiBasedUrl = process.env.REACT_APP_BASED_URL;

export const login = async (email, password) => {
  await axios.get(`${apiBasedUrl}/sanctum/csrf-cookie`);
  return api
    .post(`${apiUrl}/login`, { email, password })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
};

export const logout = async () => {
  return api
    .post(`${apiUrl}/logout`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
};
