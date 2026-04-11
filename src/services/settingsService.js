import apiClient from '../utils/apiClient';

export const getSettings = async () => {
  const res = await apiClient.get('/api/store/settings');
  return res.data;
};

export const updateGeneralSettings = async (data) => {
  const res = await apiClient.put('/api/store/settings/general', data);
  return res.data;
};

export const updateWorkingHours = async (data) => {
  const res = await apiClient.put('/api/store/settings/hours', data);
  return res.data;
};

export const getSupport = async () => {
  const res = await apiClient.get('/api/store/support');
  return res.data;
};

export const getAbout = async () => {
  const res = await apiClient.get('/api/store/about');
  return res.data;
};

export const changeLanguage = async (lang) => {
  const res = await apiClient.post('/api/store/language', {
    language: lang,
  });
  return res.data;
};
