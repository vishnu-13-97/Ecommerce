import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

console.log("API BASE URL:", import.meta.env.VITE_API_URL);

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default API;
