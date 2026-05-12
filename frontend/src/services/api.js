// src/services/api.js
import axios from "axios";

// Try multiple possible backend URLs
const getBaseURL = () => {
  let url = "";
  // First check env variable
  if (import.meta.env.VITE_API_URL) {
    url = import.meta.env.VITE_API_URL;
  } else if (import.meta.env.VITE_BASE_URL) {
    url = import.meta.env.VITE_BASE_URL;
  } else {
    // Fallback for local development
    url = "https://agropulse-bakcend.onrender.com/api/v1";
    //url = "http://localhost:8080/api/v1";
  }

  // Remove trailing slash if present
  url = url.replace(/\/+$/, "");

  // Ensure /v1 is present
  if (!url.endsWith("/v1")) {
    if (url.endsWith("/api")) {
      url += "/v1";
    } else {
      url += "/api/v1";
    }
  }

  return url;
};

const API_BASE_URL = getBaseURL();

console.log("API Base URL:", API_BASE_URL); // Check what URL is being used

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      `API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    );
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

// Crops APIs
export const cropsAPI = {
  getAll: () => api.get("/crops"),
  getById: (id) => api.get(`/crops/${id}`),
  create: (data) => api.post("/crops", data),
  update: (id, data) => api.put(`/crops/${id}`, data),
  delete: (id) => api.delete(`/crops/${id}`),
  getStats: () => api.get("/crops/stats/summary"),
};

// Equipment APIs
export const equipmentAPI = {
  getAll: () => api.get("/equipment"),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post("/equipment", data),
  update: (id, data) => api.put(`/equipment/${id}`, data),
  delete: (id) => api.delete(`/equipment/${id}`),
  getStats: () => api.get("/equipment/stats/summary"),
};

// Labor APIs
export const laborAPI = {
  getAll: () => api.get("/labor"),
  getById: (id) => api.get(`/labor/${id}`),
  create: (data) => api.post("/labor", data),
  update: (id, data) => api.put(`/labor/${id}`, data),
  delete: (id) => api.delete(`/labor/${id}`),
  getStats: () => api.get("/labor/stats/summary"),
};

// Expenses APIs
export const expensesAPI = {
  getAll: () => api.get("/expenses"),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post("/expenses", data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getStats: () => api.get("/expenses/stats/summary"),
};

// Harvests APIs
export const harvestsAPI = {
  getAll: () => api.get("/harvests"),
  getById: (id) => api.get(`/harvests/${id}`),
  create: (data) => api.post("/harvests", data),
  update: (id, data) => api.put(`/harvests/${id}`, data),
  delete: (id) => api.delete(`/harvests/${id}`),
  getStats: () => api.get("/harvests/stats/summary"),
};

// Dashboard stats
export const dashboardAPI = {
  getStats: async () => {
    try {
      const [crops, equipment, labor, expenses, harvests] = await Promise.all([
        cropsAPI.getStats().catch(() => ({ data: {} })),
        equipmentAPI.getStats().catch(() => ({ data: {} })),
        laborAPI.getStats().catch(() => ({ data: {} })),
        expensesAPI.getStats().catch(() => ({ data: {} })),
        harvestsAPI.getStats().catch(() => ({ data: {} })),
      ]);

      return {
        crops: crops.data,
        equipment: equipment.data,
        labor: labor.data,
        expenses: expenses.data,
        harvests: harvests.data,
      };
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      throw error;
    }
  },
};

export default api;
