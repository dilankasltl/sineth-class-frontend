import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

// Request Interceptor to add JWT Auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('tuition_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
