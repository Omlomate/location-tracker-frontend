import axios from 'axios';

const API = axios.create({
  baseURL: 'https://location-fetching-backend.onrender.com', // Replace with your backend URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login API
export const login = (credentials) => API.post('/api/auth/login', credentials);

// Register API
export const register = (userData) => API.post('/api/auth/register', userData);

// Fetch all users
export const fetchUsers = () => API.get('/api/admin/users');

// Fetch locations by user ID
export const fetchLocations = (userId) => API.get(`/locations/${userId}`);

// Save a new location
export const saveLocation = (data) => API.post('/location', data);

export const trackLocation = (data) => API.post('/api/location/location', data);

// Fetch location logs by user ID
export const fetchLocationLogs = (userId) => API.get(`/api/admin/location-logs/${userId}`);

// Fetch the latest location for a user
export const fetchUserLocation = (userId) => API.get(`/api/admin/location/${userId}`);

// Fetch login logs by user ID (using Axios)
export const fetchLoginLogs = (userId) => {
  return API.get(`/api/admin/login-logs/${userId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching login logs:', error);
      throw error;
    });
};
