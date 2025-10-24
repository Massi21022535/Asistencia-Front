import axios from "axios"; //libreria para llamadas http desde el front

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // conexion con el backend para peticiones
});

// con esto antes de realizar cualquier solicitud busco un token y lo agrego como encabezado
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;