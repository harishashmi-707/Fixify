import axios from 'axios';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const apiBaseUrl = VITE_API_BASE_URL;
export const assetBaseUrl = VITE_API_BASE_URL === '/api'
  ? ''
  : VITE_API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');

export const assetUrl = (path) => {
  if (!path) return '';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${assetBaseUrl}${normalizedPath}`;
};

export const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const tokens = JSON.parse(localStorage.getItem('authTokens'));
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});
