import apiClient from '../utils/apiClient';

export const getDashboardHome = async () => {
  const response = await apiClient.get('/api/store/dashboard/home');
  return response.data;
};

export const updateStoreStatus = async (isOnline) => {
  const res = await apiClient.post('/api/store/dashboard/status', {
    is_online: isOnline,
  });
  return res.data;
};
