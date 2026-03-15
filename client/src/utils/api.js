import axios from 'axios';

// In dev, use relative /api so Vite proxy forwards to the backend; no CORS or .env needed.
const baseURL = import.meta.env.DEV
  ? '/api'
  : `${import.meta.env.VITE_API_URL || ''}/api`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};



