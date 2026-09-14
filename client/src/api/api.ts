import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() ||
  "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "jobTrackerToken"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);