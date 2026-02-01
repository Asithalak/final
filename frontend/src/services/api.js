import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Furniture API
export const furnitureAPI = {
  getAll: (params) => api.get('/furniture', { params }),
  getMyFurniture: (params) => api.get('/furniture/my-furniture', { params }),
  getByCarpenter: (carpenterId) => api.get(`/furniture/carpenter/${carpenterId}`),
  getById: (id) => api.get(`/furniture/${id}`),
  create: (formData) => api.post('/furniture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/furniture/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  approve: (id) => api.put(`/furniture/${id}/approve`),
  delete: (id) => api.delete(`/furniture/${id}`),
  addReview: (id, review) => api.post(`/furniture/${id}/review`, review),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, status),
  updatePayment: (id, paymentStatus) => api.put(`/orders/${id}/payment`, paymentStatus),
  cancel: (id) => api.delete(`/orders/${id}`),
};

// Resources API
export const resourcesAPI = {
  getAll: (params) => api.get('/resources', { params }),
  getMyResources: (params) => api.get('/resources/my-resources', { params }),
  getByCarpenter: (carpenterId) => api.get(`/resources/carpenter/${carpenterId}`),
  getById: (id) => api.get(`/resources/${id}`),
  create: (formData) => api.post('/resources', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/resources/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  approve: (id) => api.put(`/resources/${id}/approve`),
  purchase: (id, data) => api.post(`/resources/${id}/purchase`, data),
  delete: (id) => api.delete(`/resources/${id}`),
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getCarpenters: () => api.get('/users/carpenters'),
  getCustomers: () => api.get('/users/customers'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  approve: (id) => api.put(`/users/${id}/approve`),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
