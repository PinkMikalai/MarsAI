import api from './api';

export const searchService = {
  getSearchVideos: (search) => api.get('/videos/search', { params: search }),
};

