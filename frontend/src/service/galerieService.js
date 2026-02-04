
import api from './api';


export const videosService = {
  getAllVideos: async () => {
    console.log(' galerieService: Début de getAllVideos()');
    try {
      const response = await api.get('/videos');
      console.log(' galerieService: Réponse reçue:', response.data);
      console.log(' galerieService: Nombre de vidéos:', response.data?.data?.length || 0);
      return response.data;
    } catch (error) {
      console.error(' galerieService: Erreur:', error);
      console.error(' galerieService: Détails erreur:', error.response?.data);
      throw error;
    }
  },
  
  getVideoTags: async (videoId) => {
    try {
      const response = await api.get(`/videos/${videoId}`);
      return response.data?.tags || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des tags pour la vidéo ${videoId}:`, error);
      return [];
    }
  }
};


export function getCoverImageUrl(cover) {
  if (!cover) return '';
  if (cover.startsWith('http://') || cover.startsWith('https://')) return cover;
  const base = import.meta.env.VITE_API_URL || '';
  const origin = base.replace(/\/marsai\/?$/, '') || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${origin}/${cover.replace(/^\//, '')}`;
}