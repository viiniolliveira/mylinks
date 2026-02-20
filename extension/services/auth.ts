import api, { normalizeBaseUrl } from './api';

export interface LoginPayload {
  baseUrl: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const normalizedBaseUrl = normalizeBaseUrl(payload.baseUrl);

  if (!normalizedBaseUrl) {
    throw new Error('Base URL invalida');
  }

  localStorage.setItem('baseUrl', normalizedBaseUrl);

  const response = await api.post<LoginResponse>(
    '/api/auth/login',
    {
      email: payload.email,
      password: payload.password,
    },
    {
      baseURL: normalizedBaseUrl,
    }
  );

  return response.data;
}
