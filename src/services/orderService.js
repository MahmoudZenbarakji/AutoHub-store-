import apiClient from '../utils/apiClient';

export const getOrders = async (tab) => {
  const res = await apiClient.get(`/api/store/orders?tab=${encodeURIComponent(tab)}`);
  return res.data;
};

export const getOrderById = async (orderId) => {
  const res = await apiClient.get(`/api/store/orders/${orderId}`);
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await apiClient.post(`/api/store/orders/${orderId}/status`, {
    status,
  });
  return res.data;
};
