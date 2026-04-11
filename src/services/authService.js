import apiClient from '../utils/apiClient';

export function extractAuthTokenFromResponse(payload) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const nested =
    payload.data && typeof payload.data === 'object' ? payload.data : null;
  return (
    payload.token ??
    payload.access_token ??
    payload.access ??
    nested?.token ??
    nested?.access_token ??
    null
  );
}

export async function login(credentials) {
  const response = await apiClient.post('/api/auth/login', credentials);
  return response.data;
}

export async function forgotPassword(username) {
  const response = await apiClient.post('/api/auth/store/forgot-password', {
    username,
  });
  return response.data;
}

export async function resetPassword(data) {
  const response = await apiClient.post('/api/auth/store/reset-password', data);
  return response.data;
}

export async function logout() {
  const response = await apiClient.post('/api/auth/logout');
  return response.data;
}
