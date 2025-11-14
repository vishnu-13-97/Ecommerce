import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, 
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default API;
