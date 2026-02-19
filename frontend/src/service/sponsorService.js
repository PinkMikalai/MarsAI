import api from './api';

const getApi = () => import.meta.env.VITE_API_URL?.replace(/\/marsai\/?$/, '') || '';

const buildSponsorImageUrl = (filename) => {
  if (!filename) return null;
  if (/^https?:\/\//.test(filename)) return filename;
  const origin = getApi();
  const path = filename.includes('assets/uploads') ? filename.replace(/^\//, '') : `assets/uploads/images/${filename.replace(/^\//, '')}`;
  return `${origin}/${path}`;
};

export const sponsorService = {
  getAll: () => api('/sponsors', { method: 'GET' }),

  getById: (id) => api(`/sponsors/${id}`, { method: 'GET' }),

  create: (formData) =>
    api('/sponsors', {
      method: 'POST',
      body: formData,
    }),

  update: (id, formData) =>
    api(`/sponsors/${id}`, {
      method: 'PUT',
      body: formData,
    }),

  delete: (id) => api(`/sponsors/${id}`, { method: 'DELETE' }),

  getSponsorImageUrl: buildSponsorImageUrl,
};
