import axios from 'axios';

export function getAxiosErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === 'string' && data.trim()) {
      return data;
    }
    if (data && typeof data === 'object') {
      const message = data.message ?? data.error ?? data.detail;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }
    if (error.response?.status === 401) {
      return 'Invalid username or password';
    }
    return error.message || 'Request failed';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
