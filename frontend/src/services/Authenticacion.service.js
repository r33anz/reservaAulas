import axios from "axios";

const apiUrl = process.env.REACT_APP_URL;

export const login = async (email, password) => {
  return axios
    .post(`${apiUrl}/login`, { email, password })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
};
