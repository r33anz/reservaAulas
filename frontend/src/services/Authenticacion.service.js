import api from "./Comun.service";

const apiUrl = process.env.REACT_APP_URL;

export const login = async (email, password) => {
  await api.get("/sanctum/csrf-cookie");
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
