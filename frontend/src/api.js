import axios from 'axios'; // <-- Add this line to import axios

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL||"/api";
console.log("API Base URL:", BACKEND_URL); // <-- log it to console

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
