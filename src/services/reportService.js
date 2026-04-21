import apiClient from '../utils/apiClient';

export const getReviews = async () => {
  const res = await apiClient.get('/api/store/reviews');
  return res.data;
};

export const getReportsSummary = async (from, to) => {
  const q = new URLSearchParams();
  if (from) {
    q.set('from', from);
  }
  if (to) {
    q.set('to', to);
  }
  const res = await apiClient.get(`/api/store/reports/summary?${q.toString()}`);
  return res.data;
};

export const getReportsOrders = async (from, to) => {
  const q = new URLSearchParams();
  if (from) {
    q.set('from', from);
  }
  if (to) {
    q.set('to', to);
  }
  const res = await apiClient.get(`/api/store/reports/orders?${q.toString()}`);
  return res.data;
};

/** GET /store/reports/top-sold-products — optional; summary often includes top_sold_products */
export const getTopSoldProducts = async (from, to, limit = 10) => {
  const q = new URLSearchParams();
  if (from) {
    q.set('from', from);
  }
  if (to) {
    q.set('to', to);
  }
  if (limit != null) {
    q.set('limit', String(limit));
  }
  const res = await apiClient.get(`/api/store/reports/top-sold-products?${q.toString()}`);
  return res.data;
};

export const exportReports = async (from, to) => {
  const q = new URLSearchParams();
  if (from) {
    q.set('from', from);
  }
  if (to) {
    q.set('to', to);
  }
  const res = await apiClient.get(`/api/store/reports/export?${q.toString()}`, {
    responseType: 'blob',
  });
  return res;
};
