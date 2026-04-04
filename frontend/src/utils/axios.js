import axios from "axios";

const { VITE_BASE_URL, VITE_TIMEOUT, VITE_PORT } = import.meta.env;

 const AXIOS = axios.create({
  baseURL: VITE_BASE_URL + VITE_PORT,
  timeout: VITE_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

export default AXIOS
