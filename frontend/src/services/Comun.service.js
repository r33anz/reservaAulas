import axios from "axios";

const apiUrl = process.env.REACT_APP_URL;

const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
});

export default api;