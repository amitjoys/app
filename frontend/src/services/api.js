import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  // Check if it's an admin route
  if (config.url.includes('/admin/')) {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// User APIs
export const userAPI = {
  getCredits: async () => {
    const response = await api.get('/users/credits');
    return response.data;
  },
  upgradePlan: async (planId) => {
    const response = await api.post('/users/upgrade', { planId });
    return response.data;
  },
};

// Insights APIs
export const insightsAPI = {
  search: async (query) => {
    const response = await api.post('/insights/search', { query });
    return response.data;
  },
  export: async (searchId, format) => {
    const response = await api.post('/insights/export', { searchId, format });
    return response.data;
  },
};

// Pricing APIs
export const pricingAPI = {
  getPlans: async () => {
    const response = await api.get('/pricing/plans');
    return response.data;
  },
};

// SEO APIs
export const seoAPI = {
  getSettings: async (page) => {
    const response = await api.get(`/seo-settings/${page}`);
    return response.data;
  },
};

// Admin Auth APIs
export const adminAuthAPI = {
  login: async (data) => {
    const response = await api.post('/admin/auth/login', data);
    return response.data;
  },
};

// Admin APIs
export const adminAPI = {
  // Pricing Plans
  getPricing: async () => {
    const response = await api.get('/admin/pricing');
    return response.data;
  },
  createPricing: async (data) => {
    const response = await api.post('/admin/pricing', data);
    return response.data;
  },
  updatePricing: async (id, data) => {
    const response = await api.put(`/admin/pricing/${id}`, data);
    return response.data;
  },
  deletePricing: async (id) => {
    const response = await api.delete(`/admin/pricing/${id}`);
    return response.data;
  },
  
  // Payment Settings
  getPaymentSettings: async () => {
    const response = await api.get('/admin/payment-settings');
    return response.data;
  },
  updatePaymentSettings: async (data) => {
    const response = await api.put('/admin/payment-settings', data);
    return response.data;
  },
  
  // SEO Settings
  getSEOSettings: async () => {
    const response = await api.get('/admin/seo-settings');
    return response.data;
  },
  updateSEOSettings: async (page, data) => {
    const response = await api.put(`/admin/seo-settings/${page}`, data);
    return response.data;
  },
  
  // Users
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  updateUserCredits: async (userId, credits) => {
    const response = await api.put(`/admin/users/${userId}/credits`, credits);
    return response.data;
  },
};

export default api;
