import axios from "axios";

const envApiUrl =
  import.meta.env.VITE_API_URL?.trim();

const API_BASE_URL =
  envApiUrl ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://job-tracker-xj7p.onrender.com/api");

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