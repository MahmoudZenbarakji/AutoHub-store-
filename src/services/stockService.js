import apiClient from '../utils/apiClient';

const STOCK_BASE = '/api/store/stock';

// Categories
export const getCategoriesTree = async () => {
  const res = await apiClient.get(`${STOCK_BASE}/categories/tree`);
  return res.data;
};

export const createCategory = async (data) => {
  const res = await apiClient.post(`${STOCK_BASE}/categories`, data);
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await apiClient.put(`${STOCK_BASE}/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await apiClient.delete(`${STOCK_BASE}/categories/${id}`);
  return res.data;
};

// Products
/** GET /store/stock/products?q=&category_id= */
export const getProducts = async (q = '', categoryId = '') => {
  const params = new URLSearchParams();
  const qs = String(q).trim();
  if (qs) params.set('q', qs);
  if (categoryId) params.set('category_id', String(categoryId));
  const query = params.toString();
  const res = await apiClient.get(`${STOCK_BASE}/products${query ? `?${query}` : ''}`);
  return res.data;
};

export const createProduct = async (data) => {
  const res = await apiClient.post(`${STOCK_BASE}/products`, data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await apiClient.put(`${STOCK_BASE}/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await apiClient.delete(`${STOCK_BASE}/products/${id}`);
  return res.data;
};

// Import / Export
export const importStock = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.post(`${STOCK_BASE}/import`, formData);
  return res.data;
};

export const exportStock = async () => {
  const res = await apiClient.get(`${STOCK_BASE}/export`, {
    responseType: 'blob',
  });
  return res;
};
