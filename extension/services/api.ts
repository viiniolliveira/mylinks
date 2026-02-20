import axios, { AxiosHeaders } from 'axios';

export function normalizeBaseUrl(value: string) {
  let url = value.trim();

  if (!url) return '';

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  return url.replace(/\/+$/, '');
}

export function getBaseUrl() {
  return normalizeBaseUrl(localStorage.getItem('baseUrl') || '');
}

const api = axios.create();

api.interceptors.request.use((config) => {
  const baseUrl = getBaseUrl();

  if (baseUrl) {
    config.baseURL = baseUrl;
  }

  const token = localStorage.getItem('token');

  if (token) {
    const headers = (config.headers ?? new AxiosHeaders()) as AxiosHeaders;
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }

  return config;
});

export default api;
