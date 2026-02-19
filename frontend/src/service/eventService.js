import api from './api';

export const eventService = {
  getAll: () => api('/events', { method: 'GET' }),

  getById: (id) => api(`/events/${id}`, { method: 'GET' }),

  create: (formData) =>
    api('/events', {
      method: 'POST',
      body: formData,
    }),

  update: (id, formData) =>
    api(`/events/${id}`, {
      method: 'PUT',
      body: formData,
    }),

  delete: (id) =>
    api(`/events/${id}`, {
      method: 'DELETE',
    }),
};
