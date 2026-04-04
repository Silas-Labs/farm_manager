import axios from "axios";

const { url, timeout } = import.meta.env;

export const AXIOS = axios.create({
  baseURL: url,
  timeout: timeout,
  headers: {
    "Content-Type": "application/json",
  },
});
