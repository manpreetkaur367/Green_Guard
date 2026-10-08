import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("gg_token") || sessionStorage.getItem("gg_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  profile: () => api.get("/auth/me"),
};

export const detectionApi = {
  analyze: (formData) => axios.post(`${API_BASE_URL}/detections/analyze`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  list: () => api.get("/detections"),
  create: (payload) => api.post("/detections", payload),
};

export default api;
